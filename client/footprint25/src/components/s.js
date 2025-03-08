import React, { useState } from 'react';
import { IoCopy } from "react-icons/io5";
import { SiTicktick } from "react-icons/si";

function S() {
    const [generatedLink, setGeneratedLink] = useState('');
    const [c, setC] = useState(false);
    
    async function generateLink() {
        const secretMessage = document.getElementById('secret-message').value;
        if (!secretMessage) {
            alert("Please enter a secret message.");
            return;
        }
        const result = await fetch('http://127.0.0.1:8000/get-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: secretMessage })
        });
        const data = await result.json();
        if (data.gid) {
            const link = `${window.location.origin}/?pg=secret&gid=${data.gid}`;
            setGeneratedLink(link);
        }
    }

    function copi(){
        navigator.clipboard.writeText(generatedLink);
        setC(true);
        setTimeout(() => {
            setGeneratedLink('');
            setC(false);
        }, 1000);
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="md:h-[400px] h-[500px] w-[350px] bg-white/20 backdrop-blur-lg m-4 p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
            <h1 className="text-xl font-extrabold mb-5 text-center text-white drop-shadow-lg tracking-wide">Secret Message Chat</h1>
            <textarea id="secret-message" className="w-full h-full p-3 border-none rounded-lg mb-4 text-gray-900 bg-white/80 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-lg transition-all duration-300 hover:bg-white" placeholder="Enter your secret message..."></textarea>
            <button onClick={generateLink} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-blue-500">
                Generate One-Time Link
            </button>
            {generatedLink && (
                <div className="text-base font-extrabold mb-5 text-center text-white drop-shadow-lg tracking-wide mt-4">
                    Share this link <br/>
                   
                    <a target="_blank" className="text-yellow-400 ">{generatedLink}</a>
                    <br/>
                    { !c && (
                        <div className="mx-auto mt-4 bg-gradient-to-r from-blue-500  text-white p-2 rounded-lg font-semibold transition-all duration-300 transform hover:from-gray-600 hover:to-purple-600 flex items-center justify-center cursor-pointer " onClick={copi} id="copi">
                        <IoCopy className="mr-2"/>
                            <button>Copy Link</button>
                        </div>
                        )}
                        {c && (
                            <div className="mx-auto bg-gradient-to-r from-blue-500  text-white p-2 rounded-lg font-semibold transition-all duration-300 transform hover:from-gray-600 hover:to-purple-600 flex items-center justify-center cursor-pointer  ">
                            <SiTicktick className="mr-2"/>
                                <button>Copied!</button>
                            </div>
                        )}
                        </div>

            )}
        </div>
        </div>
    );
}

export default S;
