import React, { useMemo } from "react";
import type { AppState, BusinessItem } from "../state/types";
import { Button } from "../ui/primitives";
import ui from "../ui/ui.module.css";

export function Business(props: {
  state: AppState;
  onCreateRequest: () => void;
}) {
  const biz = useMemo(() => selectBusiness(props.state), [props.state]);
  if (!biz) return <div className={ui.container}>—</div>;

  return (
    <div className={ui.container}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0 14px" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "linear-gradient(135deg,#e5e7eb,#f9fafb)",
            border: "1px solid #e5e7eb",
          }}
        />
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{biz.name}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{`${biz.rating.toFixed(1)} · ${biz.reviews} reviews`}</div>
        </div>
      </div>

      <div className={ui.cardList}>
        <div className={ui.card}>
          <div className={ui.cardTitle}>Address</div>
          <div className={ui.cardMeta}>{biz.address}</div>
        </div>

        <button type="button" className={ui.card} onClick={() => window.alert("Прототип: Get Directions")}> 
          <div className={ui.cardTitle}>Get Directions</div>
        </button>
        <button type="button" className={ui.card} onClick={() => window.alert("Прототип: Explore benefits")}> 
          <div className={ui.cardTitle}>Explore benefits</div>
        </button>
        <button type="button" className={ui.card} onClick={() => window.alert("Прототип: write a review")}> 
          <div className={ui.cardTitle}>write a review</div>
        </button>
      </div>

      <div className={ui.divider} />

      <Button variant="primary" type="button" onClick={props.onCreateRequest}>
        Сделать запрос
      </Button>
    </div>
  );
}

function selectBusiness(state: AppState): BusinessItem | null {
  const id = state.ui.activeBusinessId;
  if (id) {
    const found = state.businesses.find((b) => b.id === id);
    if (found) return found;
  }
  return state.businesses[0] || null;
}
