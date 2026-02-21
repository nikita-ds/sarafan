import React, { useMemo } from "react";
import type { RequestItem } from "../state/types";
import { H1 } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function BizHome(props: {
  cityLabel: string;
  onCityClick: () => void;
  items: RequestItem[];
  city: string;
  onOffer: (r: RequestItem) => void;
}) {
  const items = useMemo(() => {
    const filtered = props.city ? props.items.filter((r) => r.city === props.city) : props.items;
    return [...filtered].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [props.items, props.city]);

  return (
    <div className={ui.container}>
      <div className={ui.chipRow}>
        <button type="button" className={ui.chip} onClick={props.onCityClick}>
          {props.cityLabel}
        </button>
      </div>

      <H1>Запросы рядом</H1>

      <div className={ui.cardList}>
        {items.map((r) => (
          <div key={r.id} className={ui.card}>
            <div className={ui.cardTitle}>{r.query}</div>
            <div className={ui.cardMeta}>{`${r.city} · ${r.status}`}</div>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <button type="button" className={ui.btn + " " + ui.btnGhost} onClick={() => props.onOffer(r)}>
                Откликнуться
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <div className={ui.hint}>Нет запросов в выбранном городе.</div> : null}
      </div>
    </div>
  );
}
