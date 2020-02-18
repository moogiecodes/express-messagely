const express = require("express");

const User = require("../models/user");
const Message = require("../models/message")
const db = require("../db");
const { authenticateJWT } = require("../middleware/auth");
const config = require("../config");
const router = new express.Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/", async function (req, res, next) {
  try {
    const users = await User.all();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    if (user) {
      return res.json({ user });
    }
    throw new ExpressError(`User not found.`, 404);
  } catch (err) {
    return next(err);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", async function (req, res, next) {
  try {
    const messages = await User.messagesTo(req.params.username);
    if (messages) {
      return res.json({ messages });
    }
    throw new ExpressError(`No messages found.`, 404);
  } catch (err) {
    return next(err);
  }
});


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", async function (req, res, next) {
  try {
    const messages = await User.messagesFrom(req.params.username);
    if (messages) {
      return res.json({ messages });
    }
    throw new ExpressError(`No messages found.`, 404);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;