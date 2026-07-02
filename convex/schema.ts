import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  randomchicagoemployee: defineTable({
    NAME: v.string(),
    JOB_TITLES: v.optional(v.string()),
    DEPARTMENT: v.optional(v.string()),
    ANNUAL_SALARY: v.optional(v.union(v.number(), v.string())),
    HOURLY_RATE: v.optional(v.union(v.number(), v.string())),
    SALARY_OR_HOURLY: v.optional(v.string()),
    FULL_OR_PART_TIME: v.optional(v.string()),
    EMPLOYEE_TYPE: v.optional(v.string()),
    TYPICAL_HOURS: v.optional(v.union(v.number(), v.string())),
    rowIndex: v.optional(v.number()),
  }).index("by_rowIndex", ["rowIndex"]),

  metadata: defineTable({
    key: v.string(),
    value: v.number(),
  }).index("by_key", ["key"]),
});
