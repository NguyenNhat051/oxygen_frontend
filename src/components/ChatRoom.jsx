import React from 'react'
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { fetchUser } from '../utils/fetchUser';
import { useState, useRef } from 'react';

import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessages"

firebase.initializeApp({
    apiKey: "AIzaSyA2c7AacuP6svq-jJE5LB1TtlHYldwhFRw",
    authDomain: "oxygen-366722.firebaseapp.com",
    projectId: "oxygen-366722",
    storageBucket: "oxygen-366722.appspot.com",
    messagingSenderId: "496043103337",
    appId: "1:496043103337:web:27ac971694f7885b74fef8"
});

const firestore = firebase.firestore();

const ChatRoom = () => {
    //const firestore = useRef(firebase.firestore());
    const dummy = useRef(null);
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const userInfo = fetchUser()

    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { sub, picture } = userInfo;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sub,
            picture
        })

        setFormValue('');
        dummy.current.scrollTo({ top: 1000, behavior: 'smooth' });
    }

    return (
        <div className='m-2 bg-white fixed bottom-0 right-2 z-10'>
            <p className='bg-slate-500 text-white flex items-center justify-between p-2 box-border'>🐧🐧🐧🐧🐧</p>

            <div className='flex flex-col justify-center bg-gray-900' >
                <main className='p-2 overflow-y-scroll flex flex-col h-[40vh]' ref={dummy}>
                    {messages && messages.map(msg => <ChatMessage key={msg.createdAt} message={msg} user={userInfo} />)}
                </main>

                <form className='flex' onSubmit={sendMessage}>
                    <textarea value={formValue} onChange={(e) => setFormValue(e.target.value)} rows="1" className="w-80 scrollbar-hide resize-none block mx-4 pt-3 px-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                    <button type="submit" disabled={!formValue} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatRoom