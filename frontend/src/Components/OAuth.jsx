import { Button } from "flowbite-react";
import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../firebase";
import { signInSuccess } from "../Redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    console.log("you click me");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle);
      const res = await fetch('/api/v1/google-signIn', {
        method: 'POST', // <-- Corrected typo from 'methode' to 'method'
        headers: { 
          'Content-Type': "application/json" // <-- Corrected typo from 'Content_Type' to 'Content-Type'
        },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      className="w-[100%] mt-5"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      <span className="pl-3">Sign In with Google</span>
    </Button>
  );
};

export default OAuth;
