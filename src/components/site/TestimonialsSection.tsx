import { useRef, useState } from "react";
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
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
  const pages = Array.from({ length: Math.ceil(items.length / 4) }, (_, index) => items.slice(index * 4, (index + 1) * 4));

  function handleScroll() {
    const viewport = viewportRef.current;
    if (!viewport || pages.length < 2) return;
    setActivePage(Math.min(pages.length - 1, Math.round(viewport.scrollLeft / (viewport.scrollWidth / pages.length))));
  }

  function goToPage(index: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ left: (viewport.scrollWidth / pages.length) * index, behavior: "smooth" });
    setActivePage(index);
  }

  return (
    <section className="container-page pb-2 pt-4 md:py-8">
      <SectionHeader title="What Our Client Say About Us" subtitle="Real feedback from our valued customers" />

      <div className="relative">
        <div ref={viewportRef} onScroll={handleScroll} className="flex snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="grid min-w-[1164px] snap-start grid-cols-4 gap-4 md:flex md:min-w-full md:justify-center">
              {page.map((item) => <TestimonialCard key={item.id} item={item} className="md:w-[calc(25%-0.75rem)] md:shrink-0" />)}
            </div>
          ))}
        </div>

        {pages.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => goToPage(Math.max(0, activePage - 1))}
              disabled={activePage === 0}
              className="absolute left-0 top-1/2 z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-md transition disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => goToPage(Math.min(pages.length - 1, activePage + 1))}
              disabled={activePage === pages.length - 1}
              className="absolute right-0 top-1/2 z-10 grid h-10 w-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-md transition disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {pages.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2" aria-label="Testimonial carousel pages">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show testimonial page ${index + 1}`}
              aria-current={activePage === index ? "true" : undefined}
              onClick={() => goToPage(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${activePage === index ? "bg-brand" : "bg-brand/25"}`}
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
