const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const path = require("path");
const mongoConnect = require("connect-mongo");

const app = express();
const Port = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

// Routers
const { userSignInRouter } = require("./routers/userSignIn");
const { userLogInRouter } = require("./routers/userLogIn");
const loginStatusRouter = require("./routers/loginStatus");
const { accountDetailRouter } = require("./routers/accountDetail");
const { updateProfileRouter } = require("./routers/updateProfile");
const { accountDeleteRouter } = require("./routers/accountDelete");
const { addPostRouter } = require("./routers/addPost");
const { getPostRouter } = require("./routers/getPost");
const { likePostRouter } = require("./routers/likePost");
const { commentRouter } = require("./routers/addComment");
const { updateCommentRouter } = require("./routers/updateComment");
const { getCommentRouter } = require("./routers/getComment");
const { deleteCommentRouter } = require("./routers/deleteComment");
const { myPostRouter } = require("./routers/myPost");
const { deletePostRouter } = require("./routers/deletePost");
const { getForEditPostRouter } = require("./routers/getForEditPost");
const { updatePostRoute } = require("./routers/updatePost");
const { cloudinaryConfig } = require("./util/cloudinary");

// Serve static uploads
app.use("/upload", express.static(path.join(__dirname, "upload")));

const store = mongoConnect.create({
  mongoUrl: DB_URL,
  collectionName: "task-Session",
  ttl: 60 * 60 * 24, // 1 day
});

// CORS setup
app.use(
  cors({
    origin: process.env.SOURCE_URL, // must exactly match frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (needed for secure cookies behind reverse proxy / https)
app.set("trust proxy", 1);

// Session middleware
app.use(
  session({
    secret: process.env.SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on https
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// API routes
app.use("/api", [
  userSignInRouter,
  userLogInRouter,
  loginStatusRouter,
  accountDetailRouter,
  updateProfileRouter,
  accountDeleteRouter,
  addPostRouter,
  getPostRouter,
  likePostRouter,
  commentRouter,
  updateCommentRouter,
  getCommentRouter,
  deleteCommentRouter,
  myPostRouter,
  deletePostRouter,
  getForEditPostRouter,
  updatePostRoute,
]);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect DB and start server
mongoose
  .connect(DB_URL)
  .then(() => {
    cloudinaryConfig();
    app.listen(Port, () =>
      console.log(`🚀 Server running on http://localhost:${Port}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
