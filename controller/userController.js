const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SCRET = process.env.JWT_SCRET;
const User = require("../model/user");
const registerUser = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  console.log(req.body);
  try {
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      res.send({ success: false, message: "User already exist" });
    } else {
      if (password !== confirmPassword) {
        res.sen({ success: false, message: "password do not match" });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = await new User({
        fullName: fullName,
        email: email,
        password: hashPass,
      }).save();
      res.send({ sucess: true, data: newUser });
    }
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, message: "Internal server error" });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials.." });
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res
        .status(400)
        .json({ err: "Please try to login with correct credentials" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, JWT_SCRET);
    res.json({ success: true, data: user, authToken: token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  registerUser,
  loginUser,
};
