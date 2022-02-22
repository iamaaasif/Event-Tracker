const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const eventRouter = require("./routes/eventRouter");
const connectDB = require("./DB/connection");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

/// Database Connect
connectDB();

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", eventRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

///default error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
