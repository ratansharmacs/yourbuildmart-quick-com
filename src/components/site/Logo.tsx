import ybmLogo from "@/assets/Group 1707479950 (1).png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={ybmLogo}
        alt="YourBuildMart"
        className="h-5 w-auto md:h-7"
      />
    </div>
  );
}
