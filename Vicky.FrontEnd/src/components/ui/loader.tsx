import { cn } from "./utils";

interface TamagotchiLoaderProps {
  className?: string;
}

export function Loader({ className }: TamagotchiLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {/* Simple Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-gray-600 text-sm font-medium">Loading counterparties...</p>
      </div>
    </div>
  );
}