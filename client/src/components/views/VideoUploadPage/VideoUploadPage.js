import React, { useState } from "react";
import { Typography, Button, Form, Message, Input } from "antd"; //ant Design
import TextArea from "antd/lib/input/TextArea";
import Axios from "axios";
import { useSelector } from "react-redux";

import Dropzone from "react-dropzone";

const { Title } = Typography;
//const { TextArea } = Input;
const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user); //redux로 가져오는 값

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState("");
  const [Category, setCategory] = useState("");
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
    setPrivate(e.currentTarget.value);
  };
  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
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
        Axios.post("/api/video/thumbnail", variable).then(
          //http://localhost:5000/
          (response) => {
            if (response.data.success) {
              //console.log(response.data);
              setDuration(response.data.fileDuration);
              setThumbnail(response.data.thumbsFilePath);
            } else {
              alert("Failed to make the thumbnails");
            }
          }
        );
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
      category: Category,
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
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop zone */}
          {/* multiple 속성 : 한번에 파일을 여러개 올릴건지 
              maxSize 속성 : 파일 최대 사이즈 */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                plus
              </div>
            )}
          </Dropzone>
          {/* Thumbnail */}
          {Thumbnail && (
            <div>
              <img src={`http://localhost:5000/${Thumbnail}`} alt="thumbnail" />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>VideoTitle</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
