import mongoose from "mongoose";

const FeaturedArticlesSchema = new mongoose.Schema({
  articleID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  ],
});

const FeaturedArticles = mongoose.model("FeaturedArticles", FeaturedArticlesSchema);

export default FeaturedArticles;
