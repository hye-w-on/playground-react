import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [formErrorMessage, setFormErrorMessage] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
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
    <div>
      Login
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button>Login</button>
      </form>
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
