const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config"); // need because users have secret_keys associated

describe("Messages Routes Test", async function () {

  let testUserToken;

  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

    let u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });

    let u2 = await User.register({
      username: "test2",
      password: "password2",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+14155552222",
    });

    let m1 = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "test1 -> test2",
    });

    let m2 = await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "test2 -> test1",
    });

    testUserToken = jwt.sign({ username: "test1" }, SECRET_KEY);
  });

  test("can get message details by id", async function () {
    let response = await request(app)
      .get("/messages/1")
      .send({ _token: testUserToken });

    expect(response.body).toEqual({
      message:
      {
        id: 1,
        body: "test1 -> test2",
        sent_at: expect.any(String),
        read_at: null,
        from_user: { username: "test1", first_name: "Test1", last_name: "Testy1", phone: "+14155550000" },
        to_user: { username: "test2", first_name: "Test2", last_name: "Testy2", phone: "+14155552222" }
      }
    });
  });

  test("can post a message successfully", async function () {
    let response = await request(app)
      .post("/messages")
      .send({
        from_username: "test1",
        to_username: "test2",
        body: "aksj j dfakj dfliajdflkj",
        _token: testUserToken
      });

    expect(response.body).toEqual({
      message:
      {
        id: 3,
        body: "aksj j dfakj dfliajdflkj",
        sent_at: expect.any(String),
        from_username: "test1",
        to_username: "test2"
      }
    });
  });

  test("can mark message read by id", async function () {
    let response = await request(app)
      .post("/messages/2/read")
      .send({ _token: testUserToken });

    expect(response.body).toEqual({
      message: {
        id: 2,
        read_at: expect.any(String)
      }
    });
  })

});

afterAll(async function () {
  // await db.query("DROP TABLE messages");
  await db.end();
});

