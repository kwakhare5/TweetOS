import { cn } from "@/lib/utils"

export function WashiTape({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
 return (
 <div
 className={cn(
 "absolute top-[-10px] left-1/2 -translate-x-1/2 w-28 h-5 border border-amber-200/20 shadow-xs opacity-75 z-10 select-none pointer-events-none",
 className
 )}
 style={{
 backgroundColor: "rgba(254, 240, 138, 0.4)",
 backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(202, 138, 4, 0.1) 5px, rgba(202, 138, 4, 0.1) 10px)",
 backdropFilter: "blur(1.5px)",
 ...style
 }}
 {...props}
 />
 )
}
