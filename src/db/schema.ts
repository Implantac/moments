import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(), // feminino | masculino
  family: text("family").notNull(), // família olfativa
  description: text("description").notNull(),
  notesTop: text("notes_top").notNull(),
  notesHeart: text("notes_heart").notNull(),
  notesBase: text("notes_base").notNull(),
  sizeMl: integer("size_ml").notNull().default(100),
  concentration: text("concentration").notNull().default("Eau de Parfum"),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  stock: integer("stock").notNull().default(15),
  image: text("image").notNull(),
  badge: text("badge"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  city: text("city"),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type OrderItem = {
  slug: string;
  name: string;
  brand: string;
  sizeMl: number;
  priceCents: number;
  image: string;
  qty: number;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  cep: text("cep").notNull(),
  address: text("address").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  paymentMethod: text("payment_method").notNull(), // pix | card | whatsapp
  status: text("status").notNull().default("aguardando_pagamento"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;

/**
 * Lista de novidades. Separada das tabelas de catálogo para deixar claro
 * que este dado tem finalidade própria (marketing) e consentimento registrado.
 */
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("site"),
  /** Consentimento explícito (LGPD art. 8º). */
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull().defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Subscriber = typeof subscribers.$inferSelect;
