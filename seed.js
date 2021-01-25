/* ===============================================
Stand alone file to be executed to populate the db
=============================================== */
const Post = require("./src/models/post.model");
const Category = require("./src/models/category.model");
const Comment = require("./src/models/comment.model");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => {
    console.log(err);
  });

/* CATEGORIES ***/
const category_1 = new Category({name:'News'});
category_1.save();

const category_2 = new Category({name:'Article'});
category_2.save();

/* POSTS ***/
const post_1 = new Post({
  title: "Hello World!",
  text: "Lorem ipsum dolem et num... Lorem ipsum dolem et num... Lorem ipsum dolem et num...",
  image: "https://place-puppy.com/600x600",
  category: category_1._id,
  likes: 5,
});
post_1.save();

const post_2 = new Post({
  title: "New article example!",
  text: "Lorem ipsum dolem et num... lorem ipsum dolem et num...",
  image: "https://place-puppy.com/610x610",
  category: category_2._id,
  likes: 2,
  dislikes: 1,
});
post_2.save();

const post_3 = new Post({
  title: "Another sample post",
  text: "Lorem ipsum dolem et num... lorem ipsum dolem et num...",
  image: "https://place-puppy.com/620x620",
  likes: 8,
  category: category_1._id,
});
post_3.save();

/* COMMENTS ***/
const comment_1 = new Comment({
  postId: post_1._id,
  username: 'Ariel',
  text: "Lorem ipsum dolem et num... Lorem ipsum dolem et num... Lorem ipsum dolem et num...",
});
comment_1.save();
