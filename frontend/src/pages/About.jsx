import React, { useState } from "react";
import hamzaImage from "../../src/images/hamza-removebg-preview (1).png"; // Update the path to your image
import cv from "../assets/cv/hamza maqbool.pdf";
import hamidAli from "../../src/images/ham3.png"; // Update the path to your image

import Header from "../Components/Header";
const About = () => {
  return (
    <>
      <Header />
      <section>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto p-3 text-center">
            <div>
              <h1 className="text-3xl font font-semibold text-center my-7">
                About Hamza and Hamid' Blog
              </h1>
              <div className="text-md text-gray-500 flex flex-col gap-6">
                <p>
                  Welcome to Hamza and Hamid's Blog! This blog was created by
                  Hamza and Hamid as a personal project to share there thoughts
                  and ideas with the world. Hamza and Hamid is a passionate
                  developer who loves to write about technology, coding, and
                  everything in between.
                </p>

                <p>
                  On this blog, you'll find weekly articles and tutorials on
                  topics such as web development, software engineering, and
                  programming languages. Hamza and Hamid is always learning and
                  exploring new technologies, so be sure to check back often for
                  new content!
                </p>

                <p>
                  We encourage you to leave comments on our posts and engage
                  with other readers. You can like other people's comments and
                  reply to them as well. We believe that a community of learners
                  can help each other grow and improve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div>
            {/* Job Title */}
            <h2 className="text-3xl font-bold text-center md:text-left mb-4">
              Mern Stack Developer
            </h2>
            {/* Name */}
            <h1 className="text-2xl font-semibold text-center md:text-left mb-4">
              Hamza Maqbool
            </h1>
            {/* Description */}
            <p className="text-lg text-gray-700 text-center md:text-left mb-8">
              Aspiring Web Developer. Based in Lahore, Pakistan. Love learning
              new technologies & developing high-quality websites & applications
              for businesses & users.
            </p>
            {/* Social Media Links */}
          </div>
          {/* Right Column */}
          <div className="hidden md:block">
            <img
              src={hamzaImage}
              className="w-full rounded-lg"
              alt="vector image of female coding working environment"
            />
          </div>
        </div>
      </section>
      <section className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div className="hidden md:block">
            <img
              src={hamidAli}
              className="w-full rounded-lg"
              alt="vector image of female coding working environment"
            />
          </div>
          {/* Right Column */}

          <div>
            {/* Job Title */}
            <h2 className="text-3xl font-bold text-center md:text-left mb-4">
              Front-end Developer
            </h2>
            {/* Name */}
            <h1 className="text-2xl font-semibold text-center md:text-left mb-4">
              Hamid Ali
            </h1>
            {/* Description */}
            <p className="text-lg text-gray-700 text-center md:text-left mb-8">
              Passionate about web development and dedicated to crafting
              exceptional user experiences. Proficient in frontend technologies,
              eager to learn and adapt to new advancements in the field.
            </p>
            {/* Social Media Links */}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
