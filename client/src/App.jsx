import React, { useMemo } from 'react'
// import "tailwindcss";
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
const App = () => {
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const socket = useMemo(() => io("http://localhost:3000", { withCredentials: true }), []);
  console.log(messages);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with id:", socket.id);
      setSocketId(socket.id);
    });
    socket.on("recieve-message", (m) => {
      setMessages((prev) => [...prev, m]);
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  const giveRoom = (e) => {
    e.preventDefault();
    if (room == "") {
      alert("Please enter a room name");
      return;
    }
    socket.emit("join-room", room);
  }
  const sendMessage = (e) => {
    e.preventDefault();
    if (message == "") {
      alert("Please enter a message");
      return;
    }
    socket.emit("message", { message, room });
    setMessage("");
  }


  return (
    <>
      <div className='flex justify-center items-center'>
        <form onSubmit={giveRoom}>
          <div className="mb-6">
            <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Room Name</label>
            <input value={room} onChange={(e) => setRoom(e.target.value)} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">join Room</button>
        </form>

      </div>
      <div className='flex justify-center items-center'>
        <form onSubmit={sendMessage}>
          <div className="mb-6">
            <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Message</label>
            <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
          <button type="submit" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Send Message</button>
        </form>

      </div>
      <div>
        <h1>Sent Messages</h1>
        <div>
          {messages.map((m) => {
            return <div>
              <p>{m}</p>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App