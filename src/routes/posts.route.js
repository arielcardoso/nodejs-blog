const router = require('express').Router();
const postController = require('../controllers/post.controller');

// @route   GET /blog
// @desc    Get all posts
router.get('/', postController.getAll)


// @route   GET /blog/new
// @desc    New post form
router.get('/new', postController.newForm);

// @route   POST /blog/new
// @desc    Add a new post
router.post('/new', postController.new);

// @route   GET /blog/:id
// @desc    View post details
router.get('/:id', postController.view);

// @route   POST /blog/comment/:id
// @desc    Add a new comment
router.post('/comment/:id', postController.newComment);

// @route   DELETE /blog/comment/:id
// @desc    Delete a comment
router.delete('/comment/:id', postController.deleteComment);

// @route   GET /blog/edit
// @desc    Edit post form
router.get('/edit/:id', postController.editForm);

// @route   PUT /blog/:id
// @desc    Edit a post
router.post('/edit/:id', postController.update);

// @route   DELETE /blog/:id
// @desc    Delete a post
router.delete('/:id', postController.delete);

// @route   PUT /blog/like/:id
// @desc    Increment a like to a post
router.post('/like/:id', postController.addLike);

// @route   PUT /blog/dislike/:id
// @desc    Increment a dislike to a post
router.post('/dislike/:id', postController.addDislike);

module.exports = router;