import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  viewAllTo,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllTo?: string;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={`mb-8 flex flex-col gap-2 ${center ? "items-center text-center" : "items-start"} relative`}>
      {eyebrow && (
        <span className="rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange">
          🔥 {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="absolute right-0 top-2 hidden items-center gap-1 text-sm font-medium text-brand hover:underline md:flex"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
