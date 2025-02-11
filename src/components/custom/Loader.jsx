"use client";

import React from "react";
import { useLoader } from "@/hooks/useLoader";

const Loader = () => {
  const { loading } = useLoader();
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-foreground/50 bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}    
    </>
  );
};

export default Loader;
