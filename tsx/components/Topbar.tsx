import React from "react";
import s from "./Topbar.module.css";

export function Topbar(props: { title: string; showBack?: boolean; onBack?: () => void }) {
  const showBack = Boolean(props.showBack);
  return (
    <header className={s.topbar}>
      <button
        type="button"
        aria-label="Назад"
        className={s.iconBtn + " " + (showBack ? "" : s.invisible)}
        onClick={props.onBack}
      >
        <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14.5 5.5L8 12l6.5 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={s.title}>{props.title}</div>
      <button type="button" aria-label="Меню" className={s.iconBtn + " " + s.invisible}>
        <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 7h14M5 12h14M5 17h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}
