import React from "react";
import type { User } from "../state/types";
import { Button, Field, H1, Input } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function RegisterForm(props: {
  user: Pick<User, "name" | "phone" | "email" | "city">;
  onChange: (patch: Partial<User>) => void;
  onNext: () => void;
}) {
  return (
    <div className={ui.container}>
      <H1>Регистрация</H1>

      <Field label="ФИО">
        <Input value={props.user.name} placeholder="Иванов Иван" onChange={(e) => props.onChange({ name: e.target.value })} />
      </Field>

      <Field label="Телефон">
        <Input
          value={props.user.phone}
          placeholder="+44 000 000 000 00"
          inputMode="tel"
          onChange={(e) => props.onChange({ phone: e.target.value })}
        />
      </Field>

      <Field label="Email">
        <Input
          value={props.user.email}
          placeholder="Ivanov@gmail.com"
          inputMode="email"
          onChange={(e) => props.onChange({ email: e.target.value })}
        />
      </Field>

      <Field label="город проживания">
        <Input value={props.user.city} placeholder="Лондон" onChange={(e) => props.onChange({ city: e.target.value })} />
      </Field>

      <Button variant="primary" type="button" onClick={props.onNext}>
        Далее
      </Button>
    </div>
  );
}
