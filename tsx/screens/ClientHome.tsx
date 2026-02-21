import React from "react";
import { Button, Card, Field, Input } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function ClientHome(props: {
  cityLabel: string;
  onCityClick: () => void;
  onSearchEnter: (query: string) => void;
  onPickCategory: (category: string) => void;
  onOpenRequests: () => void;
}) {
  return (
    <div className={ui.container}>
      <div className={ui.chipRow}>
        <button type="button" className={ui.chip} onClick={props.onCityClick}>
          {props.cityLabel}
        </button>
      </div>

      <Field label="">
        <Input
          placeholder="что ищете?"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            const value = (e.currentTarget.value || "").trim();
            if (!value) return;
            props.onSearchEnter(value);
          }}
        />
        <div className={ui.hint}>сделайте запрос в поисковой строке</div>
      </Field>

      <div style={{ fontWeight: 900, margin: "6px 0 10px" }}>Категории</div>

      <div className={ui.cardList}>
        <Card
          type="button"
          title="Организация праздников"
          meta="Ведущие, декор, кейтеринг"
          onClick={() => props.onPickCategory("Организация праздников")}
        />
        <Card
          type="button"
          title="Ремонт и строительство"
          meta="Мастера, монтаж, отделка"
          onClick={() => props.onPickCategory("Ремонт и строительство")}
        />
        <Card type="button" title="Красота" meta="Парикмахеры, визаж, массаж" onClick={() => props.onPickCategory("Красота")} />
      </div>

      <div className={ui.divider} />

      <Button variant="ghost" type="button" onClick={props.onOpenRequests}>
        Мои запросы
      </Button>
    </div>
  );
}
