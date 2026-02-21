import React, { useMemo } from "react";
import type { AppState, BusinessItem } from "../state/types";
import { Card, H1 } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function Category(props: {
  state: AppState;
  onSort: (sort: "last" | "rating") => void;
  onOpenBusiness: (id: string) => void;
}) {
  const items = useMemo(() => selectBusinesses(props.state), [props.state]);

  return (
    <div className={ui.container}>
      <H1>{props.state.ui.activeCategory}</H1>

      <div className={ui.chipRow} role="tablist" aria-label="Сортировка">
        <button
          type="button"
          role="tab"
          aria-selected={props.state.ui.businessSort === "last"}
          className={ui.chip + (props.state.ui.businessSort === "last" ? " " + ui.chipActive : "")}
          onClick={() => props.onSort("last")}
        >
          Last added
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={props.state.ui.businessSort === "rating"}
          className={ui.chip + (props.state.ui.businessSort === "rating" ? " " + ui.chipActive : "")}
          onClick={() => props.onSort("rating")}
        >
          High rating
        </button>
      </div>

      <div className={ui.cardList}>
        {items.map((b) => (
          <Card
            key={b.id}
            type="button"
            title={b.name}
            meta={`${b.rating.toFixed(1)} · ${b.reviews} reviews · ${b.address}`}
            onClick={() => props.onOpenBusiness(b.id)}
          />
        ))}

        {!items.length ? <div className={ui.hint}>Пока нет предложений в выбранном городе.</div> : null}
      </div>
    </div>
  );
}

function selectBusinesses(state: AppState): BusinessItem[] {
  const city = state.user.city;
  let items = state.businesses.filter((b) => b.category === state.ui.activeCategory);
  if (city) items = items.filter((b) => b.city === city);

  if (state.ui.businessSort === "rating") {
    items = [...items].sort((a, b) => b.rating - a.rating);
  } else {
    items = [...items].sort((a, b) => +new Date(b.lastAddedAt) - +new Date(a.lastAddedAt));
  }
  return items;
}
