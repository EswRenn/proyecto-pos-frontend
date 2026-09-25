import React from 'react';
import { X, Eye } from 'lucide-react';
import { SlideOver, StageStepper, StatusBadge, KV, SaleTypeChips, Badge } from './ui';
import { Timeline } from './stages/PanelCard';
import { SALE_TYPES, SYSTEMS, SHIFTS, getHardware, getStage, fullName, formatDateTime, formatDate } from '../lib/workflow';

function Section({ n, title, pending, children }) {
  return (
    <section className="border-t border-slate-100 px-6 py-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900"><span className="mr-2 text-slate-400">{n}</span>{title}</p>
        {pending && <Badge>Pendiente</Badge>}
      </div>
      {pending ? <p className="text-xs text-slate-500">Esta etapa aún no se ha completado.</p> : children}
    </section>
  );
}

export default function RequestDetailDrawer({ request: r, onClose, onViewDocument }) {
  if (!r) return <SlideOver open={false} onClose={onClose} />;
  const hw = getHardware(r.hardware);
  const types = SALE_TYPES.filter((t) => r.saleTypes.includes(t.key));
  const docStatusTone = { aprobado: 'emerald', rechazado: 'amber', pendiente: 'slate' };

  return (
    <SlideOver open onClose={onClose}>
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-slate-500">{r.id}</p>
            <h2 className="truncate text-lg font-semibold text-slate-900">{r.business.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge request={r} />
              <span className="text-xs text-slate-500">{r.completed ? 'Flujo cerrado' : `Responsable: ${getStage(r.stage).role}`}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon"><X className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="px-6 py-6"><StageStepper request={r} /></div>

      <Section n="01" title="Servicio al cliente">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <KV label="Solicitante">{fullName(r)}</KV>
          <KV label="NIT" mono>{r.customer.nit}</KV>
          <KV label="DPI / CUI" mono>{r.customer.dpi}</KV>
          <KV label="Correo">{r.customer.email}</KV>
          <KV label="Teléfono">{r.customer.phone}</KV>
          <KV label="Tipo de comercio">{r.business.tradeType}</KV>
          <div className="col-span-2 md:col-span-3"><KV label="Dirección">{r.business.address}</KV></div>
          <KV label="Terminal">{hw.label} · {hw.detail}</KV>
          <div className="col-span-2"><dt className="kv-label mb-1">Tipos de venta</dt><SaleTypeChips types={r.saleTypes} /></div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {[['DPI', 'dpi', 'Foto del DPI'], ['PATENTE', 'patente', 'Patente de comercio']].map(([type, key, label]) => (
            <button key={key} disabled={!r.documents[key]?.name} onClick={() => onViewDocument(type, r)} className="btn-secondary btn-sm">
              <Eye className="h-3.5 w-3.5" /> {label}
              <Badge tone={docStatusTone[r.documents[key]?.status || 'pendiente']}>{r.documents[key]?.name ? r.documents[key].status : 'sin cargar'}</Badge>
            </button>
          ))}
        </div>
      </Section>

      <Section n="02" title="Validación y afiliados" pending={r.stage < 3 && !r.completed}>
        <div className="grid grid-cols-3 gap-3">
          {types.map((t) => (
            <div key={t.key} className="rounded-lg border border-slate-200 p-3">
              <p className="kv-label">{t.label}</p>
              <p className="font-mono text-base font-semibold tracking-wider text-slate-900">{r.affiliates[t.key]}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Validado por {r.validation?.by} · {formatDateTime(r.validation?.at)}</p>
      </Section>

      <Section n="03" title="Programación" pending={r.stage < 4 && !r.completed}>
        <div className="space-y-3">
          {hw.systems.map((s) => {
            const p = r.programming[s];
            return (
              <div key={s} className="rounded-lg border border-slate-200 p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900">{SYSTEMS[s].name}</p>
                  <Badge tone="emerald" dot>Registrado</Badge>
                </div>
                <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {s === 'vhq' && <>
                    <KV label="Serie POS" mono>{p.serial}</KV>
                    {types.map((t) => <KV key={t.key} label={`ID ${t.label}`} mono>{p.terminals[t.key]}</KV>)}
                  </>}
                  {s === 'as400' && <>
                    <KV label="ID serie" mono>{p.serial}</KV>
                    {types.map((t) => <KV key={t.key} label={t.label} mono>{t.as400}</KV>)}
                  </>}
                  {s === 'mipos' && <>
                    {types.map((t) => <KV key={t.key} label={`Terminal ${t.label}`} mono>{p.terminals[t.key]}</KV>)}
                    <KV label="Lector ID" mono>{r.hardware === 'hit' ? 'Sin lector (HIT)' : p.readerId}</KV>
                  </>}
                  {s === 'csp' && <>
                    <KV label="Moneda">{p.currency}</KV>
                    <KV label="Transacción" mono>{p.transactionType}</KV>
                    <KV label="Cierre" mono>{p.closingTime}</KV>
                    <div className="col-span-2 md:col-span-3"><KV label="Rango de bines" mono>{p.binFrom} a {p.binTo}</KV></div>
                  </>}
                </dl>
              </div>
            );
          })}
        </div>
      </Section>

      <Section n="04" title="Entrega" pending={r.stage < 5 && !r.completed}>
        <dl className="grid grid-cols-2 gap-4">
          <KV label="Visita">{formatDate(r.delivery.date)}</KV>
          <KV label="Jornada">{SHIFTS[r.delivery.shift]}</KV>
          <KV label="Técnico">{r.delivery.technician}</KV>
          <KV label="Despachado">{formatDateTime(r.delivery.dispatchedAt)}</KV>
          <div className="col-span-2"><KV label="Dirección">{r.delivery.address}</KV></div>
        </dl>
      </Section>

      <Section n="05" title="Instalación" pending={!r.completed}>
        <dl className="grid grid-cols-2 gap-4">
          <KV label="Confirmada">{formatDateTime(r.installation?.confirmedAt)}</KV>
          <KV label="Recibido por">{r.installation?.receivedBy}</KV>
        </dl>
      </Section>

      <section className="border-t border-slate-100 bg-slate-50/60 px-6 py-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">Bitácora</p>
        <Timeline history={r.history || []} />
      </section>
    </SlideOver>
  );
}
