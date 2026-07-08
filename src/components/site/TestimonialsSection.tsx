import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { api, resolveApiImage } from "@/lib/api";
import reviewerOne from "@/assets/Icon Strategy.png";
import reviewerTwo from "@/assets/Icon Strategy (1).png";
import reviewerThree from "@/assets/Icon Strategy (2).png";

const fallbackItems = [
  {
    id: 1,
    name: "Ava A.",
    role: "Marketing Manager",
    image: reviewerOne,
    quote: "I've been consistently impressed with the quality of product provided by this company. They have exceeded my expectations and delivered exceptional results.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ava A.",
    role: "Marketing Manager",
    image: reviewerTwo,
    quote: "I've been consistently impressed with the quality of product provided by this company. They have exceeded my expectations and delivered exceptional results.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ava A.",
    role: "Marketing Manager",
    image: reviewerThree,
    quote: "I've been consistently impressed with the quality of product provided by this company. They have exceeded my expectations and delivered exceptional results.",
    rating: 5,
  },
  {
    id: 4,
    name: "Noah K.",
    role: "Project Engineer",
    image: reviewerOne,
    quote: "Consistent quality and reliable delivery timeline. The product support team is helpful and responsive.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeReview, setActiveReview] = useState(0);
  const testimonialsQuery = useQuery({
    queryKey: ["customer-testimonials"],
    queryFn: () => api.testimonials({ page: 0, size: 20 }),
  });

  const apiItems = (testimonialsQuery.data?.content || [])
    .filter((item) => item.status)
    .map((item) => ({
      id: item.id,
      name: item.customerName,
      role: [item.designation, item.company].filter(Boolean).join(", "),
      image: item.customerImage ? resolveApiImage(item.customerImage) : reviewerOne,
      quote: item.content,
      rating: item.rating || 5,
    }));
  const items = apiItems.length ? apiItems : fallbackItems;
  const active = items[activeReview % items.length];

  return (
    <section className="container-page pb-2 pt-4 md:py-8">
      <SectionHeader title="What Our Client Say About Us" subtitle="Real feedback from our valued customers" />

      <div className="relative md:hidden">
        <button
          onClick={() => setActiveReview((prev) => (prev - 1 + items.length) % items.length)}
          className="absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-orange text-orange-foreground"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <TestimonialCard item={active} className="mx-auto max-w-[290px]" />
        <button
          onClick={() => setActiveReview((prev) => (prev + 1) % items.length)}
          className="absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-orange text-orange-foreground"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="relative hidden md:block">
        <div className="grid gap-4 md:grid-cols-4">
          {items.slice(0, 4).map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  item,
  className = "",
}: {
  item: (typeof fallbackItems)[number];
  className?: string;
}) {
  return (
    <div className={`w-full rounded-2xl border border-border bg-card px-5 py-5 ${className}`}>
      <img src={item.image} alt={item.name} className="mx-auto mb-4 h-16 w-16 rounded-full object-cover" />
      <div className="mb-3 flex justify-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < Math.round(item.rating) ? "fill-orange text-orange" : "fill-muted text-muted"}`}
          />
        ))}
      </div>
      <p className="line-clamp-4 text-center text-sm text-muted-foreground">"{item.quote}"</p>
      <div className="mt-6 text-center">
        <div className="font-display text-base text-brand">{item.name}</div>
        {item.role ? <div className="text-xs text-muted-foreground">{item.role}</div> : null}
      </div>
    </div>
  );
}
