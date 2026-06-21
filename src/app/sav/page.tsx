import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SavContent from "@/components/SavContent";

async function authorize(formData: FormData) {
  "use server";
  const pw = formData.get("password") as string;
  if (pw === process.env.SAV_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("sav_auth", "1", {
      httpOnly: true,
      path: "/sav",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  redirect("/sav");
}

export default async function SavPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get("sav_auth")?.value === "1";

  if (authed) {
    return <SavContent />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black">
      <form action={authorize}>
        <input
          type="password"
          name="password"
          autoFocus
          autoComplete="off"
          className="border border-neutral-800 bg-black px-4 py-2 text-white caret-white focus:border-neutral-600 focus:outline-none"
        />
        <button type="submit" className="sr-only">
          Enter
        </button>
      </form>
    </div>
  );
}
