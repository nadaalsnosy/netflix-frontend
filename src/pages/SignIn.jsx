import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const SignInPage = () => {
  const userRef = useRef();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  });

  useEffect(() => {
    setErrMsg("");
  }, [userEmail, userPassword]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setAuth({ token, user });
  }, [setAuth]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/signIn",
        JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );

      const token = res?.data?.token;
      const user = res?.data?.user;

      setAuth({ token, user });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log(res);
      console.log(token);
      console.log(user);

      setUserEmail("");
      setUserPassword("");
      navigate("/users");
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Email or Password");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log("Login Faild");
      }
      console.log(err);
    }
  };

  return (
    <div>
      <Form className="signForm text-white bg-black-8" onSubmit={handelSubmit}>
        <h1 className=" mb-5 fw-bold ">Sign In</h1>

        <Form.Group className="mb-4" controlId="formGridEmail">
          <Form.Control
            className={`bg-gray h-50p border-0 ${errMsg ? "errInput" : ""}`}
            type="email"
            placeholder="Enter email"
            ref={userRef}
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <p
            className={`errMsg ${errMsg ? "shown" : "hidden"} `}
            aria-live="assertive"
          >
           Invalid Email or Password
          </p>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formGridPassword">
          <Form.Control
            className={`bg-gray h-50p border-0 ${errMsg ? "errInput" : ""}`}
            type="password"
            placeholder="Password"
            ref={userRef}
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
          <p
            className={`errMsg ${errMsg ? "shown" : "hidden"} `}
            aria-live="assertive"
          >
           Invalid Email or Password
          </p>
        </Form.Group>

        <div className="text-end my-5">
          <Button variant="danger w-100 h-50p" type="submit">
            sign in
          </Button>
        </div>
        <div className="mt-5">
          New to Netflix?{" "}
          <Link className="text-primary text-decoration-none" to={`/signUp`}>
            Sign Up Now.
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default SignInPage;
