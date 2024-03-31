const express = require('express');
const router = express.Router();
const { getAllBlogPosts,
    getBlogPostById, 
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addComment,
    updateComment,
    deleteComment } = require('../controllers/blogPostController.js');
const {verifyToken}=require('../utils/verifyUser.js');
router.get('/blogposts',verifyToken, getAllBlogPosts);
router.get('/blogposts/:id',verifyToken, getBlogPostById);
router.post('/blogposts',verifyToken, createBlogPost);
router.put('/blogposts/:id',verifyToken, updateBlogPost);
router.delete('/blogposts/:id',verifyToken, deleteBlogPost);
router.post('/blogposts/:postId/comments',verifyToken, addComment);
router.put('/blogposts/:postId/comments/:commentId',verifyToken, updateComment);
router.delete('/blogposts/:postId/comments/:commentId',verifyToken, deleteComment);
module.exports = router;