//import the model
const Post = require("../models/post.model");
const Category = require("../models/category.model");
const Comment = require("../models/comment.model");
const AppError = require("../util/AppError");

const mongoose = require('mongoose');

function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(err => next(err))
    }
}

exports.getAll = wrapAsync(async (req, res, next) => {
  const { filter_category } = req.query;
  const categories = await Category.find({}).sort({name:'asc'});
  let posts;

  if (filter_category) {
    posts = await Post.aggregate([
      {
        $match : {
          category: new mongoose.Types.ObjectId(filter_category)
        }
      },
      {
        "$lookup": {
          "from": "categories",
          "localField": "category",
          "foreignField": "_id",
          "as": "categories"
        }
      }
    ]).sort({created:'desc'});
  } else {
    posts = await Post.aggregate([
      {
        "$lookup": {
          "from": "categories",
          "localField": "category",
          "foreignField": "_id",
          "as": "categories"
        }
      }
    ]).sort({created:'desc'});
  }
  
  const trendPosts = await Post.find({}).sort({likes:'desc'}).limit(3);
  const lastComment = await Comment.find({}).sort({created:'desc'}).limit(1);
  res.render("post/index", { posts, filter_category, categories, trendPosts, lastComment });
});

exports.newForm = wrapAsync(async (req, res, next) => {
  const categories = await Category.find({}).sort({name:'asc'});
  res.render("post/new", { categories });
});

exports.new = wrapAsync(async (req, res, next) => {
  const newRecord = new Post(req.body);
  await newRecord.save();
  res.redirect(`/blog/new`);
});

exports.view = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const filter_category = null;
  const categories = await Category.find({}).sort({name:'asc'});
  const post = await Post.findById(id);
  const comments = await Comment.find({postId: id}).sort({created:'desc'});
  
  const trendPosts = await Post.find({}).sort({likes:'desc'}).limit(3);
  const lastComment = await Comment.find({}).sort({created:'desc'}).limit(1);
  res.render("post/view", { post, filter_category, categories, comments, trendPosts, lastComment });
});

exports.newComment = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const newRecord = new Comment(req.body);
  await newRecord.save();
  res.redirect(`/blog/${id}`);
});

exports.deleteComment = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  await Comment.findByIdAndDelete(id);

  //return to post edition screen
  res.redirect(`/blog/edit/${comment.postId}`);
});

exports.editForm = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const categories = await Category.find({}).sort({name:'asc'});
  const post = await Post.findById(id);
  const comments = await Comment.find({postId: id}).sort({created:'desc'});
  res.render("post/edit", { post, categories, comments });
});

exports.update = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  res.redirect(`/blog/edit/${id}`);
});

exports.addLike = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const postUpdate = await Post.findByIdAndUpdate(id, {likes: post.likes + 1}, {
    runValidators: true,
    new: true,
  });

  if (!postUpdate) {
    throw new AppError("Post not found", 404);
  }
  res.redirect(`/blog/${id}`);
});

exports.addDislike = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const postUpdate = await Post.findByIdAndUpdate(id, {dislikes: post.dislikes + 1}, {
    runValidators: true,
    new: true,
  });

  if (!postUpdate) {
    throw new AppError("Post not found", 404);
  }
  res.redirect(`/blog/${id}`);
});

exports.delete = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/blog");
});

