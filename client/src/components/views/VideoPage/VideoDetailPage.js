import React, { useEffect, useState } from "react";
import { List, Avatar, Row, Col } from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscriber from "./Sections/Subscriber";
import CommentList from "./Sections/CommentList";
import LikeDislikes from "./Sections/LikeDislikes";
import "./Video.css";

function DetailVideoPage(props) {
  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const [commentList, setCommentList] = useState([]);

  const videoVariable = {
    videoId: videoId,
  };

  useEffect(() => {
    axios.post("/api/video/getVideoDetail", videoVariable).then((response) => {
      if (response.data.success) {
        console.log(response.data.videoDetail);
        setVideo(response.data.videoDetail);
      } else {
        alert("Failed to get video Info");
      }
    });
    //모든 댓글 가져오기
    axios.post("/api/comment/getComments", videoVariable).then((response) => {
      if (response.data.success) {
        console.log("response.data.comments", response.data.comments);
        setCommentList(response.data.comments);
      } else {
        alert("Failed to get video Info");
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setCommentList(commentList.concat(newComment));
  };

  if (Video.writer) {
    return (
      <Row>
        <Col xl={18} lg={24}>
          {" "}
          {/*브라우저 사이즈가 작을때는 컴포넌트가 전체화면(24)을 사용 */}
          <div className="postPage">
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${Video.filePath}`}
              controls
            ></video>
            {/*왜 굳이 actions에 넣었을까? */}
            <List.Item
              actions={[
                <LikeDislikes
                  video
                  videoId={videoId}
                  userId={localStorage.getItem("userId")}
                />,
                <Subscriber
                  userTo={Video.writer._id}
                  userFrom={localStorage.getItem("userId")}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={Video.title}
                description={Video.description}
              />
            </List.Item>

            <CommentList
              commentList={commentList}
              postId={Video._id}
              refreshFunction={updateComment}
            />
          </div>
        </Col>
        <Col xl={6} lg={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default DetailVideoPage;
