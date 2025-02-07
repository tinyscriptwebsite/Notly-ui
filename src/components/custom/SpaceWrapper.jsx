"use client";

import React from "react";
import { ModeToggle } from "../ui/mode";
import { usePathname } from "next/navigation";

const SpaceWrapper = ({ children }) => {
  const pathname = usePathname();
  return (
    <>
      {!pathname.includes("dashboard") && (
        <ModeToggle className={"absolute top-6 right-4"} />
      )}
      <div className="font-monst">{children}</div>
    </>
  );
};

export default SpaceWrapper;
