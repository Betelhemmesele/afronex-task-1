
import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateBlog() {
  const  currentUser  = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData,setFormData]= useState({
    title: '',
    excerpt: '',
    content: '',
    date: '',
    categories: [],
    imageUrls: [],
  })
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const blogId = params.id; // Update this line to correctly access the listingId from params
      const res = await fetch(`http://localhost:8003/api/getblogpost/${blogId}?userId=${currentUser._id}`,{
        method: 'GET',
        credentials: 'include',
      }
     
    );
    console.log("current ",currentUser._id)
      const data = await res.json();
       console.log("jhjhj",blogId)
        console.log("fetched",data);
      if (data.success === false) {
        console.log("errorr",data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.id]); 

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
          console.log(err);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
            setLoading(true);
      setError(false);
      const res = await fetch(`http://localhost:8003/api/updateblogposts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          user: currentUser._id,
        }),
      });
      if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
      }
  
      const data = await res.json();
  
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/blog-listing`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Edit Blog
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1' style={{ width: '2000px' }}>
        <input
            type="text"
            placeholder="Title"
            className="border p-3 rounded-lg"
            id="title"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            placeholder="Excerpt"
            className="border p-3 rounded-lg"
            id="excerpt"
            required
            onChange={handleChange}
            value={formData.excerpt}
          ></textarea>
          <textarea
            placeholder="Content"
            className="border p-3 rounded-lg"
            id="content"
            required
            onChange={handleChange}
            value={formData.content}
            style={{ height: '200px' }}
          ></textarea>
          <input
            type="date"
            placeholder="Date"
            className="border p-3 rounded-lg"
            id="date"
            required
            onChange={handleChange}
            value={formData.date}
          />
          <input
            type="text"
            placeholder="Categories"
            className="border p-3 rounded-lg"
            id="categories"
            required
            onChange={handleChange}
            value={formData.categories}
          />
          
            
              
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-purple-600 text-white rounded-lg uppercase hover:opacity-85 disabled:opacity-80'
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}