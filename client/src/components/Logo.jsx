import React from "react";

function Logo() {
  return (
    <div className="inline-block">
      <h1
        className="text-2xl md:text-3xl font-extrabold tracking-tight
                   bg-gradient-to-r from-green-500 via-teal-500 to-blue-500
                   bg-clip-text text-transparent
                   hover:from-blue-500 hover:to-green-500
                   transition-all duration-500 cursor-pointer
                   whitespace-nowrap"
      >
        Vihaara
      </h1>
    </div>
  );
}

export default Logo;
