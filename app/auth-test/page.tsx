import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import { FormActionButton } from "@/app/(components)/FormActionButton";
import { nullif } from "@/lib/utils";

export default async function AuthTest() {
  const session = await auth();
  console.log(session);
  return (
    <div className="
      group
      flex items-start gap-3
      custom-border
    ">
      <div className="flex flex-col items-start gap-2">
        {
          session
            ? (
              <>
                {
                  nullif(session?.user?.image, "")
                    ? (
                      <Image
                        className="
                          rounded-sm
                          shadow-sm
                          hover:shadow-md hover:scale-105 
                          transition-all
                        "
                        src={session?.user?.image!}
                        alt="avatar"
                        width={100}
                        height={100}
                        priority
                      />
                    )
                    : "No Avatar"
                }
                <div>Username: {nullif(session?.user?.name, "") ?? "No Username"}</div>
                <div>Email: {nullif(session?.user?.email, "") ?? "No Username"}</div>
              </>
            )
            : (
              "Not Signed"
            )
        }
      </div>
      <div className="
        h-full
        border-r-[1px] border-stone-400/10
        group-hover:border-stone-400/20
        transition-all
      "></div>
      <div className="flex flex-col items-start gap-2">
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
      </div>
    </div>
  )
};