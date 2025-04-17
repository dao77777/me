import Link from "next/link";

export default async function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <Link className="custom-link" href="/client-component-test">Client component Test</Link>
      <Link className="custom-link" href="/auth-test">Auth Test</Link>
      <Link className="custom-link" href="/chat">Chat</Link>
    </div>
  )
};
