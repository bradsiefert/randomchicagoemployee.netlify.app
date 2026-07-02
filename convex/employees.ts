import { query } from "./_generated/server";
import { v } from "convex/values";

export const count = query({
  args: {},
  handler: async (ctx) => {
    const countDoc = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", "employeeCount"))
      .unique();
    return countDoc?.value ?? 0;
  },
});

export const random = query({
  args: { seed: v.number() },
  handler: async (ctx, { seed }) => {
    const countDoc = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", "employeeCount"))
      .unique();
    const total = countDoc?.value ?? 0;
    if (total === 0) return null;

    const rowIndex = Math.floor(seed * total) % total;
    return await ctx.db
      .query("randomchicagoemployee")
      .withIndex("by_rowIndex", (q) => q.eq("rowIndex", rowIndex))
      .unique();
  },
});
