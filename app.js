const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const User = require("./model/user");
const Post = require("./model/post");
const { specs, swaggerUi } = require("./swagger");
dotenv.config();

mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = process.env.MONGODB_URL;

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);

  console.log("Connected to mongo server.");
}

/**
 * @description Get All users
 * @route GET /utilisateurs
 * @swagger
 * /user:
 *   get:
 *     summary: Returns all users
 *     responses:
 *       200:
 *         description: A successful response
 */
const getAllUsers = async function (req, res, next) {
  try {
    const users = await User.find({});
    return res.status(200).json({ utilisateurs: users });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * @description Create one user
 * @route POST /utilisateurs
 * @swagger
 * /user:
 *   post:
 *     summary: Create one user
 *     responses:
 *       200:
 *         description: A successful response
 */
const createUser = async function (req, res, next) {
  try {
    //const user = await User.create(req.body);
    const user = new User(req.body);
    await user.save();
    return res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
};

/**
 * @description Get All posts
 * @route GET /blogs
 * @swagger
 * /blogs:
 *   get:
 *     summary: Returns all blog posts
 *     responses:
 *       200:
 *         description: A successful response
 */
const getAllPosts = async function (req, res, next) {
  try {
    const posts = await Post.find({}).populate("author", "name email");
    return res.status(200).json({ posts: posts });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * @description Create one post
 * @route POST /blogs
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create one blog post
 *     responses:
 *       200:
 *         description: A successful response
 */
const createPost = async function (req, res, next) {
  try {
    const post = new Post(req.body);
    await post.save();
    return res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
};

const router = express.Router();
const blogRouter = express.Router();

router.route("/").get(getAllUsers).post(createUser);
blogRouter.route("/").get(getAllPosts).post(createPost);

const app = express();

const corsOptions = {
  origin: process.env.FRONT_URL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// api routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", router);
app.use("/blogs", blogRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Middleware global de gestion d'erreur
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
