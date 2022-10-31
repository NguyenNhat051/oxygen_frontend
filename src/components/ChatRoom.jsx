import React from 'react'
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { fetchUser } from '../utils/fetchUser';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessages"
import { urlFor } from '../client';

firebase.initializeApp({
    apiKey: `${process.env.FIRE_BASE_API_KEY}`,
    authDomain: "oxygen-366722.firebaseapp.com",
    projectId: "oxygen-366722",
    storageBucket: "oxygen-366722.appspot.com",
    messagingSenderId: `${process.env.FIRE_BASE_MESS_SENDER_ID}`,
    appId: `${process.env.FIRE_BASE_APP_ID}`
});

const firestore = firebase.firestore();

const ChatRoom = ({ setShowChat, user }) => {
    //const firestore = useRef(firebase.firestore());
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const userInfo = fetchUser()
    const dummy = useRef();

    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { sub } = userInfo;
        const picture = (urlFor(user?.image).url())


        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sub,
            picture
        })

        setFormValue('');
        dummy.current.scrollTo({ top: 1000, behavior: 'smooth' });
    }


    useEffect(() => {
        dummy.current.scrollTo({ top: 1000, behavior: 'smooth' });
    }, [messages])


    return (
        <div className='mx-2 fixed bottom-0 right-2 z-10'>
            <p className='w-96 bg-slate-200 text-stone-900 flex items-center justify-between p-2 box-border font-bold'>
                Oxygen Chat Room For Everyone
                <button onClick={() => setShowChat(false)} className="bg-transparent hover:bg-slate-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </p>

            <div className='flex flex-col justify-center bg-slate-50 dark:bg-zinc-700' >
                <main className='p-2 overflow-y-scroll flex flex-col h-[40vh]' ref={dummy}>
                    {messages && messages.map(msg => <ChatMessage key={msg.createdAt} message={msg} user={userInfo} />)}
                </main>

                {userInfo ?
                    <form className='flex mb-2' onSubmit={sendMessage}>
                        <textarea value={formValue} onChange={(e) => setFormValue(e.target.value)} rows="1" className="w-80 scrollbar-hide resize-none block mx-4 pt-3 px-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                        <button type="submit" disabled={!formValue} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                            <span className="sr-only">Send message</span>
                        </button>
                    </form>
                    :
                    <Link to="/login" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Login now to send your message
                    </Link>
                }
            </div>
        </div>
    )
}

export default ChatRoom