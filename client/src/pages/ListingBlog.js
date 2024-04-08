import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import UpdateBlog from './Updateblog';
import { FaCalendarAlt, FaTag} from 'react-icons/fa';
import {Swiper ,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';

const BlogDisplayPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  SwiperCore.use([Navigation]);

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:8003/api/getblogposts?userId=${currentUser._id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const tasksData = await res.json();
      setBlogs(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // TODO: Handle error, e.g., show an error message
    }
  };
  const openConfirmation = () => {
    setShowConfirmation(true);
  };
  
  const closeConfirmation = () => {
    setShowConfirmation(false);
  };
  const BlogCard = ({ blog }) => {
    console.log("blog id 1 ", blog._id)
  const handleUpdate = () => {
    
    navigate(`/blog-editing/${blog._id}`);
  };
  
  const formatDate = (createdAt) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(createdAt).toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    // Implement the logic to delete the task
    setShowConfirmation(false); 
    try {
      const res = await fetch(`http://localhost:8003/api/deleteblogposts/${blog._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 200) {
        // Task deleted successfully
        console.log('blog deleted successfully');
        // You can update the UI by removing the deleted task from the tasks list
        setBlogs(blogs.filter((b) => b._id !== blog._id));
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // TODO: Handle error, e.g., show an error message
    }
  };

  return (
    <div className="border border-gray-500 p-3 rounded-lg mb-4 shadow-lg overflow-hidden">
      <div className='flex'>
      <div className="border p-5  rounded-lg mb-[10px] " style={{ boxShadow: '0 4px 6px rgba(0, 255, 0, 0.2)' }}>
      <div className="float-card ">
          <h3 className="text-lg uppercase  text-green-900 font-semibold">{blog.title}</h3>
        </div>
        <div className="float-card">
  <p className="mt-2 text-gray-600">
    {blog.content.length > 300
      ? `${blog.content.slice(0, 300)}...`
      : blog.content}
  </p>
</div>
        <div className="float-card ">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-600" />
            <p className="text-gray-600">{formatDate(blog.date)}</p>
          </div>
        </div>
        <div className="float-card">
  {blog.categories.map((category, index) => (
    <div className="flex items-center" key={index}>
      <FaTag className="mr-2 text-gray-600" />
      <p className="text-gray-600">{category}</p>
    </div>
  ))}
</div>
        
      </div>
      <div className={`border z-0 ml-[10px] rounded-lg mb-[10px] ${blog.imageUrls.length === 1 ? 'w-[2110px]' : 'w-[380px]'}`} style={{ boxShadow: '0 4px 6px rgba(0, 255, 0, 0.2)' }}>
      <Swiper navigation>
            {blog.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[400px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
      </div>
      </div>
      <div className="flex justify-end mt-4">
        <button className="mr-2 bg-purple-700 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded" onClick={handleUpdate}>
          Update
        </button>
        <div className="flex justify-between">
        <span onClick={openConfirmation} className="mr-2 bg-red-700 hover:bg-red-500 text-white  cursor-pointer font-semibold py-2 px-4 rounded">Delete</span> 
        {/* Confirmation dialog */}
        {showConfirmation && (
      <div className="fixed inset-0 flex items-center justify-center rounded-lg bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg text-gray-800">Are you sure you want to delete your account?</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDelete}
              className="px-4 py-2  bg-red-400 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={closeConfirmation}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              No
            </button>
            
          </div>
        </div>
        
      </div>
    )}
           </div>
      </div>
    </div>
  );
  };

  return (
    <div className="p-6 pt-10 pb-[80px] mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-green-900 text-center my-7">Posts</h1>
    
      {blogs.map((blog) => (
        
      <div key={blogs._id}>
        
          <BlogCard blog={blog} />
      </div>
    ))}
    </div>
    
  );
};

export default BlogDisplayPage;