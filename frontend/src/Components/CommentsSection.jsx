import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Comment } from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const CommentsSection = ({ postId }) => {
  // console.log(postId);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  // console.log(comments[0])
  const [commentError, setCommentError] = useState(null);
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/v1/like-comment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);

        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
      // console.log(data); // This line should be inside the if block
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    // console.log(comment)
    e.preventDefault();
    if (comment.length > 200) {
      setCommentError("comment's length should not be greater then 200");
    }
    try {
      const res = await fetch("/api/v1/create-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      // console.log(data)
      if (!res.ok) {
        setCommentError(data.message);
      }

      if (res.ok) {
        setCommentError(null);
        setComment("");
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.log(error);
      setCommentError(error.message);
    }
  };
  useEffect(() => {
    const getComment = async () => {
      try {
        const res = await fetch(`/api/v1/get-post-comment/${postId}`);
        const data = await res.json();
        setComments(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getComment();
  }, [postId]);

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) => {
        return c._id === comment._id ? { ...c, content: editedContent } : c;
      })
    );
  };
  const handleDelete = async (commentId) => {
    console.log(commentId);
    try {
      if (!currentUser) {
        navigate("/sign-in");
      }
      const res = await fetch(`/api/v1/delete-comment/${commentId}`, {
        method: "DELETE",
      });
      // console.log(res.data);
      // console.log(data);
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setShowModel(false);
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 ">
          <p>Sgined in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePictures}
            alt=""
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.userName}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 text-sm text-teal-500 my-5">
          You must be signed in to comment.
          <Link className=" text-blue-900 hover:underline" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3 "
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500">
              {200 - comment.length} characters are remaing
            </p>
            <Button outline type="submit" gradientDuoTone="purpleToBle">
              Submit
            </Button>
          </div>
          {commentError && <Alert>{commentError}</Alert>}
        </form>
      )}
      <>
        {comments.length === 0 ? (
          <p className="text-sm py-5">No Comment Yet!</p>
        ) : (
          <>
            <div className=" text-sm my-5 flex items-center gap-1">
              <p>comments</p>
              <div className=" border border-gray-400 rounded-sm py-1 px-2">
                <p>{comments.length}</p>
              </div>
            </div>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId) => {
                  setShowModel(true);
                  setCommentToDelete(commentId);
                }}
              />
            ))}
          </>
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
                Are you sure want to delete your comment?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => handleDelete(commentToDelete)}
                >
                  Yes, i'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModel(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
};

export default CommentsSection;
