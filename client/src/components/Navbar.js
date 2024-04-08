import React from 'react';
import { Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Navbar() {
  const currentUser = useSelector(state => state.auth.user);
  console.log("jhjhj",currentUser)
  return (
    <header className='bg-black z-10 w-full h-[70px] top-0 sticky shadow-md'>
      <div className='flex text-white justify-between items-center max-w-6xl mx-auto p-2 '>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl  hover:text-red-500 flex flex-wrap'>
            <span >BP</span>
          </h1>
        </Link>

        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-white hover:text-red-500'>
              Home
            </li>
          </Link>
          {currentUser ? (
            <Link to='/profile'>
              <li className='hidden sm:inline text-white hover:text-red-500'>
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='profile'
                />
              </li>
            </Link>
          ) : (
            <Link to='/signin'>
              <li className='hidden sm:inline text-white hover:text-red-500'>
                Login/Register
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
