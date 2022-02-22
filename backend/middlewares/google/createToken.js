const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/User");
const oauth2Client = require("../../utilities/google/OAuth2");

const createToken = expressAsyncHandler(async (req, res, next) => {
  try {
    const { code } = req.body;
    const id = req.user.id;
    const response = await oauth2Client.getToken(code);

    console.log(`Response Is : ${response}`);

    const { refresh_token } = response;
    const user = await User.findOneAndUpdate(
      { id },
      { refresh_token: refresh_token },
      { new: true }
    );

    if (user && user.refresh_token != "") {
      console.log("Refresh token successfully updated");
    }
    //
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      "There was some issue occure while creating the refresh token"
    );
  }
});

module.exports = createToken;
