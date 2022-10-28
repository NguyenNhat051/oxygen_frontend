import React, { useState, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import Posts from './Posts';
import { userQuery } from '../utils/data';
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser';
import { useAlert } from 'react-alert'

const Home = () => {
    const alert = useAlert()
    const [isDarkMode, setDarkMode] = React.useState(localStorage.getItem("darkmode") === null ? false : localStorage.getItem("darkmode") === 'true' ? true : false);
    const toggleDarkMode = () => {
        localStorage.setItem("darkmode", !isDarkMode);
        setDarkMode(prevState => !prevState);
    }

    const [toggleSidebar, setToggleSidebar] = useState(false)
    const [user, setUser] = useState();

    const userInfo = fetchUser()

    useEffect(() => {
        const query = userQuery(userInfo?.sub)
        client.fetch(query).then((data) => {
            data[0] === undefined ? alert.show(<div>You are not logged in. Log in now to discover more</div>) :
                setUser(data[0]);
        });

    }, [userInfo?.sub, alert])

    return (
        <div className={isDarkMode?'dark':''}>
            <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out dark:bg-stone-900'>
                {/* PC */}
                <div className='hidden md:flex h-screen flex-initial'>
                    <Sidebar user={user && user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
                </div>
                {/* Mobile */}
                <div className='"flex md:hidden flex-row"'>
                    <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
                        <HiMenu fontSize={40} className="cursor-pointer dark:text-slate-50" onClick={() => setToggleSidebar(true)} />
                        <Link to={`user-profile/${user?._id}`}>
                            {user?.image && <img src={(urlFor(user?.image).url())} alt="user-pic" className="w-12 h-12 rounded-full " />}

                        </Link>
                    </div>
                </div>

                {toggleSidebar && (
                    <div className="fixed min-w-min bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                        <div className="absolute w-full flex justify-end items-center p-2">
                            <AiFillCloseCircle fontSize={30} className="cursor-pointer dark:text-slate-50" onClick={() => setToggleSidebar(false)} />
                        </div>
                        <Sidebar closeToggle={setToggleSidebar} user={user && user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                )}
                <div className="pb-2 flex-1 h-screen overflow-y-scroll scrollbar-hide">
                    <Routes>
                        <Route path="/user-profile/:userId" element={<UserProfile />} />
                        <Route path="/*" element={<Posts user={user && user} />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Home