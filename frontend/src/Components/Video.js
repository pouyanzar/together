import { useEffect, useState, useRef, useContext } from "react";
import Button from "react-bootstrap/Button";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import Peer from "peerjs";
import AuthContext from "../context/AuthProvider";

import io from "socket.io-client";

const Video = () => {
  const { auth } = useContext(AuthContext);
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [emailToCall, setEmailToCall] = useState("");
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const { email } = auth;
  const socket = io("http://localhost:8000");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
    socket.on("me", (id) => {
      console.log("adding IDDDD......");
      fetch("http://localhost:8000/api/v1/add-socket-id", {
        method: "PATCH",
        body: JSON.stringify({ socketId: id, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (email) => {
    const peer = new window.SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      fetch("http://localhost:8000/api/v1/find-user-by-email", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) =>
        res.json().then((user) => {
          if (user) {
            setIdToCall(user.socket_id);
          }
          console.log(idToCall);
        })
      );
      console.log("id to call: ", idToCall);
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      console.log("connected!!!!");
      // if (userVideo.current) {
      //   console.log('user')
      userVideo.current.srcObject = stream;
      // }
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    peer.on("error", (error) => {
      console.error("An error occurred:", error);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    console.log("answering the call....");
    setCallAccepted(true);
    const peer = new window.SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      console.log(caller);
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>TOGETHER</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px", height: "300px" }}
              />
            )}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "300px", height: "300px" }}
              />
            ) : null}
          </div>
        </div>
        <div className="myId">
          <input
            type="text"
            id="filled-basic"
            label="Name"
            placeholder="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <p>{email}</p>

          {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button
              variant="sucess"
              // startIcon={<AssignmentIcon fontSize="large" />}
            >
              Copy ID
            </Button>
          </CopyToClipboard> */}

          <input
            type="text"
            id="filled-basic"
            placeholder="Enter the ID to call"
            label="ID to call"
            variant="filled"
            value={emailToCall}
            onChange={(e) => setEmailToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <Button
                // color="primary"
                aria-label="call"
                onClick={() => callUser(emailToCall)}
              >
                📞
              </Button>
            )}
            <p>USER TO CALL: {emailToCall}</p>
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Video;
