import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

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

  const User = fetchUser()

  const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
  const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

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
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
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
                User && User?.sub === user?._id && (
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
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 left-0 p-2 ">
            {
              User && User?.sub === user?._id && (
                <label>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <div className='group flex justify-center items-center'>
                      <p className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                        <AiFillFileImage />
                      </p>
                      <p className='hidden group-hover:block'>&nbsp; Change Background</p>
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
            {User && userId === User.sub && (
              <GoogleLogout
                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                render={(renderProps) => (
                  <button
                    type="button"
                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none "
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
                onLogoutSuccess={logout}
                cookiePolicy="single_host_origin"
              />
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
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
        </div>
        <div className="px-2">
          <MasonryLayout posts={posts} />
        </div>

        {posts?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Posts Found!
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile