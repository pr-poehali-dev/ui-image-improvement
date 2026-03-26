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

interface FbsItem {
  id: string;
  name: string;
  ozonIds: string[];
  sku: string;
  article: string;
  needed: number;
  stock: number;
  cell: string;
  status: "ok" | "deficit" | "error";
}

const FBS_ITEMS: FbsItem[] = [
  { id: "1", name: "GraFLab, Берберин New (с пиколинатом хрома) 3 банки по 60 капсул", ozonIds: ["OZN3010900392", "OZN3551548188"], sku: "5010908392, 3551548188", article: "GRA-08760", needed: 15, stock: 52, cell: "С12П1", status: "ok" },
  { id: "2", name: "GRAFLAB Коллаген АП", ozonIds: ["OZN1667924397"], sku: "2100067921", article: "GRA-11600, GRA-11601", needed: 8, stock: 119, cell: "С5П1", status: "ok" },
  { id: "3", name: "GraFLab, Коллаген UP С Биотином, 60 капсул", ozonIds: ["OZN1448414691"], sku: "2100067998", article: "GRA-00010", needed: 5, stock: 32, cell: "С5П4", status: "ok" },
  { id: "4", name: "GraFLab, Альфа-Липоевая кислота, 100мг, 60 капсул", ozonIds: ["OZN5474457467"], sku: "3474457467", article: "GRA-08350, GRA-08351", needed: 4, stock: 20, cell: "С2П3", status: "ok" },
  { id: "5", name: "Монолаурин 500 мг 60 капсул", ozonIds: ["OZN1256012544"], sku: "2120293586", article: "GRA-08300", needed: 3, stock: 26, cell: "С8П2", status: "ok" },
  { id: "6", name: "GraFLab, Лютеин 2 банки по 60 капсул", ozonIds: ["OZN3551592961"], sku: "3551592961", article: "GRA-08520", needed: 3, stock: 43, cell: "С12П1", status: "ok" },
  { id: "7", name: "GraFLab, Spermidine, 60 капсул", ozonIds: ["OZN3851868572"], sku: "3551606572", article: "GRA-08380", needed: 3, stock: 72, cell: "С10П4", status: "ok" },
  { id: "8", name: "GraFLab, Набор Монолаурин + Кверцетин 2 банки по 60 капсул", ozonIds: ["OZN3651598146"], sku: "3681590146", article: "GRA-04400, GRA-04401", needed: 2, stock: 22, cell: "С12П1", status: "ok" },
  { id: "9", name: "GraFLab, Тримаг, TRIMAG NEURO-BALANCE, 60 капсул", ozonIds: ["OZN2795661680", "OZN3551595652"], sku: "2795661680, 3551595652", article: "GRA-08240", needed: 2, stock: 76, cell: "С10П2", status: "ok" },
  { id: "10", name: "GraFLab, Холин 2 банки по 60 капсул", ozonIds: ["OZN2857533643", "OZN3581594083"], sku: "2857533543, 3551594083", article: "GRA-08490", needed: 2, stock: 49, cell: "С12П1", status: "ok" },
  { id: "11", name: "GraFLab, Цинк Пиколинат, 60 капсул", ozonIds: ["OZN2795779844", "OZN3661594726"], sku: "2796779844, 3681594726", article: "GRA-08320", needed: 2, stock: 74, cell: "С11П2", status: "ok" },
  { id: "12", name: "GraFLab Инозитон + Холин , 60 капсул", ozonIds: ["OZN1312163683"], sku: "2100069070", article: "GRA-08200", needed: 1, stock: 42, cell: "С4П3", status: "ok" },
  { id: "13", name: "GraFLab Лактоферрин (lactoferrin) 60 капсул", ozonIds: ["OZN3651543705"], sku: "3651543705", article: "GRA-07800, GRA-07804", needed: 1, stock: 263, cell: "С6П2 (100), С7П1 (163)", status: "ok" },
  { id: "14", name: "GRAFLAB Метилкобаламин (витамин B12) 60 капсул", ozonIds: ["OZN3456907085"], sku: "3556907085", article: "GRA-08400, GRA-08402", needed: 1, stock: 253, cell: "С2П3", status: "ok" },
  { id: "15", name: "GraFLab Холин (Choline) в капсулах Витамин B4 60 штук", ozonIds: ["OZN1234567890"], sku: "9876543210", article: "GRA-09000, GRA-09002", needed: 1, stock: 32, cell: "С11П2", status: "ok" },
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

        {/* ===== ПРОВЕРКА ОСТАТКОВ ФБС ===== */}
        {activeTab === "fbs" && (
          <div className="space-y-4 animate-fade-in">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold"
                  style={{ background: "var(--accent-green)", color: "#fff" }}
                >
                  <Icon name="RotateCw" size={14} />
                  ОБНОВИТЬ
                </button>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <Icon name="Warehouse" size={13} style={{ color: "var(--text-muted)" }} />
                  Склад: <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Ижевск FBS</span>
                  <span style={{ color: "var(--border-accent)" }}>·</span>
                  <span style={{ color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>17:52:21</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)" }}>
                  ВСЕГО: <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>38</span>
                </span>
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)" }}>
                  ОК: <span style={{ color: "var(--accent-green-light)", fontWeight: 600 }}>38</span>
                </span>
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)" }}>
                  ДЕФИЦИТ: <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>0</span>
                </span>
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)" }}>
                  ОШИБКИ: <span style={{ color: "var(--accent-red)", fontWeight: 600 }}>0</span>
                </span>
              </div>
            </div>

            {/* Table */}
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}
            >
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
                    {["НАЗВАНИЕ", "АРТИКУЛ", "НУЖНО", "ОСТАТОК", "ЯЧЕЙКА", "СТАТУС"].map((col) => (
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
                  {FBS_ITEMS.map((item, i) => (
                    <tr
                      key={item.id}
                      className="table-row-hover cursor-pointer"
                      style={{ borderBottom: i < FBS_ITEMS.length - 1 ? "1px solid var(--border-primary)" : "none" }}
                    >
                      <td className="px-3 py-3">
                        <div className="space-y-0.5">
                          <div className="font-medium" style={{ color: "var(--text-primary)", lineHeight: 1.4 }}>{item.name}</div>
                          <div style={{ color: "var(--link-color)", fontSize: "10px" }}>
                            {item.ozonIds.map((o, idx) => (
                              <span key={idx}>{idx > 0 && ", "}{o}</span>
                            ))}
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace" }}>
                            SKU: {item.sku}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span style={{ color: "var(--accent-cyan)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>
                          {item.article}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.needed}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className="font-semibold"
                          style={{ color: item.stock < item.needed * 2 ? "var(--accent-orange)" : "var(--text-primary)" }}
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>
                          {item.cell}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="font-bold text-[11px] tracking-wide"
                          style={{ color: item.status === "ok" ? "var(--accent-green-light)" : item.status === "deficit" ? "var(--accent-orange)" : "var(--accent-red)" }}
                        >
                          {item.status === "ok" ? "OK" : item.status === "deficit" ? "ДЕФИЦИТ" : "ОШИБКА"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Позиций: {FBS_ITEMS.length}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Нужно отобрать: {FBS_ITEMS.reduce((s, x) => s + x.needed, 0)} ед.
              </span>
            </div>
          </div>
        )}

        {/* ===== ПРОБЛЕМЫ ОСТАТКОВ ===== */}
        {activeTab === "problems" && (
          <div className="space-y-4 animate-fade-in">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold"
                  style={{ background: "var(--accent-green)", color: "#fff" }}
                >
                  <Icon name="RotateCw" size={14} />
                  ОБНОВИТЬ
                </button>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                  Обновлено <span style={{ color: "var(--text-secondary)" }}>22:23:49</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}>
                  ПОЛКА: <span style={{ color: "var(--accent-orange)", fontWeight: 700 }}>32</span>
                </span>
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}>
                  СОТРУДНИК: <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>24</span>
                </span>
                <span className="px-2.5 py-1 rounded" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", color: "var(--text-secondary)" }}>
                  ОСТАТКИ: <span style={{ color: "var(--accent-blue-light)", fontWeight: 700 }}>15</span>
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--accent-orange)", borderLeft: "3px solid var(--accent-orange)" }}>
                <div className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: "var(--accent-orange)" }}>ПОЛКА УШЛА В МИНУС</div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>32</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>32 строк</div>
              </div>
              <div className="rounded-lg p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--accent-red)", borderLeft: "3px solid var(--accent-red)" }}>
                <div className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: "var(--accent-red)" }}>СОТРУДНИК СПИСАЛ В МИНУС</div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>25</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>24 строк</div>
              </div>
              <div className="rounded-lg p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--accent-blue-light)", borderLeft: "3px solid var(--accent-blue-light)" }}>
                <div className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: "var(--accent-blue-light)" }}>ЛИШНИЙ ТОВАР НА РУКАХ</div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>56</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>15 строк</div>
              </div>
            </div>

            {/* Section: ПОЛКА */}
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-primary)", borderLeft: "3px solid var(--accent-orange)" }}>
                <div className="text-[10px] font-semibold tracking-widest mb-1" style={{ color: "var(--accent-orange)" }}>ПОЛКА</div>
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>С полки забрали, а остатка не было</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Показываем текущий незакрытый минус по полке с привязкой к сборка и сотруднику.</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>1</div>
              </div>
              {[{ name: "GraFLab, Комплекс витаминов, 60 капсул", article: "GRA-07780", rows: 32, minus: 32 }].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3.5 table-row-hover cursor-pointer"
                  style={{ borderTop: "1px solid var(--border-primary)" }}
                >
                  <Icon name="Plus" size={12} style={{ color: "var(--accent-orange)", flexShrink: 0 }} />
                  <div className="flex-1">
                    <div className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Артикул: <span style={{ color: "var(--accent-cyan)", fontFamily: "'IBM Plex Mono', monospace" }}>{item.article}</span></div>
                  </div>
                  <div className="flex items-stretch gap-0 rounded overflow-hidden" style={{ border: "1px solid var(--border-primary)" }}>
                    <div className="px-4 py-2 text-center" style={{ background: "var(--bg-tertiary)", borderRight: "1px solid var(--border-primary)" }}>
                      <div className="text-[9px] font-semibold tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>СТРОК</div>
                      <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{item.rows}</div>
                    </div>
                    <div className="px-4 py-2 text-center" style={{ background: "rgba(217,119,6,0.1)" }}>
                      <div className="text-[9px] font-semibold tracking-wider mb-1" style={{ color: "var(--accent-orange)" }}>МИНУС</div>
                      <div className="font-bold text-sm" style={{ color: "var(--accent-orange)" }}>{item.minus}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section: СОТРУДНИК */}
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-primary)", borderLeft: "3px solid var(--accent-red)" }}>
                <div className="text-[10px] font-semibold tracking-widest mb-1" style={{ color: "var(--accent-red)" }}>СОТРУДНИК</div>
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Сотрудник списал заказ в минус</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Здесь виден текущий незакрытый минус у сотрудника после сборки заказа в сборка.</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>9</div>
              </div>
              {[
                { name: "GraFLab, Ресвератрол 200 мг, 3 банки по 60 капсул", article: "GRA-00230", rows: 2, minus: 2 },
                { name: "GraFLab, Лактоферрин 500 мг, 3 банки по 60 капсул", article: "GRA-00240", rows: 2, minus: 2 },
                { name: "GraFLab Таурин 600 мг, 60 капсул", article: "GRA-06983", rows: 2, minus: 2 },
                { name: "GraFLab, Комплекс витаминов, 60 капсул", article: "GRA-07780", rows: 1, minus: 1 },
                { name: "GraFLab Лактоферрин (lactoferrin) 60 капсул", article: "GRA-07800", rows: 1, minus: 1 },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3.5 table-row-hover cursor-pointer"
                  style={{ borderTop: "1px solid var(--border-primary)" }}
                >
                  <Icon name="Plus" size={12} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                  <div className="flex-1">
                    <div className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>Артикул: <span style={{ color: "var(--accent-cyan)", fontFamily: "'IBM Plex Mono', monospace" }}>{item.article}</span></div>
                  </div>
                  <div className="flex items-stretch gap-0 rounded overflow-hidden" style={{ border: "1px solid var(--border-primary)" }}>
                    <div className="px-4 py-2 text-center" style={{ background: "var(--bg-tertiary)", borderRight: "1px solid var(--border-primary)" }}>
                      <div className="text-[9px] font-semibold tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>СТРОК</div>
                      <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{item.rows}</div>
                    </div>
                    <div className="px-4 py-2 text-center" style={{ background: "rgba(220,38,38,0.1)" }}>
                      <div className="text-[9px] font-semibold tracking-wider mb-1" style={{ color: "var(--accent-red)" }}>МИНУС</div>
                      <div className="font-bold text-sm" style={{ color: "var(--accent-red)" }}>{item.minus}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== СОТРУДНИКИ ===== */}
        {activeTab === "staff" && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Сотрудники</h2>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Логин и пароль берутся из общей базы сотрудников.</p>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold"
                style={{ background: "var(--accent-green)", color: "#fff" }}
              >
                <Icon name="UserPlus" size={14} />
                ДОБАВИТЬ СОТРУДНИКА
              </button>
            </div>

            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}
            >
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
                    {["СОТРУДНИК", "ЛОГИН", "РОЛЬ", "СОЗДАНО", "ДЕЙСТВИЯ"].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-semibold"
                        style={{ color: "var(--text-muted)", letterSpacing: "0.07em", fontSize: "10px" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Пущин Тимофей Андреевич", login: "пущин.тимофей", role: "Упаковщик", created: "26.03.2026" },
                    { name: "Коньшина Ольга Викторовна", login: "коньшина.ольга", role: "Упаковщик", created: "18.03.2026" },
                    { name: "Плешкова Татьяна Витальевна", login: "плешкова.татьяна", role: "Упаковщик", created: "18.03.2026" },
                    { name: "Объедкова Дарья Юрьевна", login: "объедкова.дарья", role: "Упаковщик", created: "18.03.2026" },
                    { name: "Владимирова Анжела Александровна", login: "владимирова.анжела", role: "Упаковщик", created: "18.03.2026" },
                    { name: "Шатилова Дарья Борисовна", login: "шатилова.дарья", role: "Упаковщик", created: "18.03.2026" },
                  ].map((emp, i, arr) => (
                    <tr
                      key={i}
                      className="table-row-hover"
                      style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-primary)" : "none" }}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{emp.name}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span style={{ color: "var(--link-color)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>{emp.login}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span style={{ color: "var(--text-secondary)" }}>{emp.role}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span style={{ color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>{emp.created}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1 rounded text-[10px] font-bold tracking-wide transition-all"
                            style={{ background: "rgba(37,99,235,0.15)", color: "var(--accent-blue-light)", border: "1px solid rgba(37,99,235,0.4)" }}
                          >
                            СТАТИСТИКА
                          </button>
                          <button
                            className="px-3 py-1 rounded text-[10px] font-bold tracking-wide transition-all"
                            style={{ background: "rgba(220,38,38,0.15)", color: "var(--accent-red)", border: "1px solid rgba(220,38,38,0.4)" }}
                          >
                            УДАЛИТЬ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== НАСТРОЙКИ ===== */}
        {activeTab === "settings" && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Настройки</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ошибки сборки от сотрудников.</p>
            </div>

            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}
            >
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-primary)" }}>
                    {["СОТРУДНИК", "СБОРКА", "ТОВАР", "БАРКОД", "СОЗДАНО", "ДЕЙСТВИЯ"].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-semibold"
                        style={{ color: "var(--text-muted)", letterSpacing: "0.07em", fontSize: "10px" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Icon name="CheckCircle" size={28} style={{ color: "var(--accent-green-light)" }} />
                        <span style={{ color: "var(--text-muted)" }}>Нет ошибок</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== НОВЫЕ (default) ===== */}
        {activeTab !== "assembly" && activeTab !== "fbs" && activeTab !== "problems" && activeTab !== "staff" && activeTab !== "settings" && <>

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