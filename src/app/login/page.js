/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/utils/api";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/utils/schema";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLoader } from "@/hooks/useLoader";
import { useEffect } from "react";

const Login = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (localStorage.getItem("accessToken")) return router.push("/dashboard");
  }, []);

  // onSubmit function for handle user login
  const onSubmit = async (formdata) => {
    try {
      startLoading();
      const { data } = await login(formdata);
      if (data.success) {
        toast.success("Login successfull");
        localStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      stopLoading();
    }
  };
  return (
    <div className="flex justify-center flex-col items-center min-h-screen lg:px-[8.5rem] md:px-[6.5rem] sm:px-[3.5rem] px-[2.5rem] ">
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcom back to Notely</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full p-2 border rounded"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-sm flex items-center gap-4">
        <p>Don&apos;t have an account?</p>
        <Link href="/signup" className="text-blue-500">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Login;
