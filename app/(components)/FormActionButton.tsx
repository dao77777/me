import { FC, ReactNode } from "react"
import { Button } from "@/components/ui/button";

export const FormActionButton: FC<{ onClick: () => any, children: ReactNode }> = ({ onClick, children }) => {
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
