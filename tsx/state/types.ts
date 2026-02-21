export type Role = "client" | "business";

export type User = {
  role: Role | null;
  name: string;
  phone: string;
  email: string;
  city: string;
  avatarDataUrl: string;
};

export type RequestItem = {
  id: string;
  query: string;
  city: string;
  status: "Новый" | "В работе" | "Закрыт";
  createdAt: string;
};

export type BusinessItem = {
  id: string;
  category: string;
  name: string;
  rating: number;
  reviews: number;
  city: string;
  address: string;
  lastAddedAt: string;
};

export type UiState = {
  activeCategory: string;
  businessSort: "last" | "rating";
  activeBusinessId: string | null;
};

export type AppState = {
  user: User;
  ui: UiState;
  requests: RequestItem[];
  businesses: BusinessItem[];
};
