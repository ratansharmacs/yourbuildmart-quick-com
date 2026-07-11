import { createFileRoute } from "@tanstack/react-router";
import { CategoryProductsPage } from "@/components/site/CategoryProductsPage";

export const Route = createFileRoute("/category/$categoryId")({
  component: CategoryRoute,
});

function CategoryRoute() {
  const { categoryId } = Route.useParams();
  return <CategoryProductsPage categorySlug={categoryId} pageKind="category" />;
}
