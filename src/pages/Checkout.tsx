import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  ShoppingCart,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "../context/CartContext";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  notes: string;
};

type OrderConfirmation = {
  orderNumber: string;
  subtotal: number;
  status: string;
};

type OrderPDFDetails = {
  orderNumber: string;
  subtotal: number;
  customer: CheckoutForm;
  items: {
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
    content?: string;
  }[];
};

function downloadOrderPDF(order: OrderPDFDetails) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;


  // Header
  pdf.setFillColor(74, 16, 24);
  pdf.rect(0, 0, pageWidth, 40, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(21);
  pdf.text("SHIVA FIRE WORKS", margin, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text("Customer Order Enquiry", margin, 28);

  // Order details
  pdf.setTextColor(37, 23, 20);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("Order Summary", margin, 51);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const orderDate = new Date().toLocaleDateString("en-IN");

  pdf.text(`Order Number: ${order.orderNumber}`, margin, 61);
  pdf.text(`Order Date: ${orderDate}`, margin, 68);

  // Customer details
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Customer Details", margin, 82);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let customerY = 91;

  const customerLines = [
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    ...(order.customer.email ? [`Email: ${order.customer.email}`] : []),
    `Address: ${order.customer.address}`,
    `State: ${order.customer.state}`,
    `City / Town: ${order.customer.city}`,
    `Pincode: ${order.customer.pincode}`,
  ];

  customerLines.forEach((line) => {
    const wrapped = pdf.splitTextToSize(line, pageWidth - margin * 2);
    pdf.text(wrapped, margin, customerY);
    customerY += wrapped.length * 5 + 1;
  });

  // Product table
  const tableStartY = customerY + 5;

  autoTable(pdf, {
    startY: tableStartY,
    margin: { left: margin, right: margin },
    head: [
      ["Product", "Category", "Qty", "Unit Price", "Line Total"],
    ],
    body: order.items.map((item) => [
      item.name,
      item.category || "-",
      String(item.quantity),
      money(item.price),
      money(item.price * item.quantity),
    ]),
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      textColor: [37, 23, 20],
    },
    headStyles: {
      fillColor: [74, 16, 24],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 33, halign: "right" },
      4: { cellWidth: 35, halign: "right" },
    },
  });

  const tableEndY =
    (pdf as jsPDF & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY ?? tableStartY;

  let summaryY = tableEndY + 12;

  // Keep subtotal and notes together when possible.
  if (summaryY + 35 > pageHeight - 15) {
    pdf.addPage();
    summaryY = 20;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Listed Subtotal:", margin, summaryY);

  pdf.setFontSize(13);
  pdf.text(
    money(order.subtotal),
    pageWidth - margin,
    summaryY,
    { align: "right" },
  );

  summaryY += 12;

  if (order.customer.notes.trim()) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Order Notes:", margin, summaryY);

    summaryY += 6;
    pdf.setFont("helvetica", "normal");

    const noteLines = pdf.splitTextToSize(
      order.customer.notes,
      pageWidth - margin * 2,
    );

    if (summaryY + noteLines.length * 5 > pageHeight - 20) {
      pdf.addPage();
      summaryY = 20;
    }

    pdf.text(noteLines, margin, summaryY);
    summaryY += noteLines.length * 5 + 8;
  }

  // Disclaimer
  const disclaimer =
    "This document is an order enquiry summary, not a tax invoice or payment receipt. " +
    "Product availability, final prices, delivery charges and order confirmation " +
    "must be verified by Shiva Fire Works. No online payment has been taken.";

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);

  const disclaimerLines = pdf.splitTextToSize(
    disclaimer,
    pageWidth - margin * 2,
  );

  if (summaryY + disclaimerLines.length * 4 > pageHeight - 12) {
    pdf.addPage();
    summaryY = 20;
  }

  pdf.text(disclaimerLines, margin, summaryY);

  // Automatically download the PDF.
  pdf.save(`Shiva-Fire-Works-${order.orderNumber}.pdf`);
}

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] =
    useState<OrderConfirmation | null>(null);
  const MIN_ORDER_AMOUNT = 3000;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Please add products before checkout.");
      return;
    }

    // Ensure each item has a valid MongoDB product ID.
    if (items.some((item) => !item.id || !item.id.trim())) {
      setError(
        "A product is missing its ID. Please return to the products page and add it again.",
      );
      return;
    }

    if (cartTotal < MIN_ORDER_AMOUNT) {
  alert(
    `Minimum order amount is ₹${MIN_ORDER_AMOUNT.toLocaleString("en-IN")}. ` +
    `Please add ₹${(MIN_ORDER_AMOUNT - cartTotal).toLocaleString("en-IN")} ` +
    `more to continue.`
  );
  return;
}

    // Keep a snapshot before the cart is cleared.
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category || "",
      price: item.price,
      quantity: item.quantity,
      content: item.content || "",
    }));

    const listedSubtotal = cartTotal;

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: orderItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (
        !response.ok ||
        !data?.success ||
        !data?.order?.orderNumber
      ) {
        throw new Error(
          data?.message || "Unable to submit your order. Please try again.",
        );
      }

      const savedOrder = data.order;

      // Generate the PDF from the saved order number and the cart snapshot.
      // The order is saved before the PDF is generated.
      downloadOrderPDF({
        orderNumber: savedOrder.orderNumber,
        subtotal:
          typeof savedOrder.subtotal === "number"
            ? savedOrder.subtotal
            : listedSubtotal,
        customer: { ...form },
        items: orderItems,
      });

      // Only clear the cart after the order has been saved.
      clearCart();

      setConfirmation({
        orderNumber: savedOrder.orderNumber,
        subtotal:
          typeof savedOrder.subtotal === "number"
            ? savedOrder.subtotal
            : listedSubtotal,
        status: savedOrder.status || "Pending confirmation",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <main className="min-h-screen bg-[#fffaf2] px-5 py-16 text-[#251714]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#eadfce] bg-white p-8 text-center sm:p-12">
          <CheckCircle2
            className="mx-auto text-green-600"
            size={58}
          />

          <h1 className="mt-5 text-3xl font-black">
            Order enquiry received!
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for choosing Shiva Fire Works. Your order summary PDF
            should download automatically. We will contact you to confirm
            availability and final order details.
          </p>

          <div className="mt-7 rounded-2xl bg-[#fffaf2] p-5 text-left">
            <p className="text-sm text-gray-500">Order number</p>

            <p className="mt-1 break-all text-xl font-black text-[#4a1018]">
              {confirmation.orderNumber}
            </p>

            <div className="mt-4 flex justify-between gap-4 text-sm">
              <span className="text-gray-600">Listed subtotal</span>
              <span className="font-bold">
                {money(confirmation.subtotal)}
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Status: {confirmation.status}. No online payment has been taken.
            </p>
          </div>

          <Link
            to="/products"
            className="mt-7 inline-flex rounded-xl bg-[#4a1018] px-6 py-3 font-bold text-white transition hover:bg-[#641722]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf2] px-5 py-16 text-center text-[#251714]">
        <ShoppingCart className="mx-auto text-[#a36d1c]" size={44} />

        <h1 className="mt-4 text-3xl font-black">
          Your cart is empty
        </h1>

        <p className="mt-2 text-gray-600">
          Add products before submitting your order.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex rounded-xl bg-[#4a1018] px-5 py-3 font-bold text-white"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] px-5 py-12 text-[#251714]">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4a1018]"
        >
          <ArrowLeft size={17} />
          Back to cart
        </Link>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-gray-600">
          Enter your details so Shiva Fire Works can contact you about your order.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[#eadfce] bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-black">Customer details</h2>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-bold"
              >
                Full name *
              </label>

              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold"
                >
                  Phone number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                  placeholder="Contact number"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold"
                >
                  Email (optional)
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={150}
                  className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-bold"
              >
                Address *
              </label>

              <textarea
                id="address"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={handleChange}
                required
                maxLength={500}
                rows={3}
                className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                placeholder="House number, street, area"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-bold"
                >
                  State *
                </label>

                <input
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                  placeholder="Your state"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-bold"
                >
                  City / Town *
                </label>

                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                  placeholder="Your city"
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm font-bold"
                >
                  Pincode *
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  autoComplete="postal-code"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  maxLength={12}
                  className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-bold"
              >
                Order notes (optional)
              </label>

              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                maxLength={1000}
                rows={3}
                className="w-full rounded-xl border border-[#eadfce] px-4 py-3 outline-none focus:border-[#4a1018]"
                placeholder="Preferred contact time or other details"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a1018] px-5 py-4 font-bold text-white hover:bg-[#641722] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <LoaderCircle className="animate-spin" size={18} />
              )}

              {submitting
                ? "Submitting order..."
                : "Submit Order Enquiry"}
            </button>

            <p className="text-xs leading-5 text-gray-500">
              Submitting this form saves your order enquiry. It does not
              process payment or guarantee stock. Your order summary PDF
              will be generated after a successful submission.
            </p>
          </form>

          <aside className="h-fit rounded-2xl border border-[#eadfce] bg-white p-6">
            <h2 className="text-xl font-black">Your order</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-bold">{item.name}</p>

                    <p className="mt-1 text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 font-bold">
                    {money(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-[#eadfce] pt-5">
              <span className="font-bold">Subtotal</span>

              <span className="text-lg font-black text-[#4a1018]">
                {money(cartTotal)}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Delivery charges or other applicable costs, if any, must be
              confirmed by Shiva Fire Works.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
