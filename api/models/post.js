import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://th.bing.com/th/id/R.6b960e9bfd4dfa87be3b4db9270e0f4d?rik=liZwxSywJoVtCA&pid=ImgRaw&r=0",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
