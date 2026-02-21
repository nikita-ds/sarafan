import React from "react";
import type { User } from "../state/types";
import { Button, Field, H1, Input } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function City(props: {
  city: User["city"];
  onChange: (city: string) => void;
  onNext: () => void;
}) {
  return (
    <div className={ui.container}>
      <H1>Регистрация</H1>

      <Field label="город проживания">
        <Input list="cities" value={props.city} placeholder="Лондон" onChange={(e) => props.onChange(e.target.value)} />
        <datalist id="cities">
          <option value="Москва" />
          <option value="Санкт‑Петербург" />
          <option value="Казань" />
          <option value="Екатеринбург" />
          <option value="Новосибирск" />
          <option value="Лондон" />
        </datalist>
      </Field>

      <Button variant="primary" type="button" onClick={props.onNext}>
        Далее
      </Button>
    </div>
  );
}
