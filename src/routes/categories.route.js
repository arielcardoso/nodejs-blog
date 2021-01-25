const router = require('express').Router();

const categoryController = require('../controllers/category.controller');

// @route   GET /blog/categories
// @desc    Get all categories
router.get('/', categoryController.getAll)

// @route   POST /blog/categories/new
// @desc    Add a new category
router.post('/new', categoryController.add);

// @route   PUT /blog/categories/:id
// @desc    Edit a category
router.put('/:id', categoryController.update);

// @route   DELETE /blog/categories/:id
// @desc    Delete an animal
router.delete('/:id', categoryController.delete);

module.exports = router;