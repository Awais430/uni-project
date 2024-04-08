import express from "express";
import { VerifyToken } from "../utils/verifyUSer.js";
import { errorHandler } from "../utils/errorHandler.js";
import Comment from "../models/comment.js";
const router = express.Router();

router.post("/create-comment", VerifyToken, async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (!content) {
      return next(errorHandler(403, "please provide the comment"));
    }
    if (content.length > 200) {
      return next(
        errorHandler(403, "comments length should not be greater then 200")
      );
    }
    // console.log(req.body)
    if (!userId === req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
});

router.get("/get-post-comment/:postId", async (req, res, next) => {
  try {
    const comment = await Comment.find({ postId: req.params.postId });
    createdAt: -1;
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
});

router.put("/like-comment/:commentId", VerifyToken, async (req, res, next) => {
  // console.log("req.body",req.params.commentId)
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.json(comment);
  } catch (error) {
    next(error);
  }
});

router.put("/edit-comment/:commentId", VerifyToken, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (req.user.id !== comment.userId && !req.user.isAdmin) {
      return next(
        errorHandler(403, "you are not allowed to edit this comment")
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/delete-comment/:commentId",
  VerifyToken,
  async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);

      if (!comment) {
        return next(errorHandler(404, "comment not found"));
      }
      if (req.user.id !== comment.userId && req.user.isAdmin) {
        return next(
          errorHandler(403, "you are not allowed to delete this comment")
        );
      }
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json("comment has beeen deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-comments", VerifyToken, async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get all comments"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
});

export default router;
