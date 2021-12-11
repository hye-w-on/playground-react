const axios = require("axios");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const { auth } = require("../middleware/auth");

const getExchange = async () => {
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

const getPreExchange = async () => {
  let response;
  try {
    response = await axios.get(
      "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=DHYwVp9lk9jbrWLi7VUoL8Lh3Jf6tD2P&searchdate=20211202&data=AP01"
    );
  } catch (e) {
    console.log(e);
  }
  return response;
};

router.get("/getExchangeList", (req, res) => {
  getExchange().then((response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(response.data);
    return res;
  });
});

router.get("/getPreExchangeList", (req, res) => {
  getPreExchange().then((response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(response.data);
    return res;
  });
});

module.exports = router;
