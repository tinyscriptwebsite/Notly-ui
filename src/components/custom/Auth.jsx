"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WithAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
      if (!accessToken) {
        router.replace("/login");
      }
    }, [router, accessToken]);

    if (!accessToken) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
