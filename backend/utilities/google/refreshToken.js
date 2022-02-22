const User = require("../../models/User");

const getRefreshToken = async (id) => {
  const user = await User.findOne({ id });
  console.log(` ref ff ${user.refresh_token}`);
  return user.refresh_token;
};

module.exports = getRefreshToken;
