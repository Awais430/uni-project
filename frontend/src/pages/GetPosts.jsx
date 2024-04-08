import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button } from "flowbite-react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";

const defaultImage =
  "https://th.bing.com/th/id/R.6b960e9bfd4dfa87be3b4db9270e0f4d?rik=liZwxSywJoVtCA&pid=ImgRaw&r=0";

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log(post.image);

  return (
    <div
      className={` bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-0 pt  transition-transform duration-300 ${
        isHovered ? "transform hover:-translate-y-4 hover:shadow-lg" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          className=" w-full h-[60%] object-cover rounded-lg"
        />
      ) : (
        <img
          src={defaultImage}
          alt="Default"
          //   className="my-4"
          //   style={{ width: "100%", height: "!200px", objectFit: "cover" }}
        />
      )}
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <div className="text-gray-700">
        {/* Content styling */}
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Category: {post.category}</p>{" "}
      {/* Category styling */}
      <Link to={`/post/${post.slug}`}>
        <Button color="gray" pill size="xs" className="mt-3">
          Read More
        </Button>
      </Link>
    </div>
  );
};

const GetPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/v1/get-posts");
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <div className="p-3 max-w-6xl mx-auto">
        <h1 className="text-3xl mt-10 mb-5 text-center font-semibold lg:text-4xl">
          All Posts
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GetPosts;
