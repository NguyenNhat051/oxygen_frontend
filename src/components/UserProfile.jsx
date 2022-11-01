import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';

import { userCreatedPostsQuery, userQuery, userSavedPostsQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

import { AiFillFileImage } from 'react-icons/ai';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  const userInfo = useRef(null);
    useEffect(() => {
        if(userInfo.current === null) {
            userInfo.current = fetchUser();
        }
    })

  const activeBtnStyles = 'bg-red-500 m-2 text-white font-bold p-2 rounded-full w-20 outline-none dark:text-gray-900';
  const notActiveBtnStyles = 'bg-primary m-2 text-black font-bold p-2 rounded-full w-20 outline-none dark:bg-stone-700';

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPostsQuery = userCreatedPostsQuery(userId);

      client.fetch(createdPostsQuery).then((data) => {
        setPosts(data);
      });
    } else {
      const savedPostsQuery = userSavedPostsQuery(userId);

      client.fetch(savedPostsQuery).then((data) => {
        setPosts(data);
      });
    }
  }, [text, userId]);

  const changeImage = (e, value) => {
    const selectedFile = e.target.files[0];

    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          value === 'image' ?
            client
              .patch(userId)
              .set({
                image: {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: document?._id,
                  },
                },
              })
              .commit()
              .then(() => {
                window.location.reload();
              }) :
            client
              .patch(userId)
              .set({
                background: {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: document?._id,
                  },
                },
              })
              .commit()
              .then(() => {
                window.location.reload();
              });

        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      console.log(selectedFile.type)
    }
  }

  const logout = () => {
    localStorage.clear();

    navigate('/login');
  };

  if (!user) return <Spinner message="Loading profile..." />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-full max-h-56 h-auto 2xl:h-510 shadow-lg object-cover"
              src={user.background ? (urlFor(user.background).url()) : "https://source.unsplash.com/1600x900/?nature,photography,technology"}
              alt="user-pic"
            />
            <div className='group flex flex-col justify-center items-center'>
              <img
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                src={(urlFor(user.image).url())}
                alt="user-pic"
              />
              {
                userInfo.current && userInfo.current?.sub === user?._id && (
                  <label className='hidden group-hover:block absolute'>
                    <p className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                      <AiFillFileImage />
                    </p>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={event => changeImage(event, 'image')}
                      className="w-0 h-0"
                    />
                  </label>
                )
              }
            </div>

          </div>
          <h1 className="font-bold text-3xl text-center mt-3 dark:text-slate-50">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 left-0 p-2 ">
            {
              userInfo.current && userInfo.current?.sub === user?._id && (
                <label>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <div className='group flex justify-center items-center'>
                      <p className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                        <AiFillFileImage />
                      </p>
                      <p className='hidden group-hover:block font-bold max-w-150 mr-1 ml-1 relative text-center break-words px-2 py-2 text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm self-end'>&nbsp; Change Background</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={event => changeImage(event, 'background')}
                    className="w-0 h-0"
                  />
                </label>
              )
            }
          </div>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userInfo.current && userId === userInfo.current.sub && (
              <button
                type="button"
                className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none "
                onClick={logout}
              >
                <AiOutlineLogout color="red" fontSize={25} />
              </button>
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles} dark:text-slate-50`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles} dark:text-slate-50`}
          >
            Saved
          </button>
        </div>
        <div className="px-2">
          <MasonryLayout posts={posts} />
        </div>

        {posts?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2 dark:text-slate-50">
            No Posts Found!
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile