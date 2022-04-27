const express = require('express');
const { deletePost, updatePost, createPost, getPost, likePost, getPostBySearch } = require('../controllers/posts')
const auth = require('../middleware/auth')

const router = express.Router();

// not to localhost:5000/
// but to localhost:5000/posts
router.get('/', getPost)
router.get('/search', getPostBySearch)
router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)

module.exports = router;