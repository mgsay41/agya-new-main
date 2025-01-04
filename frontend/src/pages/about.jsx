import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobelContext.js";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import SidebarGuest from "../components/sidebar-guest.js";

function About() {
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const auth = isAuthUser?.email;

  return (
    <div className="px-4 md:px-8 lg:px-[150px]">
      <Navbar />
      <div className="flex flex-col md:flex-row my-6 md:my-10">
        <div className="hidden md:block">
          {auth ? (
            <Sidebar className="hidden md:block bg-gray-800 text-white w-full md:w-auto mb-4 md:mb-0" />
          ) : (
            <SidebarGuest className="hidden md:block w-full md:w-auto mb-4 md:mb-0" />
          )}
        </div>
        <div className="w-full md:ml-4">
          <h3 className="text-2xl md:text-3xl text-center font-bold mb-6 md:mb-10">
            About
          </h3>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row justify-between bg-secondary rounded-xl p-4">
            <div className="flex flex-col justify-center items-center text-center mb-4 md:mb-0">
              <h3 className="font-bold text-xl md:text-2xl mb-4">
                About Climate Heritage
              </h3>
              <p className="text-sm px-2 md:px-5">
                Heritage Climate is your hub for archaeological and heritage
                conservation exploration. Connect with fellow enthusiasts, share
                knowledge, and collaborate on projects. Discover a world of
                ancient civilizations and modern preservation efforts. Join our
                community and be part of the future of heritage.
              </p>
            </div>
            <img
              src="/about.png"
              alt=""
              className="w-full md:w-[250px] object-contain"
            />
          </div>

          {/* Research Interests Section */}
          <div className="mt-5">
            <h3 className="text-center my-4 text-xl">Research interests</h3>

            {/* History Timeline */}
            <div className="bg-secondary p-4 md:p-5 rounded-xl mb-4">
              <p className="font-semibold mb-3">History and Timeline</p>
              <div className="flex flex-col md:flex-row justify-between">
                <img
                  src="/Research-about.png"
                  alt=""
                  className="w-[150px] mx-auto md:mx-0 mb-4 md:mb-0"
                />
                <div className="grid grid-cols-2 gap-4 md:gap-10">
                  <div>
                    <p className="mb-4 md:mb-10">Ancient Civilizations</p>
                    <p>Medieval Period</p>
                  </div>
                  <div>
                    <p className="mb-4 md:mb-10">Modern Era</p>
                    <p>Prehistoric Era</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sites and Monuments */}
            <div className="bg-secondary p-4 md:p-5 rounded-xl mb-4">
              <p className="font-semibold mb-3">Sites and Monuments</p>
              <div className="flex flex-col md:flex-row justify-between">
                <img
                  src="/Research-about 2.png"
                  alt=""
                  className="w-[150px] mx-auto md:mx-0 mb-4 md:mb-0"
                />
                <div className="grid grid-cols-2 gap-4 md:gap-10">
                  <div>
                    <p className="mb-4 md:mb-10">World Heritage Sites</p>
                    <p>Virtual Tours</p>
                  </div>
                  <div>
                    <p className="mb-4 md:mb-10">Regional Archaeology</p>
                    <p>Archaeological Sites</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cultural Heritage */}
            <div className="bg-secondary p-4 md:p-5 rounded-xl">
              <p className="font-semibold mb-3">Cultural Heritage</p>
              <div className="flex flex-col md:flex-row justify-between">
                <img
                  src="/Research-about 3.png"
                  alt=""
                  className="w-[150px] mx-auto md:mx-0 mb-4 md:mb-0"
                />
                <div className="grid grid-cols-2 gap-4 md:gap-10">
                  <div>
                    <p className="mb-4 md:mb-10">Conservation Projects</p>
                    <p>Heritage Management</p>
                  </div>
                  <div>
                    <p className="mb-4 md:mb-10">Cultural Impact</p>
                    <p>Legal Protections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Climate Heritage Aim Section */}
          <div className="my-6">
            <h3 className="text-center my-4 text-xl">Climate Heritage Aim</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: "/heroicons-outline_user-group.png",
                  text: "Enhance collective efforts in heritage preservation",
                },
                {
                  icon: "/icon-park_future-build-three.png",
                  text: "Bridge gaps between disciplines",
                },
                {
                  icon: "/mdi_lightbulb-group-outline.png",
                  text: "Provide community for knowledge exchange and scientific topics discussions",
                },
                {
                  icon: "/grommet-icons_book.png",
                  text: "Provide educational materials for enthusiasts and professionals",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border py-6 px-4 flex flex-col justify-center items-center text-center border-black/40 rounded-xl"
                >
                  <img alt="" className="w-8 mb-4" src={item.icon} />
                  <p className="font-bold text-xs">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborations Section */}
          <div className="my-6">
            <h3 className="text-center my-4 text-xl">Collaborations</h3>
            <div className="bg-secondary rounded-xl">
              <div className="flex flex-col sm:flex-row justify-center items-center p-6 md:p-10 gap-6 md:gap-10">
                <img
                  src="/Nile_University_logo 1.png"
                  className="w-24 md:w-28"
                  alt="Nile University"
                />
                <img
                  src="/BMBF_Logo.svg 1.png"
                  className="w-24 md:w-28"
                  alt="BMBF"
                />
                <img src="/image 1371.png" className="w-24 md:w-28" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
