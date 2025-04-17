import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {children}
    </div>
  )
}