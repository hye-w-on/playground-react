import React, { Suspense, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPageFormik";
import NavBar from "./views/NavBar/NavBar";
import MenuBar from "./views/Menu/MenuBar";
import Footer from "./views/Footer/Footer";
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage.js";
import VideoDetailPage from "./views/VideoDetailPage/VideoDetailPage.js";
import SubscriptionPage from "./views/SubscriptionPage/SubscriptionPage.js";
import ExchangeRatePage from "./views/ExchangeRatePage/ExchangeRatePage.js";

import { Layout } from "antd";
//option
//null   Anyone Can go inside, 모두 진입가능
//true   only logged in user can go inside, 로그인한 유저만 진입
//false  logged in user can't go inside, 로그인한 유저는 출입불가, 로그인페이지

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout className="site-layout">
        <Layout>
          <NavBar />
        </Layout>
        <Layout style={{ backgroundColor: "#eeeeee" }}>
          <MenuBar />
          <div
            style={{
              paddingTop: "30px",
              minHeight: "calc(100vh - 48px)",
              width: "100%",
            }}
          >
            <Switch>
              <Route exact path="/" component={Auth(LandingPage, null)} />
              <Route exact path="/login" component={Auth(LoginPage, false)} />
              <Route
                exact
                path="/register"
                component={Auth(RegisterPage, false)}
              />
              <Route
                exact
                path="/video/upload"
                component={Auth(VideoUploadPage, true)}
              />
              <Route
                exact
                path="/video/:videoId" //props.match.params.videoId로 videoId를 view로 전달
                component={Auth(VideoDetailPage, null)}
              />
              <Route
                exact
                path="/subscription"
                component={Auth(SubscriptionPage, null)}
              />
              <Route
                exact
                path="/exchangerate"
                component={Auth(ExchangeRatePage, null)}
              />
            </Switch>
          </div>
        </Layout>
        <Layout>
          <Footer />
        </Layout>
      </Layout>
    </Suspense>
  );
}

export default App;
