import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';


const Post = ({ post: { postedBy, image, _id, title, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const navigate = useNavigate();

  const userInfo = useRef(fetchUser());

  const [alreadySaved, setalreadySaved] = useState(!!(save?.filter((item) => item?.postedBy?._id === userInfo.current?.sub).length));


  const deletePost = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  const savePost = (id) => {
    if (!alreadySaved && userInfo.current?.sub !== undefined) {
      setIsDisable(true)
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: userInfo.current?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: userInfo.current?.sub,
          },
        }])
        .commit()
        .then(() => {
          setalreadySaved(true)
        });
    }
  };

  return (
    <div className="m-2 dark:bg-stone-800">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onTouchStartCapture={() => setPostHovered(true)}
        onTouchEndCapture={() => setPostHovered(false)}

        onClick={() => navigate(`/post-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
          <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />)}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button type="button" className="flex bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                  {save?.length} &nbsp; <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16"> <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" fill="#ffdd00"></path> </svg>
                </button>
              ) : (
                <button
                  disabled={isDisable}
                  onClick={(e) => {
                    e.stopPropagation();
                    savePost(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} Save
                </button>
              )}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">
              <div className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'>
                {title?.length > 8 ? `${title.slice(0, 8)}...` : title}
              </div>
              {
                postedBy?._id === userInfo.current?.sub && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(_id);
                    }}
                    className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                  >
                    <AiTwotoneDelete />
                  </button>
                )
              }
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={(urlFor(postedBy?.image).url())}
          alt="user-profile"
        />
        <p className="font-semibold capitalize dark:text-slate-50">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Post;