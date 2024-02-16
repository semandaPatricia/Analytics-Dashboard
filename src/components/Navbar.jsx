//import { SearchIcon } from "@heroicons/react/solid";
import { TextInput } from "@tremor/react";
import React from "react";

const Navbar = () => {
  return (
    <div
      id="top"
      className="relative w-full sm:flex justify-between items-center p-2"
    >
      <h1 className="font-bold text-black">Dashboard</h1>
      <div className="py-2">
        <TextInput placeholder="Search..." />
      </div>
    </div>
  );
};

export default Navbar;