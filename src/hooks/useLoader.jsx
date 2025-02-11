"use client";

import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const loaderContext = useContext(LoaderContext);
  const { loading, startLoading, stopLoading } = loaderContext;

  if (!loaderContext) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return { loading, startLoading, stopLoading };
};
