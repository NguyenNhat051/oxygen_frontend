import React from 'react'

const ChatMessages = (props) => {
    const { text, sub, picture } = props.message;

    const messageClass = sub === props.user?.sub ? 'flex items-center flex-row-reverse my-1 mt-1' : 'flex items-center my-1 mt-1';
    const send = 'max-w-150 mr-1 ml-1 relative text-center break-words px-2 py-2 text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm self-end'
    const recive = 'max-w-150 mr-1 ml-1 break-words relative text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'
    const pClass = sub === props.user?.sub ? send : recive ;

    return (
        <>
            <div className={`${messageClass}`}>
                <img className='p-1 w-8 h-8 rounded-full ring-2 ring-gray-300 dark:ring-gray-500' alt='user' src={picture || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
                <p className={`${pClass}`}>{text}</p>
            </div>
        </>
    )
}

export default ChatMessages