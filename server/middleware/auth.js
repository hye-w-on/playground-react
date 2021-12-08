const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증처리를 하는 곳
  let token = req.cookies.w_auth; // 클라이언트 쿠키서 토큰을 가져온다

  User.findByToken(token, (err, user) => {
    // 유저를 복호화한 후 유저를 찾는다
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token; // middleware를 빠져나와 콜백의 req로 정보를 읽기위함
    req.user = user;
    next(); //next가 있어야 middleware를 빠져나와 다음 단계로 진행
  });
};

module.exports = { auth };
