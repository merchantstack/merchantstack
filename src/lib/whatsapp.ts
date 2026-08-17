import { formatPrice } from "./format";

export type WhatsAppOrder = {
  orderNumber: string;
  brandName: string;
  currencySymbol: string;
  customer: { name: string; phone: string; email: string; notes: string };
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
};

export function buildOrderMessage(order: WhatsAppOrder) {
  const lines: string[] = [];
  lines.push(`*New order — ${order.brandName}*`);
  lines.push(`Order ref: ${order.orderNumber}`);
  lines.push("");
  lines.push("*Items*");
  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} — ${item.quantity} x ${formatPrice(item.price, order.currencySymbol)} = ${formatPrice(item.price * item.quantity, order.currencySymbol)}`,
    );
  });
  lines.push("");
  lines.push(`*Order total:* ${formatPrice(order.subtotal, order.currencySymbol)}`);
  lines.push("");
  lines.push("*Customer*");
  lines.push(`Name: ${order.customer.name}`);
  lines.push(`Phone: ${order.customer.phone}`);
  if (order.customer.email) lines.push(`Email: ${order.customer.email}`);
  if (order.customer.notes) lines.push(`Notes: ${order.customer.notes}`);
  lines.push("");
  lines.push("Please confirm availability, licensing and delivery timeline.");
  return lines.join("\n");
}

export function buildProductEnquiry(params: {
  brandName: string;
  productName: string;
  price: number;
  currencySymbol: string;
  url: string;
}) {
  return [
    `*Product enquiry — ${params.brandName}*`,
    `Product: ${params.productName}`,
    `Listed price: ${formatPrice(params.price, params.currencySymbol)}`,
    `Link: ${params.url}`,
    "",
    "Hi, I'd like to know more about this product and how to purchase it.",
  ].join("\n");
}

export function whatsappLink(number: string, message: string) {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
