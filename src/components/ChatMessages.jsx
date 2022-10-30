import React from 'react'

const ChatMessages = (props) => {
    const { text, sub, picture } = props.message;

    const messageClass = sub === props.user.sub ? 'flex items-center flex-row-reverse my-1 mt-1' : 'flex items-center my-1 mt-1';
    const pClass = sub === props.user.sub ? 'max-w-150 mr-1 ml-1 relative text-white text-center break-words px-2 py-2 rounded-2xl text-white bg-blue-600 self-end' : 'max-w-150 mr-1 ml-1 break-words relative text-white text-center px-2 py-1 rounded-2xl rounded-3xl bg-gray-300 text-black';

    return (
        <>
            <div className={`${messageClass}`}>
                <img className='w-6 h-6 rounded-full' alt='user' src={picture || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
                <p className={`${pClass}`}>{text}</p>
            </div>
        </>
    )
}

export default ChatMessages