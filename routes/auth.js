const express = require("express");

const User = require("../models/user");
const Message = require("../models/message")
const db = require("../db");
const { authenticateJWT } = require("../middleware/auth");
const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const router = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    if (await User.authenticate(username, password) === true) {

      let token = jwt.sign({ username }, SECRET_KEY);
      await User.updateLoginTimestamp(user);

      return res.json({ token });
    }
    throw new ExpressError("Invalid user/password", 400);
  } catch (err) {
    return next(err);
  }
});

// User.register?
// CHECK IF USER EXISTS IN DB
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

 router.post("/register", async function (req, res, next) {
  try {

    
  } catch (err){
    return next(err);
  }
 });

module.exports = router;