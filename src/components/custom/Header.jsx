import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between w-full py-8 fixed lg:px-[8.5rem] md:px-[6.5rem] sm:px-[3.5rem] px-[2.5rem] left-0 top-0 bg-secondary-foreground text-secondary">
      <div>
        <h1 className="text-2xl font-bold">logo</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link className="font-medium" href="/signup">
              Signup
            </Link>
          </li>
          <li>
            <Link className="font-medium" href="/login">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
