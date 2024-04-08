import {useEffect, useRef,useState} from 'react'
import {useDispatch} from "react-redux";
import { useSelector } from 'react-redux';
import { deleteUserSuccess,updateUserSuccess} from '../redux/reducers/auth';
import {app} from '../firebase';
import {Link }from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {getStorage,ref, getDownloadURL,uploadBytesResumable} from 'firebase/storage';

export default function Profile() {
 const currentUser = useSelector(state => state.auth.user);
 const fileRef=useRef(null);
 const navigate = useNavigate();
 const [file,setFile]=useState(undefined);
 const [filePerc,setFilePerc]=useState(0); 
 const [updateSuccess,setUpdateSuccess]=useState(false);
 const [fileUploadError, setFileUploadError] = useState(false);
 const [formData, setFormData] = useState({});
 const [showConfirmation, setShowConfirmation] = useState(false);
 const dispatch=useDispatch();
 
 useEffect(()=>{
  if (file){
    handleFileUpload(file);
  }
 },[file]);
 
 const handleFileUpload=(file)=>{
  const storage=getStorage(app);
  const fileName=new Date().getTime()+file.name;
  const storageRef=ref(storage, fileName);
  const uploadTask=uploadBytesResumable(storageRef,file);
  uploadTask.on('state_changed',
  (snapshot)=>{
    const progress=(snapshot.bytesTransferred/
    snapshot.totalBytes) * 100;
    setFilePerc(Math.round(progress));
    console.log("upload is"+progress+'% done');
  },
  (error) => {
    setFileUploadError(true);
    console.log("errors",error)
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
      setFormData({ ...formData, avatar: downloadURL })
    );
  }
  )
 }
 const handleChange = (e) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    [e.target.id]: e.target.value,
  }));
};
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const res = await fetch(`http://localhost:8003/api/update/${currentUser._id}`, {
        method: 'PUT', // Use PUT instead of POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        // Update was successful
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        console.log('Update successful');
      } else {
        // Update failed
        console.log('Update failed');
      }
    } catch (error) {
      console.log('An error occurred:', error.message);
    }
  };
const handleDelete = async (e) => {
  e.preventDefault();
  setShowConfirmation(false); 
  try {
    
    const res = await fetch(`http://localhost:8003/api/delete/${currentUser._id}`, {
      method: 'DELETE',
      credentials: 'include', 
    });
    const data = await res.json();
    if (data.success === false) {
  
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
   
    console.log(error.message);
  }
}
const openConfirmation = () => {
  setShowConfirmation(true);
};

const closeConfirmation = () => {
  setShowConfirmation(false);
};
const handleShowListings = () => {
  navigate('/blog-listing');
};
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Profile</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
        < input type="file" className="" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden accept='image/'/>
        <img src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt="profile"
         className="rounded-full h-24 w-24 
         object-cover cursor-pointer self-center mt-2"/>
         <p>
          {fileUploadError?
          (<span className="text-red-700">
            error uploading image
          </span>):
          filePerc > 0 && filePerc < 100 ? (
            <span>{'Uploading ${filePerc}%'}</span>):
             filePerc ===100 ? (
              <span className='text-green-700'>Image uploaded</span>
             ):
             (" ")
           
          }
         </p>
      
         <input
  type="text"
  placeholder="username"
  value={formData.username || currentUser.username}
  id="username"
  className="border p-3 rounded-lg"
  onChange={(e) => handleChange(e)} // Pass the event object to handleChange
/>

<input
  type="text"
  placeholder="email"
  value={formData.email || currentUser.email}
  onChange={(e) => handleChange(e)} // Pass the event object to handleChange
  id="email"
  className="border p-3 rounded-lg"
/>
<input
  type="password"
  placeholder="password"
  id="password"
  className="border p-3 rounded-lg"
  onChange={handleChange}
/>
         <button  className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
          disabled:opacity-80" >Update</button>
          <button onClick={handleShowListings} className=' bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
          disabled:opacity-80'>Show Blogs</button>
     
          <Link className='bg-purple-700 text-white p-3
             rounded-lg uppercase text-center hover:opacity-95'
              to={'/create-blog'}>
            Create Blog
            </Link>
      </form>
      <div className="flex justify-between">
        <span onClick={openConfirmation} className="text-red-700 cursor-pointer">Delete account</span> 
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
      
      <p> {updateSuccess? 'user updated successfully':" "}</p>
   
      </div>
  );
}