import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Inbox, Activity, CheckCircle2, Clock, Layers, ChevronRight } from 'lucide-react';
import { STAGES, TONES, HARDWARE, fullName, formatDateTime, timeAgo, searchMatches, getStage } from '../lib/workflow';
import { StatusBadge, MiniProgress, HardwareTag, SaleTypeChips, EmptyState } from '../components/ui';

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'active', label: 'En curso' },
  { id: 'draft', label: 'Borradores' },
  { id: 'done', label: 'Instaladas' },
];

export default function DashboardView({ requests, searchQuery, onOpenDetail, onGoToStage, onNewRequest }) {
  const [filter, setFilter] = useState('all');

  const stats = useMemo(() => {
    const done = requests.filter((r) => r.completed).length;
    const drafts = requests.filter((r) => r.stage === 1).length;
    return { total: requests.length, done, drafts, active: requests.length - done - drafts };
  }, [requests]);

  const rows = requests
    .filter((r) => searchMatches(r, searchQuery))
    .filter((r) =>
      filter === 'all' ? true : filter === 'done' ? r.completed : filter === 'draft' ? r.stage === 1 : !r.completed && r.stage > 1,
    );

  const activity = useMemo(
    () =>
      requests
        .flatMap((r) => (r.history || []).map((h) => ({ ...h, requestId: r.id, business: r.business.name })))
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .slice(0, 8),
    [requests],
  );

  const kpis = [
    { label: 'Gestiones registradas', value: stats.total, icon: Layers, hint: 'Total en la plataforma' },
    { label: 'En curso', value: stats.active, icon: Activity, hint: 'Entre etapas 2 y 5' },
    { label: 'Borradores', value: stats.drafts, icon: Clock, hint: 'Pendientes de envío' },
    { label: 'POS instalados', value: stats.done, icon: CheckCircle2, hint: 'Flujo cerrado' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">{k.label}</p>
              <k.icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{k.value}</p>
            <p className="mt-1 text-[11px] text-slate-500">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="card">
        <div className="card-header">
          <div>
            <p className="card-title">Pipeline por etapa</p>
            <p className="card-subtitle">Gestiones pendientes de atender en cada área</p>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {STAGES.map((s) => {
            const count = requests.filter((r) => r.stage === s.id && !r.completed).length;
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
            const t = TONES[s.tone];
            return (
              <button key={s.id} onClick={() => onGoToStage(s.id)} className="group p-5 text-left transition-colors hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.iconBg}`}>
                    <s.icon className="h-4 w-4" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-600" />
                </div>
                <p className="mt-3 text-[11px] font-medium text-slate-500">Etapa {s.id}</p>
                <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tabular-nums text-slate-900">{count}</span>
                  <span className="text-[11px] text-slate-500">{pct}% del total</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${pct}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Tabla */}
        <div className="card overflow-hidden xl:col-span-2">
          <div className="card-header flex-wrap">
            <div>
              <p className="card-title">Gestiones</p>
              <p className="card-subtitle">{rows.length} resultado(s){searchQuery && ` para “${searchQuery}”`}</p>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${filter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {rows.length === 0 ? (
            <EmptyState icon={Inbox} title="No hay gestiones" description="Ajusta el filtro o la búsqueda, o registra una nueva gestión." action={<button onClick={onNewRequest} className="btn-primary btn-sm">Nueva gestión</button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Gestión</th>
                    <th>Comercio</th>
                    <th>Terminal</th>
                    <th>Progreso</th>
                    <th>Estado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} onClick={() => onOpenDetail(r.id)} className="cursor-pointer hover:bg-slate-50">
                      <td>
                        <p className="font-mono text-xs font-medium text-slate-900">{r.id}</p>
                        <p className="text-[11px] text-slate-500">{formatDateTime(r.createdAt)}</p>
                      </td>
                      <td className="max-w-56">
                        <p className="truncate font-medium text-slate-900">{r.business.name}</p>
                        <p className="truncate text-xs text-slate-500">{fullName(r)} · NIT {r.customer.nit}</p>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <HardwareTag hardware={r.hardware} />
                          <SaleTypeChips types={r.saleTypes} />
                        </div>
                      </td>
                      <td>
                        <MiniProgress request={r} />
                        <p className="mt-1 text-[11px] text-slate-500">{r.completed ? 'Completado' : `Etapa ${r.stage} · ${getStage(r.stage).short}`}</p>
                      </td>
                      <td><StatusBadge request={r} /></td>
                      <td className="text-right"><ChevronRight className="inline h-4 w-4 text-slate-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lateral */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <p className="card-title">Actividad reciente</p>
            </div>
            <ul className="px-5 py-4">
              {activity.map((a, i) => {
                const st = getStage(a.stage);
                return (
                  <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < activity.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200" />}
                    <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white ${TONES[st.tone].dot}`} />
                    <button onClick={() => onOpenDetail(a.requestId)} className="min-w-0 text-left">
                      <p className="text-xs text-slate-800"><span className="font-medium">{a.action}</span></p>
                      <p className="truncate text-[11px] text-slate-500">{a.business} · {a.by} · {timeAgo(a.at)}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <p className="card-title">Por tipo de terminal</p>
            </div>
            <div className="space-y-3 px-5 py-4">
              {HARDWARE.map((hw) => {
                const c = requests.filter((r) => r.hardware === hw.key).length;
                const pct = requests.length ? (c / requests.length) * 100 : 0;
                return (
                  <div key={hw.key}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{hw.label} <span className="font-normal text-slate-400">· {hw.detail}</span></span>
                      <span className="tabular-nums text-slate-500">{c}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-slate-800" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
