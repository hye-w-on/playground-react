import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Avatar, Col, Row } from "antd";
import moment from "moment";
import "../Video.css";
import { PlaySquareOutlined } from "@ant-design/icons";

const { Meta } = Card;
function SideVideo() {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("Failed to get Videos");
      }
    });
  }, []);

  const sideVideoItem = SideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);
    //style={{ display: "flex", flexDirection: "row" }}
    return (
      <Card
        hoverable
        className="side-video-card"
        cover={
          <div className="thumbnail-side">
            <a href={`/video/${video._id}`}>
              <img src={`http://localhost:5000/${video.thumbnail}`} />
              <div className="video-time">
                {minutes}:{seconds}
              </div>
            </a>
          </div>
        }
      >
        <span className="video-title">{video.title} </span>
        <span className="video-writer">{video.writer.name} </span>
        <span className="video-detail">
          <PlaySquareOutlined />
          &nbsp;{video.views}&nbsp;
          <span className="video-created">
            {moment(video.createdAt).format("YYYY-MM-DD")}&nbsp;
          </span>
        </span>
      </Card>
    );
  });

  return (
    <div className="sideVideos">
      Others
      <hr />
      {sideVideoItem}
    </div>
  );
}

export default SideVideo;
