import type { ButtonHTMLAttributes, ReactNode } from 'react'
export function GameButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) { return <button className={`game-button ${className}`} {...props}>{children}</button> }
