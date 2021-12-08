const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //bcrypt는 salt를 이용해서 암호화를 진행하는데 saltRounds는 이 salt가 몇글자인지를 의미함
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    // console.log('password changed')
    bcrypt.genSalt(saltRounds, function (err, salt) {
      //salt 생성
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        //password를 암호화한 hash를 생성
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  console.log("user", user);
  console.log("userSchema", userSchema);
  var token = jwt.sign(user._id.toHexString(), "secret");
  var oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  jwt.verify(token, "secret", function (err, decode) {
    // 토큰을 decode 한다. token -> decode
    user.findOne({ _id: decode, token: token }, function (err, user) {
      //유저 ID(decode)를 통해서 사용자를 찾고, 클라이언트에서 가져온 token이 일치하는지 확인
      //findOne는 몽고DB를 조회하는 function
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
