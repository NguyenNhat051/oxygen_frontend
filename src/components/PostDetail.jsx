import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline, MdOutlineLink } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { postDetailMorePostQuery, postDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PostDetail = ({ user }) => {
  const [posts, setPosts] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const { postId } = useParams();

  const fetchPostDetails = () => {
    const query = postDetailQuery(postId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPostDetail(data[0]);
        if (data[0]) {
          const query1 = postDetailMorePostQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPosts(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    const query = postDetailQuery(postId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPostDetail(data[0]);
        if (data[0]) {
          const query1 = postDetailMorePostQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPosts(res);
          });
        }
      });
    }
  }, [postId]);

  if (!postDetail) {
    return (
      <Spinner message="Showing post" />
    );
  }

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPostDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  }

  return (
    <>
      <div className="flex flex-col m-auto mt-5 bg-white dark:bg-stone-800">
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            className="rounded-t-3xl rounded-b-lg mt-8"
            src={(postDetail?.image && urlFor(postDetail?.image).url())}
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${postDetail.image.asset.url}?dl=`}
                download
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>
              <a href={postDetail.destination} target="_blank" rel="noreferrer" className='ml-2 text-zinc-900 dark:text-slate-50'>
                <MdOutlineLink size={20} />
              </a>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3 dark: text-zinc-900 dark:text-slate-50">
              {postDetail.title}
            </h1>
            <p className="mt-3 text-zinc-900 dark:text-slate-50">{postDetail.about}</p>
          </div>
          <Link to={`/user-profile/${postDetail?.postedBy._id}`} className="w-fit flex gap-2 mt-5 items-center bg-white rounded-lg dark:bg-stone-900 dark:text-slate-50 dark:border-stone-700">
            <img src={(urlFor(postDetail?.postedBy.image).url())} className="w-10 h-10 m-2 rounded-full" alt="user-profile" />
            <p className="font-bold mr-6">{postDetail?.postedBy.userName}</p>
          </Link>
          <h2 className="mt-5 text-2xl dark:text-slate-50">Comments</h2>
          <div className="max-h-64 overflow-y-auto scrollbar-hide">
            {postDetail?.comments?.map((item) => (
              <div className="flex gap-2 mt-5 items-center bg-white rounded-lg dark:bg-stone-800 dark:text-slate-50 dark:border-stone-700" key={item.comment}>
                <Link to={`/user-profile/${item?.postedBy._id}`}>
                  <img
                    src={(urlFor(item.postedBy?.image).url())}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold">{item.postedBy?.userName}</p>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
          {user && <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${user._id}`}>
              <img src={(urlFor(user?.image).url())} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
            </Link>
            <input
              className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 dark:bg-stone-900 dark:text-slate-50 dark:border-stone-700"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              disabled={addingComment}
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none dark:text-stone-900"
              onClick={addComment}
            >
              {addingComment ? 'Posting...' : 'Comment'}
            </button>
          </div>}
        </div>
      </div>
      {posts?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4 dark:text-slate-50">
          More like this
        </h2>
      )}
      {posts ? (
        <MasonryLayout posts={posts} />
      ) : (
        <Spinner message="Loading more posts" />
      )}
    </>
  )
}

export default PostDetail