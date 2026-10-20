
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Flame,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";

type ApiProduct = {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  content?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  emoji?: string;
  popular?: boolean;
  stockStatus?: "available" | "sold_out";
  image?: string;
  isActive?: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  emoji: string;
  popular: boolean;
  stockStatus: "available" | "sold_out";
  image: string;
};

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

const PRODUCTS_PER_PAGE = 12;

const CATEGORY_OPTIONS = [
  { label: "All Products", aliases: [] },
  { label: "Sparklers", aliases: ["sparkler", "sparklers"] },
  {
    label: "Flower Pots",
    aliases: ["flower pot", "flower pots", "flowerpot", "flowerpots"],
  },
  { label: "Rockets", aliases: ["rocket", "rockets"] },
  {
    label: "Ground Chakkars",
    aliases: ["ground chakkar", "ground chakkars", "chakkar", "chakkars"],
  },
  { label: "Fountains", aliases: ["fountain", "fountains"] },
  { label: "Gift Boxes", aliases: ["gift box", "gift boxes", "gift pack"] },
  {
    label: "Sound Crackers",
    aliases: ["sound cracker", "sound crackers"],
  },
  { label: "Bombs", aliases: ["bomb", "bombs"] },
  { label: "Repeating Shots", aliases: ["repeating shot", "shots"] },
  { label: "Fancy Items", aliases: ["fancy", "fancy items"] },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getCategoryLabel(category: string) {
  const normalized = normalizeText(category);

  const match = CATEGORY_OPTIONS.find(
    (option) =>
      option.aliases.some(
        (alias) => normalizeText(alias) === normalized
      ) || normalizeText(option.label) === normalized
  );

  return match?.label ?? category;
}

function getCategoryEmoji(category: string) {
  const normalized = normalizeText(category);

  if (normalized.includes("sparkler")) return "✨";
  if (normalized.includes("flower pot")) return "🎆";
  if (normalized.includes("rocket")) return "🚀";
  if (normalized.includes("chakkar")) return "🌀";
  if (normalized.includes("fountain")) return "🌋";
  if (normalized.includes("gift")) return "🎁";
  if (normalized.includes("bomb")) return "💥";
  if (normalized.includes("sound cracker")) return "🎇";

  return "🎉";
}

function toProduct(item: ApiProduct): Product {
  return {
    id: item._id ?? "",
    name: item.name,
    category: getCategoryLabel(item.category),
    description:
      item.description?.trim() ||
      (item.content
        ? `Pack size: ${item.content}`
        : "Contact us for product details."),
    content: item.content || "",
    price: Number(item.price) || 0,
    originalPrice: item.originalPrice,
    badge: item.badge,
    emoji: item.emoji || getCategoryEmoji(item.category),
    popular:
      Boolean(item.popular) ||
      item.badge?.toLowerCase() === "popular",
    stockStatus:
      item.stockStatus === "sold_out" ? "sold_out" : "available",
    image: item.image || "",
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function Products() {
  const { addToCart, items: cartItems, cartCount } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load products from the backend.
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Could not load products (HTTP ${response.status}).`
          );
        }

        const data: unknown = await response.json();

        let apiItems: ApiProduct[] = [];

        if (Array.isArray(data)) {
          apiItems = data as ApiProduct[];
        } else if (
          data !== null &&
          typeof data === "object" &&
          "products" in data &&
          Array.isArray(data.products)
        ) {
          apiItems = data.products as ApiProduct[];
        }

        const validProducts = apiItems
          .filter(
            (item) =>
              item &&
              typeof item._id === "string" &&
              item._id.length > 0 &&
              typeof item.name === "string" &&
              typeof item.category === "string"
          )
          .filter((item) => item.isActive !== false)
          .map(toProduct);

        setProducts(validProducts);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading products."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  // Build category filters from the products in the database.
  const categories = useMemo(() => {
    const databaseCategories = [
      ...new Set(products.map((product) => product.category)),
    ].sort((a, b) => a.localeCompare(b));

    const preferred = CATEGORY_OPTIONS.slice(1)
      .map((option) => option.label)
      .filter((label) => databaseCategories.includes(label));

    const extra = databaseCategories.filter(
      (label) => !preferred.includes(label)
    );

    return ["All Products", ...preferred, ...extra];
  }, [products]);

  // Search, filter, and sort before applying pagination.
  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.content.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (sortBy === "popular") {
      result = [...result].sort(
        (a, b) => Number(b.popular) - Number(a.popular)
      );
    } else if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, searchTerm, sortBy]);

  // Pagination calculations.
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  // Reset to page 1 whenever the search, category, or sorting changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm, sortBy]);

  // Keep the current page valid if the number of results changes.
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(nextPage);
    setNotice("");

    document
      .getElementById("product-catalogue")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addProductToCart(product: Product) {
    if (product.stockStatus === "sold_out" || !product.id) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      content: product.content,
    });

    setNotice(`${product.name} added to your cart.`);
  }
function getProductImageUrl(image?: string) {
  if (!image) {
    return "";
  }

  // Already a complete URL
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Remove accidental leading slash
  const cleanImage = image.replace(/^\/+/, "");

  return `${API_BASE_URL}/product-images/${encodeURIComponent(cleanImage)}`;
}
  function isInCart(productId: string) {
    return cartItems.some((item) => item.id === productId);
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] text-[#251714]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#4a1018] px-5 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full border-[45px] border-[#f8c54d]/10" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#f8c54d]">
            <Flame size={17} />
            SHIVA FIRE WORKS · SIVAKASI
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Find the perfect
            <span className="block text-[#f8c54d]">
              festive sparkle.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Explore our fireworks catalogue, add your favourites to
            your cart, and submit an order enquiry to our team.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <Sparkles className="mr-2 inline" size={16} />
              Festive collections
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <Tag className="mr-2 inline" size={16} />
              Catalogue prices
            </span>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-[#f8c54d] px-4 py-2 text-[#35100d] transition hover:bg-[#edb62d]"
            >
              <ShoppingCart size={16} />
              View Cart ({cartCount})
            </Link>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section
        id="product-catalogue"
        className="mx-auto max-w-7xl px-5 py-12 sm:py-16"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a36d1c]">
              Our collection
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Explore Products
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} products found`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="flex items-center gap-3 rounded-xl border border-[#eadfce] bg-white px-4 py-3 sm:w-72">
              <Search className="shrink-0 text-gray-400" size={19} />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Search products"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 rounded-xl border border-[#eadfce] bg-white px-4 py-3">
              <SlidersHorizontal size={18} className="text-gray-500" />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="bg-transparent text-sm font-semibold outline-none"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="popular">Popular first</option>
                <option value="name">Name: A–Z</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <p className="font-bold">Unable to load products</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2">
              Check that your backend is running and GET /api/products
              is available.
            </p>
          </div>
        )}

        {/* Add-to-cart confirmation */}
        {notice && (
          <div
            role="status"
            className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <span className="flex items-center gap-2">
              <Check size={18} />
              {notice}
            </span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Category filters */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setNotice("");
              }}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${
                activeCategory === category
                  ? "bg-[#4a1018] text-white shadow-md"
                  : "border border-[#eadfce] bg-white text-gray-700 hover:border-[#4a1018] hover:text-[#4a1018]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-[#eee3d4] bg-white"
              >
                <div className="h-52 bg-[#f2e7d8]" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 rounded bg-[#eee3d4]" />
                  <div className="h-5 w-3/4 rounded bg-[#eee3d4]" />
                  <div className="h-4 w-full rounded bg-[#eee3d4]" />
                  <div className="h-10 rounded bg-[#eee3d4]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Product grid: render only the current page */}
            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => {
                const soldOut = product.stockStatus === "sold_out";
                const added = isInCart(product.id);

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-[#eee3d4] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Product image */}
<div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-[#fff0d4] via-[#fff8ee] to-[#f5dfd0]">
  {product.image ? (
    <img
      src={getProductImageUrl(product.image)}
      alt={product.name}
      loading="lazy"
      className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
      onError={(event) => {
        event.currentTarget.style.display = "none";

        const fallback = event.currentTarget
          .parentElement
          ?.querySelector(".product-image-fallback");

        if (fallback instanceof HTMLElement) {
          fallback.classList.remove("hidden");
        }
      }}
    />
  ) : null}

  {/* Fallback when image is missing or fails */}
  <span
    className={`product-image-fallback select-none text-7xl transition duration-300 group-hover:scale-110 ${
      product.image ? "hidden" : ""
    }`}
    role="img"
    aria-label={product.category}
  >
    {product.emoji}
  </span>

  {product.badge && !soldOut && (
    <span className="absolute left-4 top-4 rounded-full bg-[#4a1018] px-3 py-1.5 text-xs font-bold text-white">
      {product.badge}
    </span>
  )}

  {soldOut && (
    <span className="absolute left-4 top-4 rounded-full bg-gray-800 px-3 py-1.5 text-xs font-bold text-white">
      Sold Out
    </span>
  )}

  <div className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#4a1018]">
    <Sparkles size={18} />
  </div>
</div>
    
    
                    {/* Product details */}
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a36d1c]">
                        {product.category}
                      </p>

                      <h3 className="mt-2 text-lg font-extrabold">
                        {product.name}
                      </h3>

                      {product.content && (
                        <p className="mt-1 text-xs font-medium text-gray-500">
                          Pack size: {product.content}
                        </p>
                      )}

                      <p className="mt-2 min-h-10 text-sm leading-5 text-gray-600">
                        {product.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#f0e7dc] pt-4">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">
                            {soldOut ? "Availability" : "Listed price"}
                          </p>

                          {soldOut ? (
                            <p className="mt-1 text-sm font-extrabold text-red-700">
                              Sold Out
                            </p>
                          ) : (
                            <p className="mt-1 text-sm font-extrabold text-[#4a1018]">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => addProductToCart(product)}
                          disabled={soldOut || !product.id}
                          className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 ${
                            added
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-[#f8c54d] text-[#35100d] hover:bg-[#edb62d]"
                          }`}
                        >
                          {soldOut ? (
                            "Unavailable"
                          ) : added ? (
                            <>
                              <Check size={16} />
                              Add More
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <nav
                aria-label="Product pagination"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#eadfce] bg-white px-4 py-2 text-sm font-bold text-[#4a1018] transition hover:bg-[#f8e8cb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-[#4a1018] text-white"
                        : "border border-[#eadfce] bg-white text-[#4a1018] hover:bg-[#f8e8cb]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[#eadfce] bg-white px-4 py-2 text-sm font-bold text-[#4a1018] transition hover:bg-[#f8e8cb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}

            {/* Current page summary */}
            <p className="mt-3 text-center text-sm text-gray-500">
              Showing{" "}
              {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
              {Math.min(
                currentPage * PRODUCTS_PER_PAGE,
                filteredProducts.length
              )}{" "}
              of {filteredProducts.length} products
            </p>
          </>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#d8c5ac] bg-white p-12 text-center">
            <Search className="mx-auto text-gray-400" size={35} />

            <h3 className="mt-4 text-xl font-bold">
              {error ? "Products could not be loaded" : "No products found"}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {error
                ? "Check your backend connection and reload the page."
                : "Try another search term or choose a different category."}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Products");
                setSortBy("featured");
                setCurrentPage(1);
                setNotice("");
              }}
              className="mt-5 rounded-xl bg-[#4a1018] px-5 py-3 text-sm font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Cart summary bar */}
        {cartCount > 0 && (
          <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl bg-[#2d0c10] p-4 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="font-extrabold">
                {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
              </p>

              <p className="mt-1 text-xs text-white/70">
                Your selected products are saved in your cart.
              </p>
            </div>

            <Link
              to="/cart"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#f8c54d] px-5 py-3 text-sm font-extrabold text-[#35100d] transition hover:bg-[#edb62d]"
            >
              View Cart <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>

      {/* Enquiry CTA */}
      <section className="px-5 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl bg-[#f8e8cb] p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#946018]">
              Need help choosing?
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Planning a festive celebration?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-700">
              Contact our team to discuss available products, pricing,
              and order details before placing your enquiry.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4a1018] px-6 py-4 font-bold text-white transition hover:bg-[#641722]"
          >
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
