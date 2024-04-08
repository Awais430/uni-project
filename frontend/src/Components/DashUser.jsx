import { Button, Modal, Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
export const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [isloading, setIsLoading] = useState(true);
  //   console.log(userPost);
  // console.log(currentUser);
  // console.log(currentUser._id);
  useEffect(() => {
    if (!currentUser) return; // Guard against null or undefined currentUser
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/v1/get-all-user`);
        const data = await res.json();
        // console.log(data.posts);
        // console.log(res);
        setIsLoading(false);
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const handlShowMore = async () => {
    const startIndex = users.length; // Calculate the startIndex based on the current number of posts
    try {
      const res = await fetch(`api/v1/get-all-user?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]); // Append the new posts to the existing userPost state
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/v1/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (isloading) {
    return (
      <div className=" mx-auto pt-[20%] ">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className=" table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-sky-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            {users.map((user) => (
              <Table.Body className=" divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePictures}
                      alt={user.userName}
                      className="w-10 h-10 object-cover rounded-full bg-green-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.userName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className=" text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className=" font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModel(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center py-7 text-sm"
              onClick={handlShowMore}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>you have no user yet!</p>
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
