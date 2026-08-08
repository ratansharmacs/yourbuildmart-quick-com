import ybmLogo from "@/assets/Group 1707479950 (1).png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={ybmLogo}
        alt="YourBuildMart"
        width={132}
        height={20}
        className="block h-5 w-[112px] object-contain sm:w-[132px]"
      />
    </div>
  );
}
