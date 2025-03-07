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
        }, 1000);
    }

    return (
        <div className="flex justify-center items-center h-screen">
        <div className="h-[400px] w-[350px] bg-white p-6 rounded-lg shadow-md border-black border-2 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Secret Message Chat</h1>
            <textarea id="secret-message" className="w-full h-full p-2 border rounded mb-2" placeholder="Enter your secret message..."></textarea>
            <button onClick={generateLink} className="w-full bg-blue-500 text-white p-2 rounded-xl">
                Generate One-Time Link
            </button>
            {generatedLink && (
                <p className="mt-4 text-center text-black">
                    Share this link <br/>
                    <a target="_blank" className="text-blue-600 ">{generatedLink}</a>
                    <br/>
                    { !c && (
                        <div className="mx-auto bg-blue-500 p-1 px-3 rounded-[8px] mt-[10px] font-sans font-semibold text-white flex items-center justify-center cursor-pointer " onClick={copi} id="copi">
                
                        <IoCopy className="mr-2"/>
                            <button>Copy Link</button>
                        </div>
                        )}
                        {c && (
                            <div className="mx-auto bg-blue-500 p-1 px-3 rounded-[8px] mt-[10px] font-sans font-semibold text-white flex items-center justify-center cursor-pointer  ">
                
                            <SiTicktick className="mr-2"/>
                                <button>Copied!</button>
                            </div>
                        )}

                </p>
            )}
        </div>
        </div>
    );
}

export default S;
