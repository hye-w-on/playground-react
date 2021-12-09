import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import "./Comment.css";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

function Reply(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);
  useEffect(() => {
    let commentNumber = 0;
    props.commentList.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentList, props.parentCommentId]); // []안의 값이 변경되면 실행됨

  let renderReplyComment = (parentCommentId) =>
    props.commentList.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.responseTo === parentCommentId && ( //부모의 CommentId와 대댓글의 responseTo CommentId가 같다면
          <div className="reply-itmem">
            <CommentItem
              comment={comment}
              postId={props.postId}
              refreshFunction={props.refreshFunction}
            />
            <Reply
              commentList={props.commentList}
              parentCommentId={comment._id}
              postId={props.postId}
              refreshFunction={props.refreshFunction}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const handleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber < 1 ? (
        ""
      ) : OpenReplyComments ? (
        <p className="reply-open" onClick={handleChange}>
          Close <UpOutlined />
        </p>
      ) : (
        <p className="reply-open" onClick={handleChange}>
          View {ChildCommentNumber} more comment(s) <DownOutlined />
        </p>
      )}
      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default Reply;
