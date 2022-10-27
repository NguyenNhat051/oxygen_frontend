import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { urlFor } from '../client';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

import { AiOutlineLogin } from 'react-icons/ai';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  const [isDarkMode, setDarkMode] = React.useState(localStorage.getItem("darkmode") === null ? false : localStorage.getItem("darkmode") === 'true' ? true : false);
  document.getElementById('root').className = isDarkMode ? 'dark' : '';
  const toggleDarkMode = () => {
    localStorage.setItem("darkmode", !isDarkMode);
    setDarkMode(prevState => !prevState);
  }

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 dark:bg-stone-900">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm dark:bg-stone-900">
        <IoMdSearch fontSize={25} className="ml-1 dark:bg-stone-900 dark:text-slate-50" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className="p-2 w-full bg-white outline-none dark:bg-stone-800 text-slate-50"
        />
      </div>
      {user && <div className="flex gap-3 ">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img src={(urlFor(user?.image).url())} alt="user-pic" className="w-14 h-12 rounded-lg " />
        </Link>
        <Link to="/create-post" className="bg-stone-600 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center dark:bg-slate-600">
          <IoMdAdd />
        </Link>
        <DarkModeSwitch
          onChange={toggleDarkMode}
          checked={isDarkMode}
          className="rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
        />
      </div>}
      {user === undefined && <div className="flex gap-3 ">
        <DarkModeSwitch
          onChange={toggleDarkMode}
          checked={isDarkMode}
          className="rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
        />
        <Link to="/login" className="bg-slate-200 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center dark:bg-stone-800">
          <AiOutlineLogin color="red" fontSize={30} />
        </Link>

      </div>}
    </div>
  );
};

export default Navbar