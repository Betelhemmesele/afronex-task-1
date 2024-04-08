import { useState } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom';
export default function CreateBlog() {
  const [files,setFiles]=useState([]);
  const currentUser = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  console.log("files",files);
  const [formData,setFormData]= useState({
    title: '',
    excerpt: '',
    content: '',
    date: '',
    categories: [],
    imageUrls: [],
  })
  const [imageUploadError,setImageUploadError] =useState(null);
  const [uploading,setUploading]=useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleImageSubmit=(e)=>{
    e.preventDefault();
    setUploading(true);
    setImageUploadError(false);
      if(files.length >0 && files.length + formData.imageUrls.length <7){
        const promises=[];
        for(let i=0; i<files.length; i++){
          promises.push(storeImage(files[i]));
        }
        console.log("files length",files.length)
        Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        }).catch((err)=>{
            setImageUploadError("image upload failed (2mb max allowed)");
            setUploading(false);
            console.log(err);
          });
        }else{
          setImageUploadError("you can only upload 6 images per list");
          setUploading(false);
        }
      
  }
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
  const handleDeleteImage = (index) => {
       setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_,i)=>i!==index),
       })
  }
 
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = async(e) => {
        e.preventDefault();
        try {
          if(formData.imageUrls.length < 1){
            return setError('you must upload at least one image');
          }
          setLoading(true);
          setError(false);
          const res=await fetch ('http://localhost:8003/api/blogposts',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            
            body: JSON.stringify({
              ...formData,
              user: currentUser._id,
             }),
             credentials: 'include', 
          })
          console.log("user id",currentUser._id);
          const data =await res.json();
          console.log("data",data);
          setLoading(false);
          if(data.success === false){
            setError(data.message);
          }
          navigate('/blog-listing');
        } catch (error) {
          setError(error.message);
          setLoading(false);

        } 
  }

  return (
    <main className="p-3 mx-auto pb-10 pt-9 max-w-4xl">
       <h1 className="text-3xl font-semibold text-center my-7">create Blog Posts</h1>
       <form  onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
       <div className="flex flex-col gap-3 flex-1">
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
           <div className="flex gap-4">
            <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border boredr-grey-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
            <button type='button' onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-400
             rounded uppercase hover:shadow-lg disabled:opacity-300">{uploading? 'uploading...':'Upload'}</button>
           </div>
           <p className="text-red-700 text-sm">{imageUploadError}</p>
            {
           formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
               <div  className="flex justify-between p-3 border items-center" key={index}>
                    <img src={url} alt="listing image" className="rounded-lg w-20 h-20 object-contain" />
                    <button type="button" onClick={()=>handleDeleteImage(index)} className="p-3
                     text-red-700 border rounded-lg uppercase hover:opacity-95"> Delete</button>
               </div>
             ))
            }
           <button  disabled={loading || uploading} className="p-3 bg-purple-700 text-white rounded-lg
           uppercase hover:opacity-95 disabled:opacity-80">{loading? 'creating ...':'Create posts'}</button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
           </div>
       </form>
    </main>
     )
}