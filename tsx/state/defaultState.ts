import type { AppState } from "./types";

function nowIso() {
  return new Date().toISOString();
}

export function defaultState(): AppState {
  return {
    user: {
      role: null,
      name: "",
      phone: "",
      email: "",
      city: "",
      avatarDataUrl: "",
    },
    ui: {
      activeCategory: "Организация праздников",
      businessSort: "last",
      activeBusinessId: null,
    },
    requests: [
      {
        id: "rq_seed_1",
        query: "Ведущий на свадьбу",
        city: "Лондон",
        status: "Новый",
        createdAt: nowIso(),
      },
    ],
    businesses: [
      {
        id: "biz_1",
        category: "Организация праздников",
        name: "Text",
        rating: 4.8,
        reviews: 120,
        city: "Лондон",
        address: "31 Rose Way",
        lastAddedAt: "2026-02-18T12:00:00.000Z",
      },
      {
        id: "biz_2",
        category: "Организация праздников",
        name: "Event Studio",
        rating: 4.9,
        reviews: 56,
        city: "Лондон",
        address: "12 King Street",
        lastAddedAt: "2026-02-20T09:30:00.000Z",
      },
      {
        id: "biz_3",
        category: "Организация праздников",
        name: "Decor & More",
        rating: 4.6,
        reviews: 210,
        city: "Лондон",
        address: "8 Market Lane",
        lastAddedAt: "2026-02-10T16:15:00.000Z",
      },
    ],
  };
}
