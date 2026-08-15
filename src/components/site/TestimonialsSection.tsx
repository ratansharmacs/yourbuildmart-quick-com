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
  const [activeIndex, setActiveIndex] = useState(0);
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
  const visibleItems = Array.from(
    { length: Math.min(4, items.length) },
    (_, offset) => items[(activeIndex + offset) % items.length],
  );
  const goPrevious = () => setActiveIndex((current) => (current - 1 + items.length) % items.length);
  const goNext = () => setActiveIndex((current) => (current + 1) % items.length);

  return (
    <section className="container-page max-w-[1320px] pb-2 pt-4 md:py-8">
      <SectionHeader title="What Our Client Say About Us" subtitle="Real feedback from our valued customers" />

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <TestimonialCard key={item.id} item={item} className="w-[82%] shrink-0 snap-start" />
        ))}
      </div>

      <div className="relative hidden md:block">
        <div className="grid grid-cols-4 gap-5 px-2 pb-2">
          {visibleItems.map((item, slot) => (
            <TestimonialCard key={`${item.id}-${slot}`} item={item} className="min-w-0" />
          ))}
        </div>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={goPrevious}
              className="absolute left-0 top-1/2 z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-md transition hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={goNext}
              className="absolute right-0 top-1/2 z-10 grid h-10 w-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-md transition hover:bg-secondary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {items.length > 1 ? (
        <div className="mt-4 hidden justify-center gap-2 md:flex" aria-label="Current testimonial">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Start with testimonial ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${activeIndex === index ? "bg-brand" : "bg-brand/25"}`}
            />
          ))}
        </div>
      ) : null}
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
    <article className={`h-full rounded-xl border border-border bg-card px-3 py-3 shadow-sm md:rounded-2xl md:px-5 md:py-5 ${className}`}>
      <img src={item.image} alt={item.name} className="mx-auto mb-2 h-10 w-10 rounded-full object-cover md:mb-4 md:h-16 md:w-16" />
      <div className="mb-2 flex justify-center gap-0.5 md:mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < Math.round(item.rating) ? "fill-orange text-orange" : "fill-muted text-muted"}`}
          />
        ))}
      </div>
      <p className="line-clamp-3 text-center text-xs text-muted-foreground md:line-clamp-4 md:text-sm">"{item.quote}"</p>
      <div className="mt-3 text-center md:mt-6">
        <div className="font-display text-sm text-brand md:text-base">{item.name}</div>
        {item.role ? <div className="text-xs text-muted-foreground">{item.role}</div> : null}
      </div>
    </article>
  );
}
