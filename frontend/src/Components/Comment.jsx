import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { UseSelector, useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { set } from "mongoose";
export const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const [editiedComment, setEditedComment] = useState({});

  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditng] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      let userId = comment.userId;
      try {
        const res = await fetch(`/api/v1/get-single-user/${userId}`);
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);
  // console.log(user.profilePictures);
  const handleEdit = async (e) => {
    setIsEditng(true);
    setEditedComment(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editiedComment,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
      }

      if (res.ok) {
        setIsEditng(false);
        onEdit(comment, editiedComment);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className=" flex-shrink-0 mr-3">
        <img
          className=" w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePictures}
          alt="ok"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className=" font-bold text-xs mr-1 truncate">
            {user ? `@${user.userName}` : "anonymous user"}
          </span>
          <span className=" text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editiedComment}
              x
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => {
                  setIsEditng(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className=" text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                className={`ext-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "! text-blue-500"
                }`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className=" text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    "" +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className=" text-gray-400 hover:text-blue-500"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className=" text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
