const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const path = require('path'); // <- add this
const app = express();
const Port = process.env.PORT;
const mongoConnect = require('connect-mongo');
const DB_URL = process.env.DB_URL;

// Routers
const { userSignInRouter } = require('./routers/userSignIn');
const { userLogInRouter } = require('./routers/userLogIn');
const loginStatusRouter = require('./routers/loginStatus');
const { accountDetailRouter } = require('./routers/accountDetail');
const { updateProfileRouter } = require('./routers/updateProfile');
const { accountDeleteRouter } = require('./routers/accountDelete');
const { addPostRouter } = require('./routers/addPost');
const { getPostRouter } = require('./routers/getPost');
const { likePostRouter } = require('./routers/likePost');
const { commentRouter } = require('./routers/addComment');
const { updateCommentRouter } = require('./routers/updateComment');
const { getCommentRouter } = require('./routers/getComment');
const { deleteCommentRouter } = require('./routers/deleteComment');
const { myPostRouter } = require('./routers/myPost');
const { deletePostRouter } = require('./routers/deletePost');
const { getForEditPostRouter } = require('./routers/getForEditPost');
const { updatePostRoute } = require('./routers/updatePost');
const { cloudinary, cloudinaryConfig } = require('./util/cloudinary');

const store = mongoConnect.create({
  mongoUrl: DB_URL,
  collectionName: 'task-Session',
  ttl: 60 * 60 * 24,
});

// Middleware
app.use(
  cors({
    origin: process.env.SOURCE_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true on Vercel
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // required for cross-origin
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Serve upload folder
app.use('/upload', express.static(path.join(__dirname, 'upload')));
// API routes
app.use('/api', userSignInRouter);
app.use('/api', userLogInRouter);
app.use('/api', loginStatusRouter);
app.use('/api', accountDetailRouter);
app.use('/api', updateProfileRouter);
app.use('/api', accountDeleteRouter);
app.use('/api', addPostRouter);
app.use('/api', getPostRouter);
app.use('/api', likePostRouter);
app.use('/api', commentRouter);
app.use('/api', updateCommentRouter);
app.use('/api', getCommentRouter);
app.use('/api', deleteCommentRouter);
app.use('/api', myPostRouter);
app.use('/api', deletePostRouter);
app.use('/api', getForEditPostRouter);
app.use('/api', updatePostRoute);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Connect DB and start server
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    cloudinaryConfig();
    app.listen(process.env.PORT);
  })
  .catch((err) => console.error('DB connection error:', err));
