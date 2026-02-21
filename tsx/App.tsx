import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AppState, RequestItem, Role, User } from "./state/types";
import { loadState, saveState } from "./state/storage";
import { useHashRoute } from "./router/useHashRoute";
import { Topbar } from "./components/Topbar";
import { BottomBar } from "./components/BottomBar";
import { BottomSheet } from "./components/BottomSheet";
import { CitySheet, CreateRequestSheet, OfferSheet } from "./components/sheets";
import { nowIso, uid } from "./state/helpers";
import { defaultState } from "./state/defaultState";
import {
  Business,
  Category,
  City,
  ClientHome,
  Profile,
  RegisterForm,
  RegisterPhoto,
  RegisterRole,
  Requests,
  Splash,
  BizHome,
} from "./screens";
import styles from "./App.module.css";

type SheetState = null | { title: string; content: React.ReactNode };

export function App() {
  const { route, setRoute } = useHashRoute();
  const [state, setState] = useState<AppState>(() => loadState());
  const [sheet, setSheet] = useState<SheetState>(null);

  const isAuthed = Boolean(state.user.role && state.user.city);
  const homeRoute = state.user.role === "business" ? "biz-home" : "client-home";

  const setUser = useCallback((patch: Partial<User>) => {
    setState((prev) => {
      const next: AppState = { ...prev, user: { ...prev.user, ...patch } };
      saveState(next);
      return next;
    });
  }, []);

  const setRole = useCallback((r: Role) => {
    setState((prev) => {
      const next: AppState = { ...prev, user: { ...prev.user, role: r } };
      saveState(next);
      return next;
    });
  }, []);

  const setUi = useCallback((patch: Partial<AppState["ui"]>) => {
    setState((prev) => {
      const next: AppState = { ...prev, ui: { ...prev.ui, ...patch } };
      saveState(next);
      return next;
    });
  }, []);

  const createRequest = useCallback(
    (query: string) => {
      const q = query.trim();
      if (!q) return;
      setState((prev) => {
        const next: AppState = {
          ...prev,
          requests: [
            {
              id: uid(),
              query: q,
              city: prev.user.city || "—",
              status: "Новый",
              createdAt: nowIso(),
            },
            ...prev.requests,
          ],
        };
        saveState(next);
        return next;
      });
    },
    [setState],
  );

  const resetAll = useCallback(() => {
    try {
      window.localStorage.removeItem("sarafan.prototype.v1");
    } catch {
      // ignore
    }
    const next = defaultState();
    setState(next);
    saveState(next);
    setSheet(null);
    setRoute("splash");
  }, [setRoute]);

  const switchRole = useCallback(() => {
    let nextHome: "client-home" | "biz-home" = "client-home";
    setState((prev) => {
      const nextRole: Role = prev.user.role === "business" ? "client" : "business";
      nextHome = nextRole === "business" ? "biz-home" : "client-home";
      const next: AppState = { ...prev, user: { ...prev.user, role: nextRole } };
      saveState(next);
      return next;
    });
    setRoute(nextHome);
  }, [setRoute]);

  const openCitySheet = useCallback(() => {
    setSheet({
      title: "Город",
      content: (
        <CitySheet
          city={state.user.city}
          onSave={(city) => {
            const v = city.trim();
            if (!v) return;
            setUser({ city: v });
            setSheet(null);
          }}
        />
      ),
    });
  }, [setUser, state.user.city]);

  const openCreateRequestSheet = useCallback(
    (presetQuery: string) => {
      setSheet({
        title: "Запрос",
        content: (
          <CreateRequestSheet
            presetQuery={presetQuery}
            onCreate={(q) => {
              createRequest(q);
              setSheet(null);
              setRoute("requests");
            }}
          />
        ),
      });
    },
    [createRequest, setRoute],
  );

  const openOfferSheet = useCallback((r: RequestItem) => {
    setSheet({
      title: "Отклик",
      content: (
        <OfferSheet
          request={r}
          onSend={() => {
            setSheet(null);
            window.alert("Прототип: отклик отправлен");
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    const publicRoutes = new Set(["splash", "role", "reg", "city", "photo"]);
    if (!isAuthed && !publicRoutes.has(route)) {
      setRoute("splash");
      return;
    }
    if (isAuthed && publicRoutes.has(route)) {
      setRoute(homeRoute);
    }
  }, [isAuthed, route, setRoute, homeRoute]);

  const topbar = useMemo(() => {
    if (route === "splash") return null;
    const showBack = ["role", "reg", "city", "photo", "category", "business", "requests", "profile"].includes(route);
    const title =
      route === "role" || route === "reg" || route === "city" || route === "photo" ? "Регистрация" : "SARAFAN";
    return <Topbar title={title} showBack={showBack} onBack={() => window.history.back()} />;
  }, [route]);

  const showBottomBar = isAuthed && ["client-home", "category", "business", "requests", "biz-home", "profile"].includes(route);
  const cityLabel = state.user.city || "Выбрать город";

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        {topbar}
        <main className={styles.screen}>
          {route === "splash" ? <Splash onStart={() => setRoute("role")} /> : null}

          {route === "role" ? (
            <RegisterRole role={state.user.role} onSelect={setRole} onNext={() => setRoute("reg")} />
          ) : null}

          {route === "reg" ? (
            <RegisterForm
              user={{ name: state.user.name, phone: state.user.phone, email: state.user.email, city: state.user.city }}
              onChange={(patch) => setUser(patch)}
              onNext={() => setRoute(state.user.city ? "photo" : "city")}
            />
          ) : null}

          {route === "city" ? (
            <City
              city={state.user.city}
              onChange={(city) => setUser({ city })}
              onNext={() => setRoute(state.user.city.trim() ? "photo" : "city")}
            />
          ) : null}

          {route === "photo" ? (
            <RegisterPhoto
              avatarDataUrl={state.user.avatarDataUrl}
              onAvatarChange={(avatarDataUrl) => setUser({ avatarDataUrl })}
              onSave={() => {
                // prototype: consider registration complete
                if (!state.user.role) {
                  setRoute("role");
                  return;
                }
                if (!state.user.city) {
                  setRoute("city");
                  return;
                }
                setRoute(state.user.role === "business" ? "biz-home" : "client-home");
              }}
            />
          ) : null}

          {route === "client-home" ? (
            <ClientHome
              cityLabel={cityLabel}
              onCityClick={openCitySheet}
              onSearchEnter={(q) => openCreateRequestSheet(q)}
              onPickCategory={(category) => {
                setUi({ activeCategory: category });
                setRoute("category");
              }}
              onOpenRequests={() => setRoute("requests")}
            />
          ) : null}

          {route === "category" ? (
            <Category
              state={state}
              onSort={(businessSort) => setUi({ businessSort })}
              onOpenBusiness={(id) => {
                setUi({ activeBusinessId: id });
                setRoute("business");
              }}
            />
          ) : null}

          {route === "business" ? <Business state={state} onCreateRequest={() => openCreateRequestSheet("")} /> : null}

          {route === "requests" ? <Requests items={state.requests} onBackToSearch={() => setRoute("client-home")} /> : null}

          {route === "biz-home" ? (
            <BizHome
              city={state.user.city}
              cityLabel={cityLabel}
              onCityClick={openCitySheet}
              items={state.requests}
              onOffer={(r) => openOfferSheet(r)}
            />
          ) : null}

          {route === "profile" ? <Profile user={state.user} onSwitchRole={switchRole} onReset={resetAll} /> : null}
        </main>
      </div>

      {showBottomBar && state.user.role ? (
        <BottomBar
          role={state.user.role}
          route={route}
          onNavigate={(r) => {
            if (r === "biz-home" && state.user.role !== "business") return;
            if ((r === "client-home" || r === "requests") && state.user.role === "business") return;
            setRoute(r);
          }}
        />
      ) : null}

      {sheet ? <BottomSheet title={sheet.title} onClose={() => setSheet(null)}>{sheet.content}</BottomSheet> : null}
    </div>
  );
}
