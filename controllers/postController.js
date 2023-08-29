const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const userID = decode.id;
  console.log(userID);
  const author = userID;
  try {
    const post = new Post({
      title,
      content,
      author,
    });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decode.id;
    const posts = await Post.find({ author: userID }).populate(
      "author",
      "-password"
    );
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  console.log(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
      },
      { new: true }
    );
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
