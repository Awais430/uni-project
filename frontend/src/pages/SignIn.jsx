import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { server } from "../server.js";

import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../Redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../Components/OAuth.jsx";
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  // const [errorMessage, setErrorMessage] = useState("");
  // const [loading, setLoading] = useState("");
  // console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/v1/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left side */}
          <div className="flex-1">
            <Link to="/" className="text-4xl dark:text-white font-bold">
              <span className="px-2 ml-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Mern Stack's
              </span>
              Blog
            </Link>
            <p className="text-sm pl-3 pt-8">
              This is a demo project. You can sign in with your email and
              password or with Google.
            </p>
          </div>
          {/* right side */}
          <div className="pl-3 flex-1">
            <form onSubmit={handleSubmit}>
              <div className="pt-3">
                <Label value="email" htmlFor="email">
                  Your email
                </Label>
                <TextInput
                  id="email"
                  onChange={handleChange}
                  placeholder="Example@gmail.com"
                />
              </div>
              <div className="pt-3">
                <Label value="password" htmlFor="password">
                  Your password
                </Label>
                <TextInput
                  id="password"
                  onChange={handleChange}
                  type="password"
                  placeholder="Your password"
                />
              </div>
              <Button
                className="w-[100%] mt-5"
                gradientDuoTone="purpleToPink"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size={20} />
                    <span
                      className="pt-5
                   "
                    >
                      loading...
                    </span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 mt-5 text-sm">
              <h5>Not have any account?</h5>
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
