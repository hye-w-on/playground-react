import React, { useState } from "react";
import { Button, Form, Radio, Input, Switch, PageHeader } from "antd"; //ant Design
import Axios from "axios";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const PrivateOptions = [
  { value: "Public", label: "Public" },
  { value: "Private", label: "Private" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user); //redux로 가져오는 값

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState("");
  const [CommentEnable, setCommentEnable] = useState(true); // true : Enable, false: Disable
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };
  const onPrivateChange = (e) => {
    setPrivate(e.target.value);
  };
  const onCommentEnableChange = (e) => {
    setCommentEnable(e);
    console.log(CommentEnable);
  };
  //파일을 전송하는 함수
  const onDrop = (files) => {
    //files 파라미터 : 파일에 대한 정보
    let formData = new FormData();
    const config = {
      //파일을 보낼 때 이 정보를 같이 보내주지 않으면 오류가 생김
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/video/uploads", formData, config).then((response) => {
      if (response.data.success) {
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };
        setFilePath(response.data.filePath);
        //gerenate thumbnail with this filepath !
        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnail(response.data.thumbsFilePath);
          } else {
            alert("Failed to make the thumbnails");
          }
        });
      } else {
        alert("비디오 업로드가 실패했습니다");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      commentEnable: CommentEnable,
      duration: Duration,
      thumbnail: Thumbnail,
    };

    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        alert("video Uploaded Successfully");
        props.history.push("/"); // function VideoUploadPage(props)
      } else {
        alert("Failed to upload video");
      }
    });
  };
  return (
    <React.Fragment>
      <PageHeader
        className="upload-menu-text"
        title="Upload Video"
        subTitle="동영상을 업로드 할 수 있습니다"
      />
      <div className="upload-container">
        <Form
          onFinish={onSubmit}
          labelCol={{
            span: 6,
          }}
          initialValues={{
            "privacy-option": "Public",
            "comment-option": true,
          }}
        >
          <div className="file-upload-form">
            {/* Drop zone */}
            {/* multiple 속성 : 한번에 파일을 여러개 올릴건지 
              maxSize 속성 : 파일 최대 사이즈 */}
            <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000000}>
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <UploadOutlined />
                </div>
              )}
            </Dropzone>
            {/* Thumbnail */}
            <div className="thumbnail-preview">
              {Thumbnail ? (
                <img
                  src={`http://localhost:5000/${Thumbnail}`}
                  alt="thumbnail"
                />
              ) : (
                "Thumbnail Preview"
              )}
            </div>
          </div>
          <br />
          <Form.Item
            label="Video Title"
            name="video-title"
            rules={[
              {
                required: true,
                message: "Please input Video's Title",
              },
            ]}
          >
            <Input onChange={onTitleChange} value={VideoTitle} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input Video's Description",
              },
            ]}
          >
            <TextArea onChange={onDescriptionChange} value={Description} />
          </Form.Item>
          <Form.Item name="privacy-option" label="Privacy Option">
            <Radio.Group onChange={onPrivateChange}>
              {PrivateOptions.map((item, index) => (
                <Radio key={index} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="comment-option"
            label="Comment Option"
            valuePropName="checked"
          >
            <Switch
              checked={CommentEnable}
              checkedChildren="Enable"
              unCheckedChildren="Disable"
              onChange={() => {
                onCommentEnableChange(!CommentEnable);
              }}
            />
          </Form.Item>
          <br />
          <Button type="primary" size="large" onClick={onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    </React.Fragment>
  );
}

export default VideoUploadPage;
