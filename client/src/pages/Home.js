
import React, { useEffect, useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:8003/api/blogposts');
        const data = await response.json();
        setBlogPosts(data);
        setSelectedPost(data[0]); // Set the first post as the selectedPost by default
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogPosts();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const formatDate = (createdAt) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(createdAt).toLocaleDateString(undefined, options);
  };

  return (
    <div className="pt-[90px] mb-[100px] mx-[500px]">
      <div className="border border-gray-300 rounded-md mb-4">
        {selectedPost && (
          <>
            <div className="mb-4">
              <img src={selectedPost.imageUrls[0]} alt={selectedPost.title} className="w-[900px] h-auto" />
            </div>
            <div className="ml-7 mb-4">
              <p>{formatDate(selectedPost.createdAt)}</p>
              <h3 className="text-xl font-bold">{selectedPost.title}</h3>
              <p className="mt-2">{selectedPost.content.length > 100 ? `${selectedPost.content.slice(0, 100)}...` : selectedPost.content}</p>
              <p className="text-gray-500 mt-2">Written by: {selectedPost.user.username}</p>
            </div>
            <div className="flex mr-7 mb-6 justify-end">
            <FaComment className="text-purple-800" />
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {blogPosts.map((blogPost) => (
          <Link key={blogPost._id} to={`/details/${blogPost._id}`} className={`border border-gray-300 rounded-md mb-4 ${selectedPost?._id === blogPost._id ? 'hidden' : ''}`}>
            <img src={blogPost.imageUrls[0]} alt={blogPost.title} className="w-full h-[200px]" />
            <div className="p-4">
              <p>{formatDate(blogPost.createdAt)}</p>
              <h3 className="text-lg font-bold">{blogPost.title}</h3>
              <p className="mt-2">{blogPost.excerpt}</p>
              <p className="mt-2">{blogPost.content.length > 80 ? `${blogPost.content.slice(0, 80)}...` : blogPost.content}</p>
              <p className="text-gray-500 mt-2">Written by: {blogPost.user.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;