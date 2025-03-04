import React from "react";
import dynamic from "next/dynamic";

const HastakritiHero = dynamic(() => import("./components/HastakritiHero"), {
  ssr: false,
});

export default function Home() {
  return <HastakritiHero />;
}
