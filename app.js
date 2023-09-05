const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/PostRoutes");
const {
  errorResponseHandler,
  invalidPathHandler,
} = require("./middlewares/ErrorHandler");

const cors = require("cors");
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
