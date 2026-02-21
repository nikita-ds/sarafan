import React from "react";
import s from "./ui.module.css";

export function H1(props: { children: React.ReactNode }) {
  return <h1 className={s.h1}>{props.children}</h1>;
}

export function Hint(props: { children: React.ReactNode }) {
  return <div className={s.hint}>{props.children}</div>;
}

export function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className={s.field}>
      <span className={s.label}>{props.label}</span>
      {props.children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={s.input + (props.className ? ` ${props.className}` : "")} />;
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" },
) {
  const v = props.variant || "ghost";
  const cls =
    s.btn +
    " " +
    (v === "primary" ? s.btnPrimary : s.btnGhost) +
    (props.className ? ` ${props.className}` : "");
  return <button {...props} className={cls} />;
}

export function Card(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { title: string; meta?: string }) {
  return (
    <button {...props} className={s.card + (props.className ? ` ${props.className}` : "")}>
      <div className={s.cardTitle}>{props.title}</div>
      {props.meta ? <div className={s.cardMeta}>{props.meta}</div> : null}
    </button>
  );
}
