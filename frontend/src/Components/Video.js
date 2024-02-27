import { useEffect, useState, useRef, useContext } from "react";
import Button from "react-bootstrap/Button";
import AuthContext from "../context/AuthProvider";
import io from "socket.io-client";
import Chat from "./Chat";

const Video = () => {
  const { auth } = useContext(AuthContext);
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [emailToCall, setEmailToCall] = useState("");
  const [callerName, setCallerName] = useState("");
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const socket = useRef();
  const connectionRef = useRef();
  const { email } = auth;
  const baseUrl = "https://together-server-8glm.onrender.com";

  useEffect(() => {
    socket.current = io(baseUrl);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
    socket.current.on("me", (id) => {
      fetch(`${baseUrl}/api/v1/add-socket-id`, {
        method: "PATCH",
        body: JSON.stringify({ socketId: id, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMe(id);
    });

    socket.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
    });
  }, [email]);

  const callUser = (email) => {
    const peer = new window.SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", async (data) => {
      await fetch(`${baseUrl}/api/v1/find-user-by-email`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) =>
        res.json().then((user) => {
          if (user) {
            socket.current.emit("callUser", {
              userToCall: user.socket_id,
              signalData: data,
              from: me,
              name: name,
            });
          }
        })
      );
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    peer.on("error", (error) => {
      console.error("An error occurred:", error);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new window.SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: caller });
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
      <h1 className="title">TOGETHER</h1>
      <div className="container">
        <div className="chatVideoContainer">
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
          <div className="subContainer">
            <div className="myId">
              {!callAccepted || callEnded ? (
                <>
                  <input
                    type="text"
                    id="filled-basic"
                    label="Name"
                    placeholder="Name"
                    variant="filled"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      marginBottom: "20px",
                    }}
                  />
                  <input
                    type="text"
                    id="filled-basic"
                    placeholder="Enter the email to call"
                    label="Email to call"
                    variant="filled"
                    value={emailToCall}
                    onChange={(e) => setEmailToCall(e.target.value)}
                  />
                </>
              ) : null}
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <>
                    <Chat />
                    <Button
                      className="endCall"
                      variant="contained"
                      color="secondary"
                      onClick={leaveCall}
                    >
                      End Call
                    </Button>
                  </>
                ) : (
                  <Button
                    ariant="contained"
                    color="secondary"
                    aria-label="call"
                    onClick={() => callUser(emailToCall)}
                  >
                    📞
                  </Button>
                )}
              </div>
            </div>

            <div>
              {receivingCall && !callAccepted ? (
                <div className="caller">
                  <h1>{callerName} is calling...</h1>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={answerCall}
                  >
                    Answer
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
