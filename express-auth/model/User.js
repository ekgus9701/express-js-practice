const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "이메일을 입력하여 주세요"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "올바른 이메일 형식이 아닙니다."],
  },
  password: {
    type: String,
    required: [true, "비밀번호가 입력되어야 합니다."],
  },
  nickname: {
    type: String,
  },
});

//statics를 쓴다 => User(맨 아래줄 보기)를 호출하면 실행되는 함수라고 생각하면 될듯?
userSchema.statics.signUp = async function (email, password) {
  const salt = await bcrypt.genSalt();
  console.log(salt);

  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({ email, password: hashedPassword });
    return {
      _id: user._id,
      email: user.email,
    };
  } catch (err) {
    throw err;
  }
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    //저장되어있는 비번과 유저가 입력한 비번이 같니
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user.visibleUser;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const visibleUser = userSchema.virtual("visibleUser");
visibleUser.get(function (value, virtual, doc) {
  return {
    _id: doc._id,
    email: doc.email,
  };
});

userSchema.virtual("boards", {
  ref: "Board",
  localField: "_id", //본인의 _id를 Board.js에서 참조하려고하는 값과 매핑한다.
  foreignField: "author", //Board.js에서 author라는 이름으로 참조하려고하니까 써준다.
});

userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "writer",
});

const User = mongoose.model("user", userSchema);

module.exports = User;
