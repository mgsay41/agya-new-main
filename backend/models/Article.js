import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: { type: String},
  authorName:{type: String ,required: true },
  content: { type: String},
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: { type: [String] }, // Array of strings
  references: {type: [String]},
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  image:{ type: String},
  type: { type: String, default: "article" }

});

const Article = mongoose.model("Article", ArticleSchema);

export default Article;
