const {
  createEvent,
  createToken,
  haveRefreshToken,
} = require("../controllers/eventController");
const { Protect } = require("../middlewares/authMiddleWare");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});
router.get("/refresh-token", Protect, haveRefreshToken);
router.post("/create-token", Protect, createToken);
router.post("/create-event", Protect, createEvent);

module.exports = router;
