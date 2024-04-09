const express = require('express');
const router = express.Router();
const { getAllBlogPosts,
    getBlogPostById, 
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addComment,
    updateComment,
    deleteComment,
    getBlogs,
    getBlog,
 } = require('../controllers/blogPostController.js');
const {verifyToken}=require('../utils/verifyUser.js');
router.get('/blogposts', getAllBlogPosts);
router.get('/blogposts/:id',getBlogPostById);
router.get('/getblogposts', verifyToken, getBlogs);
router.get('/getblogpost/:id',verifyToken, getBlog);
router.post('/blogposts',verifyToken, createBlogPost);
router.put('/updateblogposts/:id',verifyToken, updateBlogPost);
router.delete('/deleteblogposts/:id',verifyToken, deleteBlogPost);
router.post('/blogposts/:postId/comments',verifyToken, addComment);
router.put('/blogposts/:postId/comments/:commentId',verifyToken, updateComment);
router.delete('/blogposts/:postId/comments/:commentId',verifyToken, deleteComment);
module.exports = router;