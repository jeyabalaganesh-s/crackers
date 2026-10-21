import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

const MIN_ORDER_AMOUNT = 2500;

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  const minimumOrderMet = cartTotal >= MIN_ORDER_AMOUNT;
  const amountRemaining = Math.max(0, MIN_ORDER_AMOUNT - cartTotal);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf2] px-5 py-12 text-[#251714]">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4a1018]"
        >
          <ArrowLeft size={17} /> Continue shopping
        </Link>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Your Cart
        </h1>
        <p className="mt-2 text-gray-600">
          Review your selected products before checkout.
        </p>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#eadfce] bg-white p-10 text-center">
            <ShoppingCart className="mx-auto text-[#a36d1c]" size={42} />
            <h2 className="mt-4 text-xl font-bold">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Explore the catalogue and add products to your cart.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-[#4a1018] px-5 py-3 font-bold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#eadfce] bg-white p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fff0d4]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ShoppingCart
                        className="text-[#a36d1c]"
                        size={30}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#a36d1c]">
                      {item.category}
                    </p>
                    <h2 className="mt-1 font-extrabold">
                      {item.name}
                    </h2>

                    {item.content && (
                      <p className="mt-1 text-xs text-gray-500">
                        Pack: {item.content}
                      </p>
                    )}

                    <p className="mt-2 font-bold text-[#4a1018]">
                      {money(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-3 rounded-xl border border-[#eadfce] p-1">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="rounded-lg p-2 hover:bg-[#fff0d4]"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-5 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="rounded-lg p-2 hover:bg-[#fff0d4]"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <p className="font-extrabold">
                      {money(item.price * item.quantity)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-700"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-[#eadfce] bg-white p-6">
              <h2 className="text-xl font-black">Order Summary</h2>

              <div className="mt-5 flex justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span>
                  {items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="mt-4 flex justify-between border-t border-[#eadfce] pt-4">
                <span className="font-bold">Subtotal</span>
                <span className="text-lg font-black text-[#4a1018]">
                  {money(cartTotal)}
                </span>
              </div>

              {/* Minimum order requirement */}
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  minimumOrderMet
                    ? "border-green-200 bg-green-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    minimumOrderMet
                      ? "text-green-800"
                      : "text-amber-900"
                  }`}
                >
                  {minimumOrderMet
                    ? "Minimum order requirement met"
                    : "Minimum order: ₹2,500"}
                </p>

                {minimumOrderMet ? (
                  <p className="mt-1 text-xs text-green-700">
                    You can proceed to checkout.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-amber-900">
                      Add{" "}
                      <span className="font-extrabold">
                        {money(amountRemaining)}
                      </span>{" "}
                      more to place your order.
                    </p>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-200">
                      <div
                        className="h-full rounded-full bg-[#a36d1c] transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (cartTotal / MIN_ORDER_AMOUNT) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                The minimum order value applies to all states and union
                territories. Delivery charges, if applicable, are
                separate from the product subtotal.
              </p>

              {minimumOrderMet ? (
                <Link
                  to="/checkout"
                  className="mt-6 block rounded-xl bg-[#4a1018] px-5 py-4 text-center font-bold text-white hover:bg-[#641722]"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 block w-full cursor-not-allowed rounded-xl bg-gray-300 px-5 py-4 text-center font-bold text-gray-600"
                >
                  Add More to Checkout
                </button>
              )}

              {!minimumOrderMet && (
                <Link
                  to="/products"
                  className="mt-3 block text-center text-sm font-bold text-[#4a1018] underline underline-offset-4"
                >
                  Continue Shopping
                </Link>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}