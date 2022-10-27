import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/favicon.png';
import { categories } from '../utils/data';
import { urlFor } from '../client';
import { DarkModeSwitch } from 'react-toggle-dark-mode';


const Sidebar = ({ closeToggle, user, isDarkMode, toggleDarkMode }) => {
    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false);
    };

    const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize dark:text-slate-50';
    const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize dark:text-slate-50 dark:border-white';

    return (
        <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 scrollbar-hide dark:bg-stone-800">
            <div className="flex flex-col">
                <Link
                    to="/"
                    className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}
                >
                    <img src={logo} alt="logo" className="w-20" />
                    <span className='font-bold dark:text-slate-50'>Oxygen</span>
                </Link>

                <div className="flex flex-col gap-5">
                    <div className='flex'>
                    <NavLink
                        to="/" end
                        className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle) +'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black dark:border-white'}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                        
                    </NavLink>
                    <DarkModeSwitch
                            onChange={toggleDarkMode}
                            checked={isDarkMode}
                            className="ml-2 w-6 h-6"
                        />
                    </div>
                    <h3 className="font-bold mt-2 px-5 text-base 2xl:text-xl dark:text-slate-50">Discover categogries</h3>
                    {categories.map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                            onClick={handleCloseSidebar}
                            key={category.name}
                        >
                            <img src={category.image} alt='category' className="object-fill w-8 h-8 rounded-full shadow-sm" />
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>
            {user && (
                <Link
                    to={`user-profile/${user._id}`}
                    className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 dark:bg-stone-800 dark:text-slate-50"
                    onClick={handleCloseSidebar}
                >
                    <img src={(urlFor(user?.image).url())} className="w-10 h-10 rounded-full" alt="user-profile" />
                    <p className='font-bold dark:text-slate-50'>{user.userName}</p>
                    <IoIosArrowForward />
                </Link>
            )}
        </div>
    );
};

export default Sidebar;