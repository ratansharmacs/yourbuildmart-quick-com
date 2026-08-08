import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/components/site/data";

const PRODUCTS_PER_SLIDE = 5;
const MAX_SLIDES = 3;

export function ProductRowCarousel({ products }: { products: Product[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = Array.from(
    { length: Math.min(MAX_SLIDES, Math.ceil(products.length / PRODUCTS_PER_SLIDE)) },
    (_, index) => products.slice(index * PRODUCTS_PER_SLIDE, (index + 1) * PRODUCTS_PER_SLIDE),
  );

  useEffect(() => {
    setActiveSlide(0);
    viewportRef.current?.scrollTo({ left: 0 });
  }, [products]);

  function handleScroll() {
    const viewport = viewportRef.current;
    if (!viewport || slides.length < 2) return;
    const slideWidth = viewport.scrollWidth / slides.length;
    setActiveSlide(Math.min(slides.length - 1, Math.round(viewport.scrollLeft / slideWidth)));
  }

  function goToSlide(index: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ left: (viewport.scrollWidth / slides.length) * index, behavior: "smooth" });
    setActiveSlide(index);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard product={product} variant="home" />
          </div>
        ))}
      </div>
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className="hidden snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex"
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className="grid min-w-full snap-start grid-cols-2 gap-3 sm:gap-4 md:flex md:justify-center"
          >
            {slide.map((product) => (
              <div key={product.id} className="min-w-0 md:w-[calc(20%-0.8rem)] md:max-w-[calc(20%-0.8rem)] md:shrink-0">
                <ProductCard product={product} variant="home" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 hidden justify-center gap-2 md:flex" aria-label="Product carousel pages">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show products ${index * PRODUCTS_PER_SLIDE + 1} to ${(index + 1) * PRODUCTS_PER_SLIDE}`}
              aria-current={activeSlide === index ? "true" : undefined}
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${activeSlide === index ? "bg-brand" : "bg-brand/25"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
