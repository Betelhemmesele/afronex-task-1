const BlogPost = require('../models/blog');
// POST /blogposts - Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, excerpt, content, date, categories,imageUrls, user } = req.body;
    const blogPost = new BlogPost({
      title,
      excerpt,
      content,
      date,
      categories,
      imageUrls,
      user
    });
    await blogPost.save();
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
const getBlogs = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const blogs = await BlogPost.find({ user: userId });

    res.json(blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// Get a specific task for a user
const getBlog = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const blogId = req.params.id;

    const blog = await BlogPost.findOne({ _id: blogId, user: userId });
    console.log("iddd",userId,"hhh" ,blogId)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// GET /blogposts - Get all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate('user', 'username');
    res.json(blogPosts);
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /blogposts/:id - Get a single blog post by ID
const getBlogPostById = async (req, res) => {
  try {
   
    const blogPost = await BlogPost.findById(req.params.id)
      .populate('user', 'username')
      .populate('comments.user', 'username');
      console.log("user",blogPost.user);
      console.log("id",req.params.id)
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// PUT /blogposts/:id - Update a blog post
const updateBlogPost = async (req, res) => {
  const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
     return res.status(404).json({ error: 'not found'});
    }
    if (req.user.id !== blogPost.user.toString()){
      return res.status(404).json({ error: 'you can only update yours'});
  }
  try {
    const { title, excerpt, content, date, categories,imageUrls } = req.body;
    const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, {
      title,
      excerpt,
      content,
      date,
      categories,
      imageUrls
    });
    
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log(error)
  }
};

// DELETE /blogposts/:id - Delete a blog post
const deleteBlogPost = async (req, res) => {
  const blogPost = await BlogPost.findById(req.params.id);
  if (!blogPost) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  if (req.user.id !== blogPost.user.toString()){
    return res.status(404).json({ error: 'you can only update yours'});
}
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
    console.log(error);
  }
};
// POST /blogposts/:postId/comments - Add a new comment to a blog post
const addComment = async (req, res) => {
    try {
      const { content, user, date } = req.body;
      const blogPost = await BlogPost.findById(req.params.postId);
      console.log("id",req.params.postId);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      const comment = {
        content,
        user,
        date
      };
      blogPost.comments.push(comment);
      await blogPost.save();
      res.status(201).json(blogPost);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // PUT /blogposts/:postId/comments/:commentId - Update a comment in a blog post
  const updateComment = async (req, res) => {
    try {
      const { content } = req.body;
      const blogPost = await BlogPost.findById(req.params.postId);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      const comment = blogPost.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      comment.content = content;
      await blogPost.save();
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // DELETE /blogposts/:postId/comments/:commentId - Delete a comment from a blog post
  const deleteComment = async (req, res) => {
    try {
      const blogPost = await BlogPost.findById(req.params.postId);
     
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      const comment = blogPost.comments.id(req.params.commentId);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      blogPost.comments.pull(comment._id);
      await blogPost.save();
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      console.log(error);
    }
  };
  
module.exports = {
    getAllBlogPosts,
    getBlogPostById, 
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogs,
    getBlog,
    addComment,
    updateComment,
    deleteComment,
}