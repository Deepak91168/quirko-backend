const User = require("../models/User");
const uploadPicture = require("../middlewares/uploadPicture");
const fileRemover = require("../utils/removeFile");
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
    user = new User({ name, email, password });
    await user.save();
    return res.status(201).json({
      id: user._id,
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      admin: user.admin,
      verified: user.verified,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      next(error);
    }
    if (await user.comparePassword(password)) {
      return res.status(200).json({
        id: user._id,
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        admin: user.admin,
        verified: user.verified,
        token: await user.generateJWT(),
      });
    } else {
      const error = new Error("Password is incorrect");
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      return res.status(200).json({
        id: user.id,
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        admin: user.admin,
        verified: user.verified,
      });
    } else {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length > 6) {
      user.password = req.body.password;
    } else {
      const error = new Error("Password must be greater than 6 characters");
      error.status = 400;
      next(error);
    }
    const updatedUser = await user.save();
    return res.status(200).json({
      id: updatedUser.id,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      name: updatedUser.name,
      admin: updatedUser.admin,
      verified: updatedUser.verified,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("avatar");
    upload(req, res, async (err) => {
      if (err) {
        const error = new Error(err.message);
        error.status = 400;
        next(error);
      } else {
        if (req.file) {
          let filename;
          let updatedUser = await User.findById(req.user.id);
          filename = updatedUser.avatar;
          if (filename !== "") {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();
          return res.status(200).json({
            id: updatedUser.id,
            avatar: updatedUser.avatar,
            email: updatedUser.email,
            name: updatedUser.name,
            admin: updatedUser.admin,
            verified: updatedUser.verified,
          });
        } else {
          let filename;
          const updatedUser = await User.findById(req.user.id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.status(200).json({
            id: updatedUser.id,
            avatar: updatedUser.avatar,
            email: updatedUser.email,
            name: updatedUser.name,
            admin: updatedUser.admin,
            verified: updatedUser.verified,
          });
        }
      }
    });
  } catch (error) {}
};
module.exports = {
  registerUser,
  loginUser,
  userProfile,
  updateUserProfile,
  updateProfilePicture,
};
