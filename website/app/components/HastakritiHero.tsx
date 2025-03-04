"use client";

import React from "react";
import Particles from "./particles";
import Navbar from "./navbar";

export default function HastakritiHero() {
  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: "hindi-font";
          src: url("/assets/misc/Ananda_Namaste_Regular.ttf") format("truetype");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "hindi-font-2";
          src: url("/assets/misc/Ananda_Neptouch_Regular.ttf") format("truetype");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
        {/* Main Content */}
        <Navbar fade={true} />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
          <Particles
            className="absolute inset-0 -z-10 animate-fade-in"
            quantity={400}
          />
          <h1
            className="pt-32 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text"
            style={{ fontFamily: "hindi-font, hindi-font-2, sans-serif" }}
          >
            Hastakriti<span style={{color:"#6dd1c5"}}>.</span>
          </h1>

          <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
          <div className="my-16 text-center animate-fade-in">
            <h2 className="text-sm text-zinc-500 animate-fade-in">
              Building prosthetics for the future.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
