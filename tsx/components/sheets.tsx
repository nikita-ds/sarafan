import React, { useEffect, useState } from "react";
import type { RequestItem } from "../state/types";
import { Button, Field, Hint, Input } from "../ui/primitives";

export function CitySheet(props: { city: string; onSave: (city: string) => void }) {
  const [value, setValue] = useState(props.city);
  useEffect(() => setValue(props.city), [props.city]);

  return (
    <div>
      <Field label="Город">
        <Input value={value} placeholder="Лондон" onChange={(e) => setValue(e.target.value)} />
      </Field>
      <Button variant="primary" type="button" onClick={() => props.onSave(value)}>
        Сохранить
      </Button>
    </div>
  );
}

export function CreateRequestSheet(props: { presetQuery: string; onCreate: (q: string) => void }) {
  const [value, setValue] = useState(props.presetQuery);
  useEffect(() => setValue(props.presetQuery), [props.presetQuery]);

  return (
    <div>
      <Field label="Что нужно?">
        <Input
          value={value}
          placeholder="Например: ведущий на свадьбу"
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
      <Button variant="primary" type="button" onClick={() => props.onCreate(value)}>
        Создать запрос
      </Button>
    </div>
  );
}

export function OfferSheet(props: { request: RequestItem; onSend: () => void }) {
  const [msg, setMsg] = useState("");

  return (
    <div>
      <Hint>
        Запрос: <b>{props.request.query}</b>
      </Hint>

      <Field label="Сообщение">
        <Input value={msg} placeholder="Могу помочь. Свяжитесь со мной…" onChange={(e) => setMsg(e.target.value)} />
      </Field>

      <Button variant="primary" type="button" onClick={props.onSend}>
        Отправить
      </Button>
    </div>
  );
}
