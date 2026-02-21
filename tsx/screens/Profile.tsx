import React from "react";
import type { Role, User } from "../state/types";
import { Button, H1 } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function Profile(props: {
  user: User;
  onSwitchRole: () => void;
  onReset: () => void;
}) {
  return (
    <div className={ui.container}>
      <H1>Профиль</H1>

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0 16px" }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            background: props.user.avatarDataUrl
              ? `url(${props.user.avatarDataUrl}) center/cover no-repeat`
              : "linear-gradient(135deg,#e5e7eb,#f9fafb)",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0,0,0,.03)",
          }}
        />
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>{props.user.name || "—"}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{props.user.city ? `Город: ${props.user.city}` : "—"}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{props.user.role ? `Роль: ${roleLabel(props.user.role)}` : "—"}</div>
        </div>
      </div>

      <Button variant="ghost" type="button" onClick={props.onSwitchRole}>
        Сменить роль
      </Button>
      <Button variant="ghost" type="button" onClick={props.onReset}>
        Сбросить прототип
      </Button>
    </div>
  );
}

function roleLabel(role: Role) {
  return role === "business" ? "Бизнесмен" : "Клиент";
}
