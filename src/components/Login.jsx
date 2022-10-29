import React from 'react';
import { useNavigate } from 'react-router-dom'
import oxygenVideo from '../assets/share.mp4'
import logo from '../assets/favicon.png'
import jwt_decode from "jwt-decode";
import { client } from '../client'
import { useEffect } from 'react';

const Login = () => {
    const navigate = useNavigate();

    const toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }


    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "398464034858-maqvtiju2j4ugqn9grgpcd7i7mrgd0cq.apps.googleusercontent.com",
            callback: (response) => {
                /* global google */
                let userObject = jwt_decode(response.credential)
                localStorage.setItem('user', JSON.stringify(userObject));

                const { name, sub, picture } = userObject;

                toDataURL(picture)
                    .then(dataUrl => {
                        //console.log('Here is Base64 Url', dataUrl)
                        let fileData = dataURLtoFile(dataUrl, `${picture}`);
                        //console.log("Here is JavaScript File Object", fileData)
                        client.assets
                            .upload('image', fileData, { contentType: fileData.type, filename: fileData.name })
                            .then((document) => {
                                const doc = {
                                    _id: sub,
                                    _type: 'user',
                                    userName: name,
                                    image: {
                                        _type: 'image',
                                        asset: {
                                            _type: 'reference',
                                            _ref: document?._id,
                                        },
                                    },
                                };

                                client.createIfNotExists(doc)
                                    .then(() => {
                                        navigate('/', { replace: true })
                                    })
                            })
                            .catch((error) => {
                                console.log('Upload failed:', error.message);
                            });

                    })
            }
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }  // customization attributes
        );
    }, [navigate])

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>

                <video
                    src={oxygenVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />

                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>

                    <div className="p-5">
                        <img src={logo} width="130px" alt='logo' />
                    </div>

                    <div id="buttonDiv"></div>
                </div>

            </div>
        </div>
    )
}

export default Login