import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import Reply from "./Reply";
import "./Comment.css";

const { TextArea } = Input;

function CommentList(props) {
  const user = useSelector((state) => state.user); // redux로 user 가져오기

  const [comment, setComment] = useState("");
  const [commentCnt, setCommentCnt] = useState(0);

  useEffect(() => {
    setCommentCnt(props.commentList.length);
  }, [props.commentList]); // []안의 값이 변경되면 실행됨

  const handleChange = (e) => {
    setComment(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault(); //버튼 클릭시 refresh 하지않도록 막음

    const variables = {
      content: comment, // 댓글 내용
      writer: user.userData._id, //작성자
      postId: props.postId, //어떤 비디오의 댓글인지
    };

    axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setComment("");
        props.refreshFunction(response.data.result);
      } else {
        alert("Failed to save Comment");
      }
    });
  };

  return (
    <div>
      <br />
      <p>댓글 {commentCnt}개</p>
      <hr />
      {/* Comment Form */}
      <form className="comment-form" onSubmit={onSubmit}>
        <TextArea
          onChange={handleChange}
          value={comment}
          placeholder="comments.. 아직 삭제/수정 기능이 없습니다"
        />
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </form>
      {/* Comment Lists  */}
      {props.commentList &&
        props.commentList.map(
          (comment, index) =>
            !comment.responseTo && ( //대댓글 user 정보가 없는 댓글(대댓글이 아닌 댓글)
              <React.Fragment key={index}>
                {/* div나 React.Fragment로 최상위를 감싸줘야함 */}
                <CommentItem
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <Reply
                  commentList={props.commentList}
                  postId={props.postId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}
    </div>
  );
}

export default CommentList;
