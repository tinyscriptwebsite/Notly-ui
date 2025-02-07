import Header from "@/components/custom/Header";
import Image from "next/image";
import heroImg from "@/assets/Home/Hero.svg";
import { ModeToggle } from "@/components/ui/mode";

export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center place-content-center">
      <Header />
      <ModeToggle />
      <div className="grid grid-cols-1">
        <div className="filex flex-col justify-center items-center text-center h-full">
          <h1 className="text-4xl font-bold mb-4">Welcome to Notely</h1>
          <p className="text-lg font-semibold mb-8">
            Your personal note-taking app
          </p>
        </div>
      </div>
    </div>
  );
}
