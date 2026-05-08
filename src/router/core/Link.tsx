import { type ReactNode } from "react";
import { useRouterStore } from "@/store/router.store";

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function Link({ to, children, className }: LinkProps) {
  const navigate = useRouterStore((s) => s.navigate)
  
  return (
    <a 
      href={to} 
      className={className}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}