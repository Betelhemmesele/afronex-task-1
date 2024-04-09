import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaComment } from 'react-icons/fa';
import {Swiper ,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import {  FaTag} from 'react-icons/fa';
const DetailsPage = () => {
  const { postId } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);
  const [showOptions, setShowOptions] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedCommentContent, setUpdatedCommentContent] = useState('');

  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`http://localhost:8003/api/blogposts/${postId}`);
        const data = await response.json();
        console.log(data);
        setBlogPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogPost();
  }, [postId]);

  const formatDate = (createdAt) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(createdAt).toLocaleDateString(undefined, options);
  };

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:8003/api/blogposts/${postId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        content: newComment,
        user: currentUser._id, // assuming you have the currentUser object available
        date: new Date().toISOString(), // assuming you want to use the current date
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setNewComment('');
    } else {
      console.error('Failed to add comment:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  if (!blogPost) {
    return <div>Loading...</div>;
  }
  const handleToggleOptions = (commentId) => {
    setShowOptions(commentId === showOptions ? null : commentId);
  };

  const handleDeleteComment = async(commentId) => {
    // setShowConfirmation(false); 
  try {
    
    const res = await fetch(`http://localhost:8003/api/blogposts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include', 
    });
    const data = await res.json();
    if (data.success === false) {
  
      return;
    }
    console.log("success")
    // dispatch(deleteUserSuccess(data));
    setShowOptions(null);
  } catch (error) {
   
    console.log(error.message);
  }
}

const handleEditComment = (commentId) => {
  const comment = blogPost.comments.find((comment) => comment._id === commentId);
  if (comment) {
    setEditingCommentId(commentId);
    setUpdatedCommentContent(comment.content);
  }
  setShowOptions(null);
};
const handleSaveComment = async (commentId) => {
  try {
    const response = await fetch(`http://localhost:8003/api/blogposts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: updatedCommentContent,
      }),
    });
    if (response.ok) {
      // Comment updated successfully
      // You can choose to show a success message or update the UI accordingly
      setEditingCommentId(null);
      setUpdatedCommentContent('');
    } else {
      // Handle the error case
      // You can choose to show an error message or handle it as per your application's requirements
    }
  } catch (error) {
    // Handle any network or server errors
    // You can choose to show an error message or handle it as per your application's requirements
  }
};

const handleCancelEdit = () => {
  setEditingCommentId(null);
  setUpdatedCommentContent('');
};


  return (
    <div className="pt-[20px] mb-[100px] mx-[500px]">
      <h3 className="text-xl pt-8 pb-11 font-bold">{blogPost.title}</h3>
      <div className="border border-gray-300 rounded-md mb-4">
        <div className="z-0 mb-4">
          <Swiper navigation>
            {blogPost.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img src={url} alt={blogPost.title} className="w-[900px] h-[700px]" /> 
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="ml-7 mb-4">
          <p>{formatDate(blogPost.createdAt)}</p>
          <p>{blogPost.content}</p>
          <div className="float-card text-black mt-2">
  {blogPost.categories.map((category, index) => (
    <div className="flex items-center" key={index}>
      <FaTag className="mr-2 text-gray-600" />
      <p className="text-gray-600">{category}</p>
    </div>
  ))}
</div>
        
          <p className="text-gray-500 mt-2">Written by: {blogPost.user.username}</p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-md mb-4 p-4">
        <div className="flex items-center">
          <span
            className="material-icons mr-2 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >  
            <div className='flex'> 
            <p className='mr-3 text-purple-700'>View Comments</p>
            <FaComment className="text-purple-800 mt-1" />
            </div>
          </span>
          
        </div>
        {showComments && (
  <div className='pt-5'>
    {blogPost.comments.map((comment) => (
      <div key={comment._id} className="mb-2">
        {editingCommentId === comment._id ? (
      <div className="flex items-center">
        <input
          type="text"
          value={updatedCommentContent}
          onChange={(e) => setUpdatedCommentContent(e.target.value)}
          className="w-full border border-purple-300 rounded p-2"
        />
        <div className="flex-grow"></div>
        <div className="relative ml-6">
          {/* Save and Cancel buttons */}
          <button
            className="text-black mr-2 hover:text-purple-800"
            onClick={() => handleSaveComment(comment._id)}
          >
            Save
          </button>
          <button
            className="text-black hover:text-purple-800"
            onClick={() => handleCancelEdit()}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="flex items-center">
      <p>{comment.content}</p>
      <div className="flex-grow"></div>
      <div className="relative">
        <button
          className={`text-gray-600 opacity-90 ml-2 group-hover:opacity-100 transition-opacity ${
            showOptions === comment._id ? 'opacity-100' : ''
          }`}
          onClick={() => handleToggleOptions(comment._id)}
        >
          ...
        </button>
        {showOptions === comment._id && (
          <div className="absolute flex flex-col w-40 bg-gray-500 border border-gray-200 pl-1 pr-0 p-1 mt-1 -ml-[40px] rounded-lg">
            <button
              className="text-black mr-2 hover:text-gray-700"
              onClick={() => handleDeleteComment(comment._id)}
            >
              Delete
            </button>
            <button
              className="text-black hover:text-gray-700"
              onClick={() => handleEditComment(comment._id)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
    
    )}
        
        <div className="text-gray-500 flex items-center">
          <span>By: {comment.user.username}</span>
          <span className="ml-2">{formatDate(comment.date)}</span>
        </div>
      </div>
    ))}
  </div>
)}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full border border-purple-300 mt-6 rounded p-2"
            rows="3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-purple-800 text-white rounded-md px-4 py-2 mt-2"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default DetailsPage;
