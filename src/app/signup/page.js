"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signup } from "@/utils/api";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/utils/schema";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });
  const onSubmit = async (data) => {
    try {
      const res = await signup(data);
      alert("Signup successful!");
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed.");
    }
  };
  return (
    <div className="flex justify-center items-center flex-col min-h-screen lg:px-[8.5rem] md:px-[6.5rem] sm:px-[3.5rem] px-[2.5rem] ">
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Register your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-2 border rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

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
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full p-2 border rounded"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-sm flex items-center gap-4">
        <p>Already have an account? </p>
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
