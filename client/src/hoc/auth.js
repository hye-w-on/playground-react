/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { auth } from "../_actions/user_actions";
import { useSelector, useDispatch } from "react-redux";

function Auth(SpecificComponent, loginOption, authCode = null) {
  //왜 함수안에 또 함수를 넣는 것인지??
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      //접근하려는 사용자의 정보를 서버에 요청
      dispatch(auth()).then((response) => {
        //Not Loggined in Status, 로그인을 안한 상태
        if (!response.payload.isAuth) {
          if (loginOption) {
            props.history.push("/login");
          }
          //로그인을 안한 체로 진입 가능한 페이지
        } else {
          //Loggined in Status 로그인을 한 상태
          //supposed to be Admin page, but not admin person wants to go inside
          if (authCode && !response.payload.isAdmin) {
            //어드민 페이지
            props.history.push("/");
          } else {
            if (loginOption === false) {
              //로그인 페이지
              props.history.push("/");
            }
            //로그인을 했으면 진입 가능한페이지
          }
        }
      });
    }, []);

    return <SpecificComponent {...props} user={user} />;
    //SpecificComponent에서 props.history를 사용하기 위해서는 "react-router-dom"이 필요한데
    //이전에 App.jsa에서 Route가 제공한 props를 그대로 전달해주면
    //"react-router-dom"을 import할 필요가 없다
  }
  return AuthenticationCheck;
}

export default Auth;
