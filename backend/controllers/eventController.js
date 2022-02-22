const expressAsyncHandler = require("express-async-handler");
const { google } = require("googleapis");
const oauth2Client = require("../utilities/google/OAuth2");
const getRefreshToken = require("../utilities/google/refreshToken");
const User = require("../models/User");

const createToken = expressAsyncHandler(async (req, res) => {
  try {
    const { code } = req.body;
    const email = req.user.email;

    const response = await oauth2Client.getToken(code);
    const { tokens } = response;
    const { refresh_token } = tokens;
    console.log(`Response Is : ${tokens}`);

    const user = await User.findOneAndUpdate(
      { email },
      { refresh_token: refresh_token },
      { new: true }
    );

    if (user && user.refresh_token != "") {
      console.log("Refresh token successfully updated");
    }
    //
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      "There was some issue occure while creating the refresh token"
    );
  }
});

const haveRefreshToken = expressAsyncHandler(async (req, res) => {
  const email = req.user.email;
  console.log(req.user.email);
  const user = await User.findOne({ email });

  console.log(user);

  const refresh_token = user.refresh_token;
  console.log(refresh_token);
  if (refresh_token === "") {
    res.status(400).json({ found: "no" });
  } else {
    res.status(200).json({ found: "200" });
  }
});

// @desc create an event in google calandar
// @route POST /api/v1/event/create-event
// @access Private

const createEvent = expressAsyncHandler(async (req, res, next) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;
    const email = req.user.email;
    const user = await User.findOne({ email });

    const refresh_token = user.refresh_token;
    console.log(`user ${refresh_token}`);

    oauth2Client.setCredentials({ refresh_token });
    const calendar = google.calendar("v3");
    const response = calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: "7",
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    });

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ message: "There was some issue!" });
  }
});

module.exports = { createEvent, createToken, haveRefreshToken };
