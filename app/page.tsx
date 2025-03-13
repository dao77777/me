import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ClientPart from "./ClientPart";
import { FC, ReactNode } from "react";
import Image from "next/image";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-5">
      {
        session
          ? (
            <div>
              <Image
                className="rounded-sm hover:shadow-xl hover:scale-105 transition-all"
                src={session?.user?.image as any}
                alt="avatar"
                width={100}
                height={100}
                priority
              />
              <div>Username: {session?.user?.name}</div>
              <div>Email: {session?.user?.email}</div>
            </div>
          )
          : (
            <div>
              <div>Not Signed</div>
            </div>
          )
      }
      <FormActionButton onClick={async () => {
        "use server"
        await signIn();
      }}>Sign in</FormActionButton>
      <FormActionButton onClick={async () => {
        "use server"
        await signIn("github");
      }}>Sign in with GitHub</FormActionButton>
      <FormActionButton onClick={async () => {
        "use server"
        await signOut();
      }}>Sign out</FormActionButton>
      <ClientPart />
    </div>
  )
}

const FormActionButton: FC<{ onClick: () => any, children: ReactNode }> = ({ onClick, children }) => {
  return (
    <form
      action={onClick}
    >
      <Button type="submit">
        {children}
      </Button>
    </form>
  )
}

export default Home