"use client";

import * as React from "react";
import {
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Gamepad2,
  Home,
  LineChart,
  Megaphone,
  Settings,
  Trophy,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const kpis = [
  { label: "ยอดฝากรวม", value: "726,180.00", unit: "THB", delta: "+12.5%", icon: CircleDollarSign, accent: "purple" },
  { label: "ยอดถอนรวม", value: "484,120.00", unit: "THB", delta: "-8.3%", icon: WalletCards, accent: "white" },
  { label: "กำไรสุทธิ", value: "1,210,300.00", unit: "THB", delta: "+6.9%", icon: BarChart3, accent: "purple" },
  { label: "ยอดเดิมพัน", value: "4,527,891.20", unit: "THB", delta: "+15.2%", icon: Gamepad2, accent: "white" },
  { label: "สมาชิกใหม่", value: "31", unit: "บัญชี", delta: "+47.6%", icon: UserRound, accent: "purple" },
  { label: "First Deposit", value: "17", unit: "บัญชี", delta: "-54.8%", icon: UsersRound, accent: "white" },
];

const navItems = [
  { label: "ภาพรวมระบบ", icon: Home, active: true },
  { label: "รายงานการเดิมพัน", icon: LineChart },
  { label: "สมาชิก", icon: UserRound },
  { label: "การตลาด", icon: Megaphone },
  { label: "โปรโมชั่น", icon: Trophy },
  { label: "ธุรกรรม", icon: WalletCards },
  { label: "รายงาน", icon: BarChart3 },
  { label: "ตั้งค่า", icon: Settings },
];

const channels = [
  ["Facebook", "252", "37.6%", "฿839,445.10", 92],
  ["เพื่อนแนะนำ", "95", "14.2%", "฿620,016.00", 54],
  ["Google", "128", "19.1%", "฿415,157.00", 63],
  ["LINE", "43", "6.4%", "฿85,964.00", 22],
  ["TikTok", "12", "1.8%", "฿38,800.00", 13],
  ["Youtube", "11", "1.6%", "฿8,330.00", 11],
  ["แอดมินแนะนำ", "5", "0.7%", "฿8,100.00", 9],
  ["ดูหนังออนไลน์", "7", "1.0%", "฿8,250.00", 10],
] as const;

const bankData = [
  { name: "SCB", count: 8, pct: "25.8%", color: "#7c3aed" },
  { name: "กรุงเทพ", count: 7, pct: "22.6%", color: "#2563eb" },
  { name: "กรุงไทย", count: 6, pct: "19.4%", color: "#0ea5e9" },
  { name: "กสิกรไทย", count: 4, pct: "12.9%", color: "#10b981" },
  { name: "TrueMoney", count: 3, pct: "9.7%", color: "#f59e0b" },
  { name: "ออมสิน", count: 2, pct: "6.5%", color: "#ec4899" },
  { name: "Others", count: 1, pct: "3.1%", color: "#64748b" },
];

// Area Chart 24h Data
const transactionTrendData = [
  { time: "00:00", deposit: 18000, withdraw: 12000 },
  { time: "02:00", deposit: 12500, withdraw: 8200 },
  { time: "04:00", deposit: 9200, withdraw: 6100 },
  { time: "06:00", deposit: 24000, withdraw: 15400 },
  { time: "08:00", deposit: 42000, withdraw: 28000 },
  { time: "10:00", deposit: 68000, withdraw: 45000 },
  { time: "12:00", deposit: 85000, withdraw: 54000 },
  { time: "14:00", deposit: 78000, withdraw: 61000 },
  { time: "16:00", deposit: 92000, withdraw: 59000 },
  { time: "18:00", deposit: 115000, withdraw: 72000 },
  { time: "20:00", deposit: 128000, withdraw: 84000 },
  { time: "22:00", deposit: 94000, withdraw: 62000 },
  { time: "23:59", deposit: 60480, withdraw: 37420 },
];

const transactionChartConfig = {
  deposit: {
    label: "ยอดฝาก (THB)",
    color: "#a855f7",
  },
  withdraw: {
    label: "ยอดถอน (THB)",
    color: "#ffffff",
  },
} satisfies ChartConfig;

// Deposit Distribution Data
const depositDistributionData = [
  { range: "<100", count: 28, highlight: false },
  { range: "100-300", count: 76, highlight: false },
  { range: "301-500", count: 98, highlight: true },
  { range: "501-1K", count: 65, highlight: false },
  { range: "1K-3K", count: 45, highlight: false },
  { range: "3K-5K", count: 32, highlight: false },
  { range: "5K-10K", count: 18, highlight: false },
  { range: "10K+", count: 5, highlight: false },
];

const depositDistConfig = {
  count: {
    label: "จำนวนรายการ",
    color: "#a855f7",
  },
} satisfies ChartConfig;

// Hourly Registration Data
const hourlyMembersData = [
  { hour: "00", count: 2 },
  { hour: "01", count: 1 },
  { hour: "02", count: 1 },
  { hour: "03", count: 2 },
  { hour: "04", count: 3 },
  { hour: "05", count: 4 },
  { hour: "06", count: 6 },
  { hour: "07", count: 7 },
  { hour: "08", count: 8 },
  { hour: "09", count: 10 },
  { hour: "10", count: 14 },
  { hour: "11", count: 16 },
  { hour: "12", count: 13 },
  { hour: "13", count: 9 },
  { hour: "14", count: 7 },
  { hour: "15", count: 5 },
  { hour: "16", count: 4 },
  { hour: "17", count: 3 },
  { hour: "18", count: 4 },
  { hour: "19", count: 2 },
  { hour: "20", count: 2 },
  { hour: "21", count: 1 },
  { hour: "22", count: 2 },
  { hour: "23", count: 1 },
];

const hourlyMembersConfig = {
  count: {
    label: "สมาชิกใหม่",
    color: "#a855f7",
  },
} satisfies ChartConfig;

const bankChartConfig = {
  count: {
    label: "จำนวนบัญชี",
    color: "#a855f7",
  },
} satisfies ChartConfig;

function Sparkline({ white = false }: { white?: boolean }) {
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-28" aria-hidden="true">
      <polyline
        points="0,30 16,27 30,26 43,21 55,23 68,15 79,17 92,10 104,12 120,4"
        fill="none"
        stroke={white ? "rgba(255,255,255,.92)" : "url(#spark)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!white && (
        <defs>
          <linearGradient id="spark" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}

function CustomerJourney() {
  const rows = [
    ["1", "สมัครใหม่", "31", "100%", 100],
    ["2", "ทำฝากครั้งแรก", "17", "54.8%", 54.8],
    ["3", "Active (เดิมพันครั้งแรก)", "14", "45.2%", 45.2],
  ] as const;

  return (
    <section className="surface-card h-full p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">เส้นทางลูกค้า</p>
          <p className="text-xs text-white/45">Customer Journey</p>
        </div>
        <button className="surface-control">วันนี้</button>
      </div>
      <div className="space-y-3">
        {rows.map(([step, label, value, rate, width], index) => (
          <div key={step}>
            <div className="journey-row">
              <div className="journey-step">{step}</div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="truncate text-sm text-white/75">{label}</p>
                    <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
                  </div>
                  <p className="text-lg font-semibold text-violet-300">{rate}</p>
                </div>
                <div className="progress-track">
                  <div
                    className={index === 1 ? "progress-fill progress-fill--white" : "progress-fill"}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardShell() {
  return (
    <main className="dashboard-bg min-h-screen text-white">
      <div className="mx-auto grid min-h-screen max-w-[1920px] grid-cols-[240px_1fr] gap-4 p-4">
        <aside className="surface-sidebar flex flex-col p-4">
          <div className="mb-7">
            <div className="text-2xl font-semibold tracking-tight">
              cosmic<span className="text-violet-400">bet</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-[.32em] text-white/40">
              Admin Dashboard
            </div>
          </div>
          <nav className="space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button key={label} className={active ? "nav-item nav-item--active" : "nav-item"}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/8 bg-white/[.025] p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-white/45">Welcome Back</p>
                <p className="text-sm font-medium">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5">
                <Home className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">ภาพรวมระบบ / Dashboard</h1>
                <p className="text-sm text-white/45">สรุปข้อมูลสำคัญของระบบ แบบเรียลไทม์</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="surface-control flex items-center gap-2 px-4">
                <CalendarDays className="h-4 w-4" />
                12 ธ.ค. 2023, 00:00 - 23:59
              </button>
              <div className="surface-segmented">
                {["วันนี้", "สัปดาห์", "เดือน", "ปี"].map((x, i) => (
                  <button key={x} className={i === 0 ? "segment segment--active" : "segment"}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-6 gap-3">
            {kpis.map((item) => {
              const Icon = item.icon;
              const white = item.accent === "white";
              return (
                <article key={item.label} className="surface-card p-4">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className={white ? "icon-tile icon-tile--white" : "icon-tile"}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Sparkline white={white} />
                  </div>
                  <p className="text-sm text-white/55">{item.label}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className={white ? "text-2xl font-semibold text-white" : "text-2xl font-semibold text-violet-300"}>
                      {item.value}
                    </p>
                    <span className="text-xs text-white/45">{item.unit}</span>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className={item.delta.startsWith("-") ? "text-rose-400" : "text-violet-300"}>
                      {item.delta}
                    </span>
                    <span className="ml-2 text-white/35">จากเมื่อวาน</span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Main Area Chart & Customer Journey */}
          <div className="grid grid-cols-[minmax(0,1.9fr)_minmax(340px,.8fr)] gap-3">
            <section className="surface-card p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">ฝาก - ถอน ตลอดทั้งวัน</h2>
                  <p className="text-xs text-white/40">ภาพรวมธุรกรรมตามช่วงเวลา (Shadcn Chart)</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="metric-chip">
                    <span className="dot dot--purple" />
                    ยอดฝากรวม <strong>726,180.00 THB</strong>
                  </div>
                  <div className="metric-chip">
                    <span className="dot dot--white" />
                    ยอดถอนรวม <strong>484,120.00 THB</strong>
                  </div>
                  <div className="metric-chip">
                    <span className="dot dot--purple" />
                    ยอดสุทธิ <strong>242,060.00 THB</strong>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full pt-2">
                <ChartContainer config={transactionChartConfig} className="h-full w-full">
                  <AreaChart data={transactionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaDeposit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="areaWithdraw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <Area
                      type="monotone"
                      dataKey="deposit"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#areaDeposit)"
                    />
                    <Area
                      type="monotone"
                      dataKey="withdraw"
                      stroke="#ffffff"
                      strokeWidth={2}
                      strokeOpacity={0.9}
                      fillOpacity={1}
                      fill="url(#areaWithdraw)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </section>
            <CustomerJourney />
          </div>

          {/* Banks Donut & Marketing Channels */}
          <div className="grid grid-cols-[.95fr_1.55fr] gap-3">
            <section className="surface-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">สัดส่วนธนาคารที่ลูกค้าใช้งาน</h3>
                  <p className="text-xs text-white/40">Shadcn Donut Chart</p>
                </div>
                <button className="surface-control">วันนี้</button>
              </div>
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <div className="relative h-[180px] w-[180px] mx-auto">
                  <ChartContainer config={bankChartConfig} className="h-full w-full">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <Pie
                        data={bankData}
                        dataKey="count"
                        nameKey="name"
                        innerRadius={52}
                        outerRadius={78}
                        paddingAngle={3}
                      >
                        {bankData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(12,13,18,0.8)" strokeWidth={2} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tracking-tight text-white">31</span>
                    <span className="text-xs text-white/45">บัญชีทั้งหมด</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {bankData.map((bank) => (
                    <div key={bank.name} className="grid grid-cols-[1fr_40px_60px] items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bank.color }} />
                        <span className="text-white/70 truncate">{bank.name}</span>
                      </div>
                      <span className="text-right text-white/55">{bank.count}</span>
                      <span className="text-right text-violet-300 font-medium">{bank.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="surface-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">ช่องทางที่ลูกค้ารู้จักเว็บเรา</h3>
                <button className="surface-control">วันนี้</button>
              </div>
              <div className="grid grid-cols-[1.2fr_90px_90px_1.4fr_120px] gap-3 border-b border-white/8 pb-2 text-xs text-white/35">
                <span>ช่องทาง</span>
                <span>จำนวนลูกค้า</span>
                <span>สัดส่วน</span>
                <span>ยอดฝากรวม</span>
                <span></span>
              </div>
              <div className="divide-y divide-white/[.045]">
                {channels.map(([name, count, pct, amount, width], i) => (
                  <div
                    key={name}
                    className="grid grid-cols-[1.2fr_90px_90px_1.4fr_120px] items-center gap-3 py-2 text-sm"
                  >
                    <span className="text-white/78">{name}</span>
                    <span className="text-white/55">{count}</span>
                    <span className="text-white/55">{pct}</span>
                    <div className="progress-track h-2.5">
                      <div
                        className={i % 3 === 1 ? "progress-fill progress-fill--white" : "progress-fill"}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-right text-white/78">{amount}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Lower Grid: Heatmap, Deposit Distribution Chart & Hourly Members Chart */}
          <div className="grid grid-cols-3 gap-3 pb-4">
            <section className="surface-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">ช่วงเวลาที่ลูกค้าใช้งาน</h3>
                <button className="surface-control">วันนี้</button>
              </div>
              <div className="heatmap">
                {Array.from({ length: 7 * 24 }).map((_, i) => (
                  <span key={i} className={`heat-cell heat-${(i * 7) % 6}`} />
                ))}
              </div>
            </section>

            <section className="surface-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">การกระจายยอดฝากของลูกค้า</h3>
                <button className="surface-control">วันนี้</button>
              </div>
              <div className="h-[180px] w-full">
                <ChartContainer config={depositDistConfig} className="h-full w-full">
                  <BarChart data={depositDistributionData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="range"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[5, 5, 1, 1]}>
                      {depositDistributionData.map((entry, index) => (
                        <Cell
                          key={`dist-${index}`}
                          fill={entry.highlight ? "rgba(255,255,255,0.92)" : "#a855f7"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </section>

            <section className="surface-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">สมาชิกใหม่ รายชั่วโมง</h3>
                <button className="surface-control">วันนี้</button>
              </div>
              <div className="h-[180px] w-full">
                <ChartContainer config={hourlyMembersConfig} className="h-full w-full">
                  <BarChart data={hourlyMembersData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }}
                      interval={2}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {hourlyMembersData.map((entry, index) => {
                        const isPeak = index >= 10 && index <= 12;
                        return (
                          <Cell
                            key={`hour-${index}`}
                            fill={isPeak ? "rgba(255,255,255,0.95)" : "#8b5cf6"}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
