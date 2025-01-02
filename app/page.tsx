import SignIn from "@/components/sign-in-btn";
import { auth } from "@/auth";
import { SignOut } from "@/components/sign-out-btn";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      {session ? (
        <div>
          <div>{`Logged in, username: ${session?.user?.name}`}</div>
          <SignOut />
          <Link href="/checkout">Checkout</Link>
          <Link href="/quiz">Quiz</Link>
        </div>
      ) : (
        <div>
          <SignIn />
        </div>
      )}
    </div>
  );
}
