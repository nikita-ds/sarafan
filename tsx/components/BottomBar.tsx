import React, { useMemo } from "react";
import type { Role } from "../state/types";
import type { Route } from "../router/routes";
import s from "./BottomBar.module.css";

type Tab = { route: Route; label: string; icon: React.ReactNode };

export function BottomBar(props: { role: Role; route: Route; onNavigate: (r: Route) => void }) {
  const tabs = useMemo<Tab[]>(() => {
    if (props.role === "business") {
      return [
        {
          route: "biz-home",
          label: "Лента",
          icon: (
            <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 11.5a2 2 0 100-4 2 2 0 000 4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ),
        },
        {
          route: "profile",
          label: "Профиль",
          icon: (
            <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21a8 8 0 10-16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          ),
        },
      ];
    }

    return [
      {
        route: "client-home",
        label: "Поиск",
        icon: (
          <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M10 18a8 8 0 115.3-14 8 8 0 01-5.3 14zm8.7 2.3l-4.2-4.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        route: "requests",
        label: "Запросы",
        icon: (
          <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 7h10M7 12h10M7 17h7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        route: "profile",
        label: "Профиль",
        icon: (
          <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 21a8 8 0 10-16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        ),
      },
    ];
  }, [props.role]);

  const colsClass = props.role === "business" ? s.cols2 : s.cols3;

  const normalized: Route = props.route === "category" || props.route === "business" ? "client-home" : props.route;

  return (
    <nav className={s.bar + " " + colsClass} aria-label="Навигация">
      {tabs.map((t) => (
        <button
          key={t.route}
          type="button"
          className={s.tab + (normalized === t.route ? " " + s.active : "")}
          onClick={() => props.onNavigate(t.route)}
        >
          {t.icon}
          <span className={s.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
