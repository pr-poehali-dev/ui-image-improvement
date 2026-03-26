import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ORDERS = [
  {
    id: "83922156-8204-1",
    product: "L-Теанин, хлорофилл от стресса и тревожности для сна, 60 капсул",
    article: "GRA-87701",
    qty: 2,
    warehouse: "Москва",
    status: "Новый",
    delay: false,
  },
  {
    id: "72332381-0234-4",
    product: "На вес (WoW! Organic!) Omega-3, EPA+DHA, Масло рыбное 60 капсул SizeLab",
    article: "GRA-40248",
    qty: 1,
    warehouse: "СПб",
    status: "Новый",
    delay: false,
  },
  {
    id: "24025767-8126-1",
    product: "L-Карнозин 500 мг SizeLab, L-Carnosine для КОГНИТИВНЫХ функций и НЕЙРОПРОТЕКЦИИ мозга, антиоксидант, 60 капсул",
    article: "GRA-38800",
    qty: 3,
    warehouse: "Москва",
    status: "Новый",
    delay: false,
  },
  {
    id: "99802254-9821-1",
    product: "МСМ (Метилсульфонилметан) Ноотропи, Антиоксидант, 60 капсул",
    article: "GRA-97702",
    qty: 1,
    warehouse: "Екб",
    status: "Новый",
    delay: true,
  },
  {
    id: "83922156-9281-1",
    product: "Коэнзим Q10 500 мг для сердечно-сосудистой системы и контроля давления, набор с омега-3 жирными кислотами 136 капсул SizeLab",
    article: "GRA-00211",
    qty: 2,
    warehouse: "Москва",
    status: "Новый",
    delay: false,
  },
];

interface Tab {
  id: string;
  label: string;
  count: number | null;
  icon: string;
  alert?: boolean;
}

const TABS: Tab[] = [
  { id: "new", label: "НОВЫЕ", count: 98, icon: "ShoppingCart" },
  { id: "assembly", label: "НА СБОРКЕ", count: 5, icon: "Package" },
  { id: "fbs", label: "ПРОВЕРКА ОСТАТКОВ ФБС", count: 38, icon: "ClipboardList" },
  { id: "problems", label: "ПРОБЛЕМЫ ОСТАТКОВ", count: 71, icon: "AlertTriangle", alert: true },
  { id: "staff", label: "СОТРУДНИКИ", count: 6, icon: "Users" },
  { id: "settings", label: "НАСТРОЙКИ", count: null, icon: "Settings" },
];

interface Assembly {
  id: string;
  title: string;
  date: string;
  time: string;
  store: string;
  access: string;
  total: number;
  done: number;
  shipped: boolean;
}

const ASSEMBLIES: Assembly[] = [
  { id: "1", title: "Сборка Ozon", date: "26.03", time: "16:00", store: "ИП Ирина", access: "СКРЫТА", total: 96, done: 0, shipped: false },
  { id: "2", title: "Сборка Ozon", date: "26.03", time: "09:19", store: "ИП Ирина", access: "СКРЫТА", total: 204, done: 0, shipped: false },
  { id: "3", title: "Сборка Ozon", date: "25.03", time: "12:06", store: "ИП Ирина", access: "СКРЫТА", total: 135, done: 135, shipped: true },
  { id: "4", title: "Сборка Ozon", date: "25.03", time: "07:00", store: "ИП Ирина", access: "СКРЫТА", total: 232, done: 0, shipped: false },
];

const ALERTS = [
  {
    type: "critical",
    icon: "AlertCircle",
    title: "Критические остатки",
    text: "GRA-38800 — осталось 2 ед. на складе Москва. Пополните запасы.",
  },
  {
    type: "warning",
    icon: "Clock",
    title: "Задержка отправки",
    text: "Отправление 99802254-9821-1 (Екб) — превышен срок сборки на 4 часа.",
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("new");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [showAlerts, setShowAlerts] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = ORDERS.filter(
    (o) =>
      o.id.includes(search) ||
      o.article.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
  );

  const allChecked = filtered.length > 0 && selected.length === filtered.length;

  const toggleAll = () => {
    setSelected(allChecked ? [] : filtered.map((o) => o.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-primary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* HEADER */}
      <header
        className="flex items-center justify-between px-5 h-14 border-b flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "var(--ozon-blue)" }}
            >
              <Icon name="Package" size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
              OZON <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>СКЛАД</span>
            </span>
          </div>
          <div className="h-5 w-px mx-1" style={{ background: "var(--border-primary)" }} />
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", letterSpacing: "0.05em" }}
          >
            FBS Сборка
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}
          >
            <Icon name="RefreshCw" size={13} />
            ПЕРЕКЛЮЧИТЬ МАГАЗИН
          </button>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}
          >
            <Icon name="Store" size={13} />
            Магазин: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>ИП Евгений</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
            style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}
          >
            <Icon name="LogOut" size={13} />
            ВЫЙТИ
          </button>
        </div>
      </header>

      {/* TABS NAV */}
      <nav
        className="flex items-center px-4 border-b overflow-x-auto flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === tab.id ? "tab-active" : "tab-inactive"}`}
          >
            <Icon
              name={tab.icon}
              size={13}
              style={{ color: tab.alert && tab.count ? "var(--accent-orange)" : undefined }}
            />
            {tab.label}
            {tab.count !== null && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: tab.alert
                    ? "rgba(217,119,6,0.25)"
                    : activeTab === tab.id
                    ? "rgba(59,130,246,0.25)"
                    : "var(--bg-tertiary)",
                  color: tab.alert
                    ? "var(--accent-orange)"
                    : activeTab === tab.id
                    ? "var(--accent-blue-light)"
                    : "var(--text-secondary)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-5 space-y-4 animate-fade-in overflow-auto">

        {/* ===== НА СБОРКЕ ===== */}
        {activeTab === "assembly" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
                style={{ background: "var(--accent-blue)", color: "#fff" }}
              >
                <Icon name="Send" size={14} />
                ОТПРАВИТЬ В СБОРКУ
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
                style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}
              >
                <Icon name="RefreshCw" size={14} />
                СИНХР. И ЭТИКЕТКИ
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
                style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}
              >
                <Icon name="RotateCw" size={14} />
                ОБНОВИТЬ
              </button>
            </div>

            {/* Assembly Table */}
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}
            >
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.07em", fontSize: "10px" }}>
                      СБОРКА
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.07em", fontSize: "10px" }}>
                      ДОСТУП
                    </th>
                    <th className="px-4 py-3 text-right font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.07em", fontSize: "10px" }}>
                      ЗАКАЗЫ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ASSEMBLIES.map((a, i) => (
                    <tr
                      key={a.id}
                      className="table-row-hover cursor-pointer"
                      style={{ borderBottom: i < ASSEMBLIES.length - 1 ? "1px solid var(--border-primary)" : "none" }}
                    >
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
                            {a.title} {a.date} {a.time} · <span style={{ color: "var(--text-secondary)" }}>{a.total} заказов</span>
                          </div>
                          <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{a.store}</div>
                          <div>
                            <span
                              className="text-[10px] font-bold tracking-wider"
                              style={{ color: a.shipped ? "var(--accent-green-light)" : "var(--accent-blue-light)" }}
                            >
                              {a.shipped ? "СОБРАНА" : "СБОРКА"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="px-2.5 py-1 rounded text-[10px] font-semibold"
                          style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border-primary)" }}
                        >
                          {a.access}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {a.shipped ? (
                          <span className="font-semibold text-xs" style={{ color: "var(--accent-green-light)" }}>
                            {a.done} отгружено
                          </span>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>
                              {a.done} / {a.total}
                            </span>
                            <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${a.total > 0 ? (a.done / a.total) * 100 : 0}%`,
                                  background: "var(--accent-blue-light)",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {ASSEMBLIES.length} сборки · {ASSEMBLIES.filter(a => a.shipped).length} завершены
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Всего заказов: {ASSEMBLIES.reduce((s, a) => s + a.total, 0)}
              </span>
            </div>
          </div>
        )}

        {/* ===== НОВЫЕ (default) ===== */}
        {activeTab !== "assembly" && <>

        {/* ALERTS */}
        {showAlerts && (
          <div className="space-y-2">
            {ALERTS.map((alert, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded ${alert.type === "critical" ? "alert-critical" : "alert-warning"}`}
              >
                <Icon
                  name={alert.icon}
                  size={16}
                  style={{ color: alert.type === "critical" ? "var(--accent-red)" : "var(--accent-orange)", flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-xs mr-2" style={{ color: alert.type === "critical" ? "var(--accent-red)" : "var(--accent-orange)" }}>
                    {alert.title}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{alert.text}</span>
                </div>
                <button
                  onClick={() => setShowAlerts(false)}
                  className="ml-2 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <Icon name="X" size={13} style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TOOLBAR */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
            style={{ background: "var(--accent-green)", color: "#fff" }}
          >
            <Icon name="RefreshCw" size={14} />
            ОБНОВИТЬ СПИСОК
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}
          >
            <Icon name="Printer" size={14} />
            ПЕЧАТЬ ЭТИКЕТОК
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}
          >
            <Icon name="Download" size={14} />
            ЭКСПОРТ
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold transition-all"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            <Icon name="SlidersHorizontal" size={14} />
            ФИЛЬТРЫ
          </button>

          {selected.length > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded text-xs animate-slide-in"
              style={{ background: "rgba(59,130,246,0.12)", color: "var(--accent-blue-light)", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              <Icon name="CheckSquare" size={13} />
              Выбрано: {selected.length}
            </div>
          )}

          <div className="flex-1" />

          {/* SEARCH */}
          <div className="relative">
            <Icon
              name="Search"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по номеру, артикулу..."
              className="pl-9 pr-4 py-2 rounded text-xs outline-none w-60 transition-all"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-primary)",
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}
        >
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded cursor-pointer"
                    style={{ accentColor: "var(--accent-blue-light)" }}
                  />
                </th>
                {["НОМЕР ОТПРАВЛЕНИЯ", "ТОВАР", "АРТИКУЛ", "КОЛ-ВО", "СКЛАД", "СТАТУС"].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-left font-semibold"
                    style={{ color: "var(--text-muted)", letterSpacing: "0.07em", fontSize: "10px" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className="table-row-hover cursor-pointer"
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border-primary)" : "none",
                    background: selected.includes(order.id) ? "rgba(59,130,246,0.07)" : undefined,
                  }}
                  onClick={() => toggleOne(order.id)}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => toggleOne(order.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3.5 h-3.5 rounded cursor-pointer"
                      style={{ accentColor: "var(--accent-blue-light)" }}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {order.delay && (
                        <Icon name="AlertTriangle" size={11} style={{ color: "var(--accent-orange)", flexShrink: 0 }} />
                      )}
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: "var(--link-color)", fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {order.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 max-w-xs">
                    <span style={{ color: "var(--text-primary)", lineHeight: "1.5" }}>{order.product}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--accent-cyan)", fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {order.article}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: order.qty >= 3 ? "var(--accent-orange)" : "var(--text-primary)" }}
                    >
                      {order.qty}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span style={{ color: "var(--text-secondary)" }}>{order.warehouse}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wide"
                      style={{ background: "rgba(22,163,74,0.2)", color: "var(--accent-green-light)" }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Icon name="SearchX" size={28} style={{ color: "var(--text-muted)" }} />
                      <span style={{ color: "var(--text-muted)" }}>Ничего не найдено</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER INFO */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Показано {filtered.length} из {ORDERS.length} отправлений
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Сборка FBS · Обновлено только что
          </span>
        </div>
        </>}
      </main>

      {/* FOOTER STATUS BAR */}
      <footer
        className="flex items-center justify-between px-5 h-9 border-t flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded"
            style={{ background: "rgba(22,163,74,0.18)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent-green-light)" }} />
            <span className="text-[10px] font-bold tracking-widest" style={{ color: "var(--accent-green-light)" }}>ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Icon name="Store" size={12} style={{ color: "var(--text-muted)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>STORE:</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>ИП Евгений</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Icon name="Clock" size={12} style={{ color: "var(--text-muted)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Mono', monospace" }}>
            {formatTime(time)}
          </span>
        </div>
      </footer>
    </div>
  );
}