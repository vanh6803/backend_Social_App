const jwt = require("jsonwebtoken");
const accountModel = require("../models/Account");

const checkToken = async (req, res, next) => {
  let header_token = req.header("Authorization");
  console.log(header_token);
  if (typeof header_token == "undefined" || typeof header_token == null) {
    return res.status(403).json({ message: "unknown token" });
  }

  const token = header_token.replace("Bearer ", "");

  try {
    const data = jwt.verify(token, process.env.KEY_TOKEN);
    console.log(data);
    const user = await accountModel.account.findById({ _id: data.userId });
    console.log(user);
    if (!user) {
      throw new Error("unknown user");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ code: 401, message: error.message });
  }
};

module.exports = {
  checkToken,
};
