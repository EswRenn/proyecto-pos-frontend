import React, { useMemo, useState } from 'react';
import { Inbox, Plus, ExternalLink, MapPin, Mail, Phone } from 'lucide-react';
import { getStage, TONES, fullName, formatDateTime, timeAgo, searchMatches, getHardware } from '../lib/workflow';
import { StatusBadge, HardwareTag, SaleTypeChips, StageStepper, EmptyState, Avatar, KV, Badge } from '../components/ui';
import Stage1Panel from '../components/stages/Stage1Panel';
import Stage2Panel from '../components/stages/Stage2Panel';
import Stage3Panel from '../components/stages/Stage3Panel';
import Stage4Panel from '../components/stages/Stage4Panel';
import Stage5Panel from '../components/stages/Stage5Panel';

const PANELS = { 1: Stage1Panel, 2: Stage2Panel, 3: Stage3Panel, 4: Stage4Panel, 5: Stage5Panel };

const TABS = {
  1: [{ id: 'queue', label: 'Borradores' }, { id: 'sent', label: 'Enviadas · seguimiento' }],
  5: [{ id: 'queue', label: 'Por instalar' }, { id: 'sent', label: 'Instaladas' }],
};
const DEFAULT_TABS = [{ id: 'queue', label: 'Pendientes' }, { id: 'sent', label: 'Procesadas' }];

export default function StageWorkspace({ stage, actor, requests, searchQuery, applyChange, toast, onOpenDetail, onViewDocument, onNewRequest, onEditRequest }) {
  const st = getStage(stage);
  const tone = TONES[st.tone];
  const tabs = TABS[stage] || DEFAULT_TABS;
  const [tab, setTab] = useState('queue');
  const [selectedId, setSelectedId] = useState(null);

  const lists = useMemo(() => {
    const match = requests.filter((r) => searchMatches(r, searchQuery));
    const queue = match.filter((r) => r.stage === stage && !r.completed);
    const sent = stage === 5 ? match.filter((r) => r.completed) : match.filter((r) => r.stage > stage || r.completed);
    return { queue, sent };
  }, [requests, searchQuery, stage]);

  const list = lists[tab];

  // Si la gestión seleccionada salió de la lista (cambio de etapa o pestaña), se toma la primera
  const selected = list.find((r) => r.id === selectedId) || list[0] || null;
  const Panel = PANELS[stage];
  const isActionable = selected && selected.stage === stage && !selected.completed;

  return (
    <div className="space-y-5">
      {/* Encabezado del rol */}
      <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.iconBg}`}>
            <st.icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{st.role}</p>
              <Badge tone={st.tone}>Etapa {st.id}</Badge>
            </div>
            <p className="text-xs text-slate-500">Sesión: {actor} · {lists.queue.length} gestión(es) pendiente(s) en tu bandeja</p>
          </div>
        </div>
        {stage === 1 && (
          <button onClick={onNewRequest} className="btn-primary"><Plus className="h-4 w-4" /> Nueva gestión</button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* Bandeja */}
        <div className="card flex max-h-[calc(100vh-240px)] min-h-96 flex-col overflow-hidden lg:sticky lg:top-24">
          <div className="flex border-b border-slate-200 px-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-3 text-xs font-medium transition ${tab === t.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {t.label}
                <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-600">{lists[t.id].length}</span>
                {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-brand-600" />}
              </button>
            ))}
          </div>
          <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {list.length === 0 && (
              <EmptyState
                icon={Inbox}
                title={tab === 'queue' ? 'Bandeja al día' : 'Sin registros'}
                description={tab === 'queue' ? 'No hay gestiones pendientes en esta etapa.' : 'Aún no hay gestiones procesadas.'}
              />
            )}
            {list.map((r) => {
              const active = r.id === selected?.id;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => setSelectedId(r.id)}
                    className={`relative block w-full px-4 py-3.5 text-left transition-colors ${active ? 'bg-slate-50' : 'hover:bg-slate-50/60'}`}
                  >
                    {active && <span className="absolute inset-y-0 left-0 w-0.5 bg-brand-600" />}
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">{r.business.name}</p>
                      <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(r.history?.at(-1)?.at || r.createdAt)}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{fullName(r)}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-slate-500">{r.id}</span>
                      <HardwareTag hardware={r.hardware} />
                      {tab === 'sent' && <StatusBadge request={r} />}
                      {r.returned && tab === 'queue' && <Badge tone="amber">Devuelta</Badge>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Área de trabajo */}
        <div className="min-w-0 space-y-5">
          {!selected ? (
            <div className="card">
              <EmptyState icon={st.icon} title="Selecciona una gestión" description="Elige una gestión de la bandeja para comenzar a trabajarla." />
            </div>
          ) : (
            <>
              <div className="card">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar name={selected.business.name} size="lg" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">{selected.business.name}</h2>
                        <StatusBadge request={selected} />
                      </div>
                      <p className="text-xs text-slate-500">
                        <span className="font-mono">{selected.id}</span> · {selected.business.tradeType} · Creada {formatDateTime(selected.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => onOpenDetail(selected.id)} className="btn-secondary btn-sm shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" /> Expediente completo
                  </button>
                </div>
                <div className="border-t border-slate-100 px-5 py-5">
                  <StageStepper request={selected} />
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 px-5 py-4 md:grid-cols-4">
                  <KV label="Solicitante">{fullName(selected)}</KV>
                  <KV label="NIT" mono>{selected.customer.nit}</KV>
                  <KV label="DPI / CUI" mono>{selected.customer.dpi}</KV>
                  <KV label="Terminal">{getHardware(selected.hardware)?.label} · {getHardware(selected.hardware)?.detail}</KV>
                  <div className="col-span-2 md:col-span-4">
                    <dt className="kv-label mb-1">Tipos de venta</dt>
                    <SaleTypeChips types={selected.saleTypes} />
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600 md:col-span-4">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />{selected.business.address}</span>
                    <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />{selected.customer.email}</span>
                    <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />{selected.customer.phone}</span>
                  </div>
                </dl>
              </div>

              <Panel
                key={selected.id}
                request={selected}
                readOnly={!isActionable}
                actor={actor}
                applyChange={applyChange}
                toast={toast}
                onViewDocument={(type) => onViewDocument(type, selected)}
                onEditRequest={() => onEditRequest(selected)}
                onOpenDetail={() => onOpenDetail(selected.id)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
