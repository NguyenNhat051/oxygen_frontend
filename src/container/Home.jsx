import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import Alert from 'react-popup-alert'
import 'react-popup-alert/dist/index.css'
import { Sidebar, UserProfile } from '../components';
import Posts from './Posts';
import { userQuery } from '../utils/data';
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser';


const Home = () => {
    /*Popup*/
    const [alert, setAlert] = React.useState({
        type: 'error',
        text: 'This is a alert message',
        show: false
    })

    function onCloseAlert() {
        setAlert({
            type: '',
            text: '',
            show: false
        })
    }

    function onShowAlert(type) {
        setAlert({
            type: type,
            text: 'Login to explore more',
            show: true
        })
    }
    /*EndPopup*/

    const [toggleSidebar, setToggleSidebar] = useState(false)
    const [user, setUser] = useState();
    const scrollRef = useRef(null);
    const userInfo = fetchUser()

    useEffect(() => {
        const query = userQuery(userInfo?.sub)
        client.fetch(query).then((data) => {
            data[0] === undefined ? onShowAlert('success') :
                setUser(data[0]);
        });

    }, [userInfo?.sub])

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    }, []);

    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out dark:bg-stone-900'>
            <Alert
                header={'You are not login'}
                btnText={'Login'}
                text={alert.text}
                type={alert.type}
                show={alert.show}
                onClosePress={onCloseAlert}
                pressCloseOnOutsideClick={true}
                showBorderBottom={true}
                alertStyles={{}}
                headerStyles={{margin:'40px'}}
                textStyles={{}}
                buttonStyles={{}}
            />
            {/* PC */}
            <div className='hidden md:flex h-screen flex-initial'>
                <Sidebar user={user && user} />
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
                <div className="fixed w-1/3 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                    <div className="absolute w-full flex justify-end items-center p-2">
                        <AiFillCloseCircle fontSize={30} className="cursor-pointer dark:text-slate-50" onClick={() => setToggleSidebar(false)} />
                    </div>
                    <Sidebar closeToggle={setToggleSidebar} user={user && user} />
                </div>
            )}
            <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
                <Routes>
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    <Route path="/*" element={<Posts user={user && user} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Home