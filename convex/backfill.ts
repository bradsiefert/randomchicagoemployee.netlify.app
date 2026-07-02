import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const BATCH_SIZE = 50;

export const seedMetadata = internalMutation({
  args: { count: v.number() },
  handler: async (ctx, { count }) => {
    const existing = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", "employeeCount"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: count });
      return;
    }

    await ctx.db.insert("metadata", { key: "employeeCount", value: count });
  },
});

export const addRowIndex = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    startIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startIndex = args.startIndex ?? 0;

    const result = await ctx.db
      .query("randomchicagoemployee")
      .paginate({ numItems: BATCH_SIZE, cursor: args.cursor ?? null });

    let index = startIndex;
    for (const doc of result.page) {
      await ctx.db.patch(doc._id, { rowIndex: index });
      index++;
    }

    if (!result.isDone) {
      await ctx.scheduler.runAfter(0, internal.backfill.addRowIndex, {
        cursor: result.continueCursor,
        startIndex: index,
      });
      return { status: "continuing" as const, processed: index };
    }

    const existing = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", "employeeCount"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: index });
    } else {
      await ctx.db.insert("metadata", { key: "employeeCount", value: index });
    }

    return { status: "complete" as const, count: index };
  },
});
