import React from "react";

function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full size-20 border-t-4 border-black dark:border-white"></div>
    </div>
  );
}

export default Spinner;
