import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import AsciiBackground from "@/components/layout/ascii-background";

export const metadata: Metadata = {
  title: "Login | LifeOS",
  description: "Sign in to your account",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      <AsciiBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">lifeos.</h1>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
