import {BrowserRouter, Route,Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import DetailsPage from './pages/Detailpost';
import Profile from './pages/Profile';
import CreateBlog from './pages/Createblog';
import BlogDisplayPage from './pages/ListingBlog';
import UpdateBlog from './pages/Updateblog';
export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/" element={<HomePage />}/>
    <Route path="/signup" element={<SignUp/>}/>
    <Route path="/signin" element={<SignIn/>}/>
    <Route path="/details/:postId" element={<DetailsPage/>} />
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/create-blog" element={<CreateBlog/>}/>
    <Route path="/blog-listing" element={<BlogDisplayPage/>}/>
    <Route path="/blog-editing/:id" element={<UpdateBlog/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    
  )
}
