import { api, type CatalogProduct, type CustomerCategory, type PageResponse } from "@/lib/api";

export function getCategoryDescendantIds(categories: CustomerCategory[], categoryId: number) {
  const ids = new Set<number>([categoryId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId !== null && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }

  return [...ids];
}

export function findCategoryByMatches(categories: CustomerCategory[], matches: string[]) {
  return categories.find((item) => {
    const name = item.name.toLowerCase();
    return matches.some((match) => name.includes(match));
  });
}

export async function productsByCategoryFamily({
  categories,
  categoryId,
  params,
  enrich = true,
}: {
  categories: CustomerCategory[];
  categoryId: number;
  params: Record<string, unknown>;
  enrich?: boolean;
}) {
  const categoryIds = getCategoryDescendantIds(categories, categoryId);
  const pages = await Promise.all(
    categoryIds.map((id) => api.productsByCategory(id, params)),
  );
  const productsById = new Map<number, CatalogProduct>();

  pages.forEach((page) => {
    page.content.forEach((product) => productsById.set(product.id, product));
  });

  let content = [...productsById.values()];

  if (enrich) {
    content = await Promise.all(
      content.map(async (product) => {
        try {
          return { ...product, ...(await api.product(product.id)) };
        } catch {
          return product;
        }
      }),
    );
  }

  const firstPage = pages[0];
  const totalElements = pages.reduce((total, page) => total + page.totalElements, 0);

  return {
    ...(firstPage || emptyPage(params)),
    content,
    totalElements,
    empty: content.length === 0,
  };
}

function emptyPage(params: Record<string, unknown>): PageResponse<CatalogProduct> {
  const size = Number(params.size) || 0;

  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size,
    number: 0,
    first: true,
    last: true,
    empty: true,
  };
}
