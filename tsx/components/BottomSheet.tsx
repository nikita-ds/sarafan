import React, { useEffect } from "react";
import s from "./BottomSheet.module.css";

export function BottomSheet(props: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props]);

  return (
    <div className={s.root} role="dialog" aria-modal="true">
      <div className={s.backdrop} onClick={props.onClose} />
      <div className={s.panel}>
        <div className={s.handle} />
        <div className={s.title}>{props.title}</div>
        <div className={s.body}>{props.children}</div>
      </div>
    </div>
  );
}
