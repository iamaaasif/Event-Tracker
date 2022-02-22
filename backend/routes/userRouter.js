const router = require("express").Router();
const { loginUser, registerUser } = require("../controllers/userController");
router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
