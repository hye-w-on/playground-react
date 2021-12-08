//import Axios from "axios";
/*import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";

function TestPage() {
  const dispatch = useDispatch();

  //const [state, setstate] = useState(initialState); initialState: 초기값
  const [Email, setEmail] = useState(""); //state 선언
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    //state를 변경하는 이벤트
    setEmail(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onSubmitHandler = (event) => {
    event.preventDefault(); //페이지가 refresh되어 다른 작업을 하지 못 하게 되는 것을 막음
    let body = {
      email: Email,
      password: Password,
    };
    //Axios.post("/api/users/login", body).then((response) => {}); //backend로 body 전달

    dispatch(loginUser(body));
  };

  return (
    <div>
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
    </div>
  );
}

export default TestPage;
*/
