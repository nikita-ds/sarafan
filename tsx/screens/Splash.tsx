import React from "react";
import { Button } from "../ui/primitives";
import s from "./Splash.module.css";

export function Splash(props: { onStart: () => void }) {
  return (
    <div className={s.wrap}>
      <div className={s.mark}>SARAFAN</div>
      <div className={s.sub}>FROM HAND TO HAND</div>
      <div className={s.btn}>
        <Button variant="primary" type="button" onClick={props.onStart}>
          Начать
        </Button>
      </div>
    </div>
  );
}
