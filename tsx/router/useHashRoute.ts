import { useEffect, useMemo, useState } from "react";
import { normalizeRoute, type Route } from "./routes";

export function useHashRoute() {
  const [route, setRouteState] = useState<Route>(() => normalizeRoute(window.location.hash));

  useEffect(() => {
    const onChange = () => setRouteState(normalizeRoute(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const api = useMemo(
    () => ({
      route,
      setRoute: (next: Route) => {
        window.location.hash = `#${next}`;
      },
    }),
    [route],
  );

  return api;
}
