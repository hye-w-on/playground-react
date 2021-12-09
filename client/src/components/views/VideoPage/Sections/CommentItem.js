import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";
import "./Comment.css";

const { TextArea } = Input;
function CommentItem(props) {
  const user = useSelector((state) => state.user);
  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false); //댓글 숨김
  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const openReply = () => {
    setOpenReply((OpenReply) => !OpenReply);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id, // 작성자
      postId: props.postId, //어떤 비디오의 댓글인지
      responseTo: props.comment._id, // 어떤 댓글의 대댓글인지
      content: CommentValue,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setCommentValue("");
        setOpenReply(!OpenReply);
        props.refreshFunction(response.data.result);
      } else {
        alert("Failed to save Comment");
      }
    });
  };
  return (
    <div>
      <Comment
        actions={[
          <LikeDislikes
            comment
            commentId={props.comment._id}
            userId={localStorage.getItem("userId")}
          />,
          <span className="replyto" onClick={openReply}>
            Reply to
          </span>,
        ]}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      ></Comment>

      {OpenReply && ( //OpenReply가 true 일때만 표시
        <form className="comment-form comment-form-reply" onSubmit={onSubmit}>
          <TextArea
            onChange={handleChange}
            value={CommentValue}
            placeholder="write some comments"
          />
          <br />
          <Button type="primary" onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default CommentItem;
