import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    title: String,
    body: String,
    author: String,
}, {timestamps:true});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

export default BlogPost;