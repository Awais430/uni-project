import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  updateStart,
  updateSuccess,
  upadateFail,
  deleteUSerStart,
  deleteUserSuccess,
  deleteUserFail,
  signOutUserSuccess,
} from "../Redux/user/userSlice";
export const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  //   console.log(imageFileUploadError, imageFileUploadingProgress);
  console.log(imageFileUrl);
  const filePickerRef = useRef();
  //   console.log(currentUser.profilePictures);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    // add new date.getTime because user can add two pic then it will b issue in uniqniess of the name of profile
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // snapshot is kind of piece of information you are getiing when uploading image byte by byte
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   to fixed is used for no decimal because progress is showing in decimal like 10.22. etc
        setImageFileUploadingProgress(progress.toFixed(0));
      },

      (error) => {
        console.log(error);
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        // setImageFileUploadError(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePictures: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
    console.log("image is uploading...");
  };
  //   console.log(imageFile, imageFileUrl);
  console.log("image upload error", imageFileUploadError);
  console.log(currentUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };
  const handleSubmit = async (e) => {
    // console.log("you click me");
    setUpdateUserFailure(null);
    setUpdateUserSuccess(null);
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserFailure("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserFailure("please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart);
      const res = await fetch(`/api/v1/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(upadateFail(data.message));
        setUpdateUserFailure(data.message); // Update the state using setUpdateUserFailure
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's Profile updated successfully");
      }
    } catch (error) {
      dispatch(upadateFail(error.message));
      setUpdateUserFailure(error.message); // Update the state using setUpdateUserFailure
      // console.log(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUSerStart());
      const res = await fetch(`/api/v1/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFail(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFail(error.message));
    }
  };
  const handleSignOutUser = async () => {
    try {
      const res = await fetch(`/api/v1/user/sign-out`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutUserSuccess());
      }
    } catch (error) {
      // console.log(data.message);
    }
  };
  return (
    <div className=" max-w-lg w-full mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePictures}
            alt="sorry"
            className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="faliure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="userName"
          placeholder="username"
          defaultValue={currentUser.userName}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "loading..." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className=" w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className=" text-red-500 flex justify-between mt-5">
        <span
          onClick={() => {
            setShowModel(true);
          }}
          className=" cursor-pointer"
        >
          Delte Account
        </span>
        <span className=" cursor-pointer" onClick={handleSignOutUser}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className=" mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserFailure && (
        <Alert color="failure" className=" mt-5">
          {updateUserFailure}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className=" mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModel}
        size="md"
        onClose={() => setShowModel(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className=" text-center">
            <HiOutlineExclamationCircle className=" h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, i'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
