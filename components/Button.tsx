import { Button } from "@/components/ui/button"
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}


export default function ButtonComponent({ children, onClick, className, variant }: ButtonProps) {
  return (
    <Button variant={variant} className={`${className} px-6 py-3 bg-[#7272f6] rounded-2xl hover:bg-[#7272f6]/80 cursor-pointer transition-all  duration-300 ease-in-out text-lg`} onClick={onClick}>
      {children}
    </Button>
  )
} 
