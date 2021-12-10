const axios = require("axios");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const { auth } = require("../middleware/auth");

const exchange = async () => {
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

router.get("/getExchangeList", (req, res) => {
exchange().then((response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(response.data);
    return res.json(response.data);
  });
});

module.exports = router;