import React from 'react';
import { FileText, Send, Pencil, Eye, AlertTriangle, MapPinned, FileImage } from 'lucide-react';
import PanelCard, { Checklist, Timeline } from './PanelCard';
import { Callout, Badge } from '../ui';
import { getStage, TONES } from '../../lib/workflow';

export function DocumentRow({ label, doc, onView, children }) {
  const uploaded = !!doc?.name;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${uploaded ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-500'}`}>
          <FileImage className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="truncate text-[11px] text-slate-500">{uploaded ? doc.name : 'No se ha cargado el documento'}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {children}
        {uploaded && (
          <button onClick={onView} className="btn-secondary btn-sm"><Eye className="h-3.5 w-3.5" /> Ver</button>
        )}
      </div>
    </div>
  );
}

export default function Stage1Panel({ request, readOnly, applyChange, toast, onViewDocument, onEditRequest }) {
  const c = request.customer;
  const checks = [
    { label: 'Nombre y apellido del solicitante', ok: !!(c.firstName && c.lastName) },
    { label: 'NIT y DPI registrados', ok: !!(c.nit && c.dpi) },
    { label: 'Razón social y tipo de comercio', ok: !!(request.business.name && request.business.tradeType) },
    { label: 'Foto del DPI cargada', ok: !!request.documents.dpi?.name },
    { label: 'Fotos de la patente de comercio cargadas', ok: !!request.documents.patente?.name },
    { label: 'Al menos un tipo de venta seleccionado', ok: request.saleTypes.length > 0 },
  ];
  const ready = checks.every((x) => x.ok);

  const send = () => {
    applyChange(
      request.id,
      (r) => ({ ...r, stage: 2, returned: null, documents: { dpi: { ...r.documents.dpi, status: 'pendiente' }, patente: { ...r.documents.patente, status: 'pendiente' } } }),
      { action: 'Enviada a validación', stage: 1, notify: { stage: 2, message: `Nueva gestión pendiente de validación: ${request.business.name}` } },
    );
    toast('Gestión enviada a validación', `${request.id} ahora está en la etapa 2`);
  };

  if (readOnly) {
    const st = getStage(request.stage);
    return (
      <PanelCard title="Seguimiento de la gestión" subtitle="La gestión ya fue enviada; la edición está bloqueada" icon={MapPinned} readOnly>
        <div className="grid gap-5 md:grid-cols-2">
          <div className={`rounded-lg border p-4 ${request.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
            <p className="section-title">Ubicación actual</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span className={`h-2 w-2 rounded-full ${request.completed ? 'bg-emerald-500' : TONES[st.tone].dot}`} />
              {request.completed ? 'POS instalado — gestión cerrada' : `Etapa ${st.id} · ${st.name}`}
            </p>
            <p className="mt-1 text-xs text-slate-500">{request.completed ? 'El técnico confirmó la instalación.' : `Responsable: ${st.role}`}</p>
          </div>
          <div>
            <p className="section-title mb-3">Historial</p>
            <Timeline history={request.history || []} />
          </div>
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard
      title="Revisión antes de enviar"
      subtitle="Verifica que la gestión esté completa para enviarla a validación de documentos"
      icon={FileText}
      badge={<Badge tone="blue">Iniciada</Badge>}
      footerNote={ready ? 'Al enviar, el validador recibirá una notificación y la gestión quedará bloqueada para edición.' : 'Completa los datos pendientes para poder enviar la gestión.'}
      footer={
        <>
          <button onClick={onEditRequest} className="btn-secondary"><Pencil className="h-4 w-4" /> Editar datos</button>
          <button onClick={send} disabled={!ready} className="btn-primary"><Send className="h-4 w-4" /> Enviar a validación</button>
        </>
      }
    >
      {request.returned && (
        <Callout tone="amber" icon={AlertTriangle} className="mb-5">
          <strong>Devuelta por validación:</strong> {request.returned.reason}
        </Callout>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="section-title mb-3">Documentos del cliente</p>
          <div className="space-y-2">
            <DocumentRow label="Foto del DPI" doc={request.documents.dpi} onView={() => onViewDocument('DPI')} />
            <DocumentRow label="Patente de comercio" doc={request.documents.patente} onView={() => onViewDocument('PATENTE')} />
          </div>
        </div>
        <div>
          <p className="section-title mb-3">Lista de verificación</p>
          <Checklist items={checks} />
        </div>
      </div>
    </PanelCard>
  );
}
