import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
const LOGIN_URL = "/login";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const accessToken = response?.data?.token;
      const isAuthenticated = response?.data?.data?.isAuthenticated;

      setAuth({ email, password, accessToken, isAuthenticated });
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrMsg(err.message);
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <section className="">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>TOGETHER</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="on"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button>Sign In</button>
        </form>
        <p>
          Need an Account?
          <br />
          <span className="line">
            {/*put router link here*/}
            <a href="/register">Sign Up</a>
          </span>
        </p>
      </section>
    </>
  );
};

export default Login;
