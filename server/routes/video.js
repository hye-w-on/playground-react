//const axios = require("axios");
//const bodyParser = require("body-parser");
//var qs = require("querystring");

const express = require("express");
const router = express.Router();
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const { auth } = require("../middleware/auth");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

const currentPut = async () => {
  let response;
  try {
    response = await axios.get(
      "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=DHYwVp9lk9jbrWLi7VUoL8Lh3Jf6tD2P&searchdate=20211203&data=AP01"
    );
  } catch (e) {
    console.log(e);
  }
  return response;
};

//=================================
//             Video
//=================================

router.post("/uploads", (req, res) => {
  //클라이언트에서 받은 파일을 서버에 저장한다
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/thumbnail", (req, res) => {
  //썸네일 생성, 비디오 러닝타임 가져오기
  let thumbsFilePath = "";
  let fileDuration = "";

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePath)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      // 끝난 후 할 작업
      console.log("Screenshots taken");
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3, //썸네일 생성 개수
      folder: "uploads/thumbnails", //썸네일 저장위치
      size: "320x240", //썸네일 사이즈
      // %b input basename, %b는 원본파일이름 ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});

//비디오 정보 저장
router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);

  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//비디오 리스트 가져오기
router.get("/getVideos", (req, res) => {
  /*  currentPut().then((response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(response.data);
   // res.json(response.data.response.body);
  });*/
  Video.find() //mongoose function
    .populate("writer") //??
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

//비디오 상세정보 가져오기
router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videoDetail });
    });
});

//구독 비디오 리스트 가져오기
router.get("/getSubscriptionVideos", (req, res) => {
  //구독 중인 사람들을 찾는다
  Subscriber.find({ userFrom: req.body.userFrom }).exec((err, subscribers) => {
    if (err) return res.status(400).send(err);

    let subscribedUser = [];

    subscribers.map((subscriber, i) => {
      subscribedUser.push(subscriber.userTo);
    });

    //찾은 사람들의 비디오를 가지고 온다
    Video.find({
      writer: { $in: subscribedUser }, //mogoDB 문법
    })
      .populate("writer")
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  });
});

module.exports = router;
