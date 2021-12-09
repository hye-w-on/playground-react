import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Row } from "antd";
import Axios from "axios";
import moment from "moment";
import "./Video.css";
import {
  PlaySquareOutlined,
  LikeOutlined,
  PlaySquareTwoTone,
  HeartTwoTone,
} from "@ant-design/icons";

const { Meta } = Card;

function VideoListPage() {
  const [Videos, setVideos] = useState([]); // [] Array임

  useEffect(() => {
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        console.log(response);
        setVideos(response.data.videos);
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);

  const videoCards = Videos.map((video, index) => {
    // Videos가 []Array기 때문에 Map 사용가능, 갯수만큼 반복
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        {/* 브라우저 크기에 따라 컬럼 개수를 조절하는 antd 문법 */}
        <Card
          hoverable
          cover={
            <div className="thumbnail">
              <a href={`/video/${video._id}`}>
                <img src={`http://localhost:5000/${video.thumbnail}`} />
                <div className="video-time">
                  {minutes}:{seconds}
                </div>
              </a>
            </div>
          }
        >
          <Meta
            avatar={<Avatar src={video.writer.image} />}
            title={video.title}
          />
          <span className="video-writer">{video.writer.name} </span>
          <hr />
          <span className="video-detail">
            <PlaySquareOutlined />
            &nbsp;{video.views}&nbsp;
            <HeartTwoTone title="좋아요 수를 가져오고 싶은데 noSQL은 join이 불가해서 방법을 공부해야함" />
            &nbsp;{video.views}&nbsp;&nbsp;
            <span className="video-created">
              {moment(video.createdAt).format("YYYY-MM-DD")}&nbsp;
            </span>
          </span>
        </Card>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <p>ALL</p>
      <hr />
      <Row gutter={16}>{videoCards} </Row>
      {/* gutter : Col간 간격 */}
    </div>
  );
}

export default VideoListPage;
