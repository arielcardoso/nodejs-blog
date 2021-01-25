//import the model
const Category = require("../models/category.model");
const AppError = require("../util/AppError");

const mongoose = require('mongoose');

function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(err => next(err))
    }
}

exports.getAll = wrapAsync(async (req, res, next) => {
  const categories = await Category.find({});
  res.render("category/index", { categories });
});

exports.add = wrapAsync(async (req, res, next) => {
    const newRecord = new Category(req.body);
    await newRecord.save();
    res.redirect(`/blog/categories`);
});

exports.update = wrapAsync(async (req, res, next) => {
  //const { id } = req.params;
  const id = new mongoose.Schema.ObjectId(req.params.id);
  const category = await Category.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  res.redirect(`/blog/categories`);
});

exports.delete = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.redirect("/blog/categories");
});
