import React, { useCallback } from "react";
import { Button } from "../ui/button";

function Navbar({ title, button }: any) {
  const handleSearchClick = useCallback(() => {
    // Handle search button click
  }, []);

  return (
    <nav className="border-b-2 border-b-accent">
      <div className="flex flex-col lg:flex-row items-center justify-between bg-[#F6FAFDE5]  lg:pl-5">
        <div className="flex items-center gap-5 mb-4 lg:mb-0">
          <img
            className="border-r-3 border-accent pr-2 hidden lg:block"
            src="/images/Logo.svg"
            alt="Logo"
            loading="lazy"
          />
          <h1 className="text-primary font-bold text-xl lg:text-2xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-[#EEF6FBE5] p-3 lg:py-4 lg:pl-20 lg:w-[400px]">
          {button}
          <Button
            className="text-white bg-white rounded-full h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] hover:bg-gray-300"
            onClick={handleSearchClick}
          >
            <img src="/images/search_icon.svg" alt="Search" loading="lazy" />
          </Button>
          <img
            className="rounded-full w-[40px] lg:w-[50px]"
            src="/images/Avatar.svg"
            alt="Avatar"
            loading="lazy"
          />
        </div>
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
