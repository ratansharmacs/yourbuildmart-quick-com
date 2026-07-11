import { createFileRoute } from "@tanstack/react-router";
import { CategoryProductsPage } from "@/components/site/CategoryProductsPage";

export const Route = createFileRoute("/subcategory/$subcategoryId")({
  component: SubcategoryRoute,
});

function SubcategoryRoute() {
  const { subcategoryId } = Route.useParams();
  return <CategoryProductsPage categorySlug={subcategoryId} pageKind="subcategory" />;
}
