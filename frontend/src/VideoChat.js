import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const VideoChat = () => {
  const [roomId, setRoomId] = useState();
  const videoGridRef = useRef();
  const socketRef = useRef();
  const myPeerRef = useRef();
  const peerRef = useRef();
  const baseUrl = "http://localhost:8000";
  useEffect(() => {
    // Initialize socket.io connection
    fetch(baseUrl)
    .then(res => res.json())
    .then(data => setRoomId(data.roomId))
    socketRef.current = io(baseUrl);

    // Initialize Peer connection
    myPeerRef.current = new Peer(undefined, {
      host: "/",
      port: "3001",
    });

    // Create video element for local stream
    const myVideo = document.createElement("video");
    myVideo.muted = true;

    // Get user media and add video stream
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);

        // Answer calls from other peers
        myPeerRef.current.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        // Listen for 'user-connected' event and connect to new user
        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    // Listen for 'user-disconnected' event and close peer connection
    socketRef.current.on("user-disconnected", (userId) => {
      if (peerRef.current[userId]) {
        peerRef.current[userId].close();
        delete peerRef.current[userId];
      }
    });

    // Open Peer connection and join room
    myPeerRef.current.on("open", (id) => {
      socketRef.current.emit("join-room", roomId, id);
    });

    // Clean up function
    return () => {
      socketRef.current.disconnect();
      myPeerRef.current.destroy();
    };
  }, []);

  // Function to connect to a new user
  const connectToNewUser = (userId, stream) => {
    const call = myPeerRef.current.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });

    peerRef.current[userId] = call;
  };

  // Function to add video stream to the video grid
  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGridRef.current.appendChild(video);
  };

  return <div id="video-grid" ref={videoGridRef}></div>;
};

export default VideoChat;
