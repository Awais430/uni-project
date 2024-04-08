import express from "express";
import User from "../models/user.js";
import { VerifyToken } from "../utils/verifyUSer.js";
import { errorHandler } from "../utils/errorHandler.js";
import Post from "../models/post.js";
const router = express.Router();

// create post
router.post("/create-post", VerifyToken, async (req, res, next) => {
  // console.log(req.body)
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "you are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();

    res.status(201).json({
      savedPost,
    });
  } catch (error) {
    next(error);
  }
});

// get post

router.get("/get-post", async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const searchTerm =
      typeof req.query.searchTerm === "string" ? req.query.searchTerm : "";
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/delete-post/:postId/:userId",
  VerifyToken,
  async (req, res, next) => {
    // console.log(req.user.isAdmin);
    // console.log(req.user.id);
    // console.log(req.params.userId);
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "you are not allowed to delete this post"));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json("The post has been deleted");
    } catch (error) {
      next(error);
    }
  }
);

// update post

router.put(
  "/update-post/:postId/:userId",
  VerifyToken,
  async (req, res, next) => {
    console.log(req.body)
    // console.log(req.body.slug)
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      console.log(req.user.id)
      console.log(req.params.userId)

      return next(errorHandler(403, "you are not allowed to update this post"));
    }
    try {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
            slug: req.body.slug, // Use the existing slug from the formData
          },
        },
        { new: true }
      );
      res.status(200).json(updatePost);
      console.log(updatePost);
    } catch (error) {
      next(error);
      console.log(error)
    }
  }
);

// get all post

// get post
router.get("/get-posts", async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
      .exec();

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
