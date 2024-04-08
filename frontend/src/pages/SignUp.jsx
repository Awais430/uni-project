import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { server } from "../server.js";
import axios from "axios";
import OAuth from "../Components/OAuth.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.email || !formData.password) {
      setErrorMessage("please fill all the fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await axios.post(`${server}/sign-up`, formData);
      console.log(response);
      const data = response.data;
      if (response.status === 200) {
        // Redirect to sign-in route
        navigate("/sign-in");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
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
                <Label value="username" htmlFor="username">
                  Your username
                </Label>
                <TextInput
                  id="userName"
                  onChange={handleChange}
                  type="text"
                  placeholder="Your name"
                />
              </div>
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
                  "sign Up"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 mt-5 text-sm">
              <h5>Have an account?</h5>
              <Link to="/sign-in" className="text-blue-500">
                Sign In
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

export default SignUp;
