import React from "react";
import type { User } from "../state/types";
import { Button, H1 } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function RegisterPhoto(props: {
  avatarDataUrl: User["avatarDataUrl"];
  onAvatarChange: (dataUrl: string) => void;
  onSave: () => void;
}) {
  return (
    <div className={ui.container}>
      <H1>Регистрация</H1>

      <div style={{ display: "grid", gap: 10, justifyItems: "center", padding: "6px 0 10px" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            background: props.avatarDataUrl ? `url(${props.avatarDataUrl}) center/cover no-repeat` : "linear-gradient(135deg,#e5e7eb,#f9fafb)",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0,0,0,.03)",
          }}
          aria-label="Фото профиля"
        />

        <label className={ui.btn + " " + ui.btnGhost} style={{ maxWidth: 430 }}>
          загрузить фото
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const f = e.currentTarget.files && e.currentTarget.files[0];
              if (!f) return;
              const dataUrl = await fileToDataUrl(f);
              props.onAvatarChange(dataUrl);
            }}
          />
        </label>
      </div>

      <Button variant="primary" type="button" onClick={props.onSave}>
        Сохранить
      </Button>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}
