import { format } from "timeago.js";
export const timeAgo = (date) => format(date);
export const formatFull = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
