export type Route =
  | "splash"
  | "role"
  | "reg"
  | "city"
  | "photo"
  | "client-home"
  | "category"
  | "business"
  | "requests"
  | "biz-home"
  | "profile";

export function normalizeRoute(hash: string | null | undefined): Route {
  const raw = String(hash || "")
    .replace(/^#/, "")
    .trim();

  const allowed = new Set<Route>([
    "splash",
    "role",
    "reg",
    "city",
    "photo",
    "client-home",
    "category",
    "business",
    "requests",
    "biz-home",
    "profile",
  ]);

  return (allowed.has(raw as Route) ? (raw as Route) : "splash");
}
