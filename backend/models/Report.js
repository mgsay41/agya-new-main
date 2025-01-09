import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Store the user's name
  userImage: { type: String, required: true },
  content: { type: String, required: true },
  isRead : {type: Boolean, default:false },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema);

export default Report;
