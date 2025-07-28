// app/login/page.tsx
import Image from "next/image";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative flex h-dvh w-full overflow-hidden dark:bg-[#03071e]">
      {/* Left side: image */}
      <div className="hidden flex-1 flex-col overflow-hidden p-1 md:flex">
        <div className="relative flex flex-1">
          <Image
            alt="Login side image"
            src="/images/image02.jpg"
            fill
            className="rounded-2xl object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Right side: login form */}
      <div className="flex w-full flex-1 items-center justify-center overflow-hidden md:w-1/2">
        <RegisterForm />
      </div>
    </main>
  );
}
