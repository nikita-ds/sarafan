import React, { useMemo } from "react";
import type { Role } from "../state/types";
import { Button, Hint, H1 } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function RegisterRole(props: { role: Role | null; onSelect: (r: Role) => void; onNext: () => void }) {
  const disabled = useMemo(() => !props.role, [props.role]);

  return (
    <div className={ui.container}>
      <H1>Регистрация</H1>

      <div className={ui.cardList} role="radiogroup" aria-label="Роль">
        <button
          type="button"
          className={ui.card}
          aria-pressed={props.role === "business"}
          onClick={() => props.onSelect("business")}
        >
          <div className={ui.cardTitle}>я - бизнесмен</div>
        </button>
        <button
          type="button"
          className={ui.card}
          aria-pressed={props.role === "client"}
          onClick={() => props.onSelect("client")}
        >
          <div className={ui.cardTitle}>я - клиент</div>
        </button>
      </div>

      <Hint>Роль можно поменять позже в профиле.</Hint>

      <Button variant="primary" type="button" disabled={disabled} onClick={props.onNext}>
        Далее
      </Button>
    </div>
  );
}
