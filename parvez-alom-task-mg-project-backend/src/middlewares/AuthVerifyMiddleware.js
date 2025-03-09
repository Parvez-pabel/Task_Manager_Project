const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  let Token = req.headers["token"];
  jwt.verify(Token, "abcd1234xyz", (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Token is not valid" });
    } else {
      let email = decoded["data"];
      console.log(email);
      req.headers.email = email;
      next();
    }
  });
};
