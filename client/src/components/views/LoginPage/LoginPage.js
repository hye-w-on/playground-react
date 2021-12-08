import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";

function LoginPage(props) {
  const dispatch = useDispatch();
  const pageOption = props.match.params.pageOption;

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [formErrorMessage, setFormErrorMessage] = useState("");

  const Comment = () => {
    switch (pageOption) {
      case "welcome":
        return <p>welcome to playgroud</p>;
      case "need":
        return <p>you need login</p>;
      default:
        return null;
    }
  };

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onSubmitHandler = (e) => {
    // e.preventDefault(); //antd Form에는 필요X
    let body = {
      email: Email,
      password: Password,
    };
    //Axios.post("api/users/login", body).then((response) => {});
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        window.localStorage.setItem("userId", response.payload.userId);
        props.history.push("/");
      } else {
        setFormErrorMessage("Check out your Account or Password again");
      }
    });
  };
  return (
    <div className="login-container">
      <Comment />
      <p>Login</p>
      <Form
        name="normal_login"
        className="login-form"
        onFinish={onSubmitHandler}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            type="email"
            value={Email}
            onChange={onEmailHandler}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={onPasswordHandler}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
      {formErrorMessage && (
        <label>
          <p
            style={{
              color: "#ff0000bf",
              fontSize: "0.7rem",
              border: "1px solid",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            {formErrorMessage}
          </p>
        </label>
      )}
    </div>
  );
}

export default LoginPage;
