import { SignIn } from "@clerk/nextjs";
import Image from 'next/image';

export default function Page() {
  return (
    <section className="bg-zinc-950 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Branding Column */}
        <div className="relative flex-col items-center justify-center hidden h-full bg-gradient-to-br from-zinc-900 to-zinc-950 lg:flex p-12">
           <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/logo.png"
                alt="Project Logo"
                width={120}
                height={120}
                className="mb-6 rounded-lg"
              />
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                AI Studio
              </h1>
              <p className="text-lg text-zinc-400 max-w-sm">
                Unlock the power of AI to build, launch, and scale your next great idea.
              </p>
           </div>
           <div className="absolute bottom-6 text-sm text-zinc-500">
             © {new Date().getFullYear()} AI Studio. All Rights Reserved.
           </div>
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <SignIn path="/sign-in" afterSignInUrl="/dashboard" />
        </div>
      </div>
    </section>
  );
}