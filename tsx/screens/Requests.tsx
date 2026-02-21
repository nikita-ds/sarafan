import React, { useMemo } from "react";
import type { RequestItem } from "../state/types";
import { Button, H1 } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function Requests(props: { items: RequestItem[]; onBackToSearch: () => void }) {
  const items = useMemo(() => {
    return [...props.items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [props.items]);

  return (
    <div className={ui.container}>
      <H1>Мои запросы</H1>

      <div className={ui.cardList}>
        {items.map((r) => (
          <div key={r.id} className={ui.card}>
            <div className={ui.cardTitle}>{r.query}</div>
            <div className={ui.cardMeta}>{`${r.city} · ${r.status}`}</div>
          </div>
        ))}
        {!items.length ? <div className={ui.hint}>Пока нет запросов.</div> : null}
      </div>

      <Button variant="ghost" type="button" onClick={props.onBackToSearch}>
        К поиску
      </Button>
    </div>
  );
}
