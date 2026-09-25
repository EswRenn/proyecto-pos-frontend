import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, FileText, ShieldCheck } from 'lucide-react';
import { Modal, Badge } from './ui';
import { fullName } from '../lib/workflow';

// Representación de muestra cuando el documento no tiene vista previa (datos de demo)
function SampleDpi({ request }) {
  return (
    <div className="relative flex aspect-[85/54] w-[420px] flex-col justify-between overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-5 text-slate-800 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">República de Guatemala · RENAP</span>
        <span className="text-[10px] font-semibold text-sky-700">DPI</span>
      </div>
      <div className="flex gap-4">
        <div className="flex h-24 w-20 items-center justify-center rounded-md bg-slate-200 text-lg font-semibold text-slate-500">
          {request.customer.firstName[0]}{request.customer.lastName[0]}
        </div>
        <div className="space-y-1.5 text-xs">
          <div><p className="text-[9px] uppercase text-slate-500">Nombre</p><p className="font-semibold">{fullName(request)}</p></div>
          <div><p className="text-[9px] uppercase text-slate-500">CUI</p><p className="font-mono font-semibold">{request.customer.dpi}</p></div>
          <div><p className="text-[9px] uppercase text-slate-500">Nacionalidad</p><p>Guatemalteca</p></div>
        </div>
      </div>
      <p className="text-[9px] text-slate-400">Imagen de muestra — prototipo</p>
    </div>
  );
}

function SamplePatente({ request }) {
  return (
    <div className="flex aspect-[1/1.3] w-[360px] flex-col justify-between rounded-md border border-slate-300 bg-[#fdfbf5] p-6 font-serif text-slate-800 shadow-lg">
      <div className="border-b border-slate-300 pb-3 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">Registro Mercantil General de la República</p>
        <p className="mt-1 text-base font-bold uppercase">Patente de Comercio</p>
        <p className="font-mono text-[10px] text-slate-500">Registro No. 1482910 · Folio 450 · Libro 98</p>
      </div>
      <p className="text-xs leading-relaxed">
        Se hace constar que <strong>{request.business.name}</strong>, con NIT <strong>{request.customer.nit}</strong>, cuyo propietario es
        {' '}<strong>{fullName(request)}</strong>, se encuentra inscrito para operar en el giro de <strong>{request.business.tradeType.toLowerCase()}</strong>,
        con dirección en {request.business.address}.
      </p>
      <div className="flex items-end justify-between text-[10px] text-slate-500">
        <span className="border-t border-dashed border-slate-400 pt-1">Registrador mercantil</span>
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-400 text-center text-[8px] uppercase">Sello</span>
      </div>
    </div>
  );
}

export default function DocumentViewerModal({ open, onClose, type, request }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  if (!open || !request) return null;

  const isDpi = type === 'DPI';
  const doc = isDpi ? request.documents.dpi : request.documents.patente;
  const tone = { aprobado: 'emerald', rechazado: 'amber', pendiente: 'slate' }[doc?.status || 'pendiente'];

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      icon={FileText}
      title={isDpi ? 'Documento Personal de Identificación' : 'Patente de comercio'}
      subtitle={`${request.business.name} · ${doc?.name || 'Sin archivo'}`}
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs text-slate-600"><ShieldCheck className="h-4 w-4 text-slate-400" /> Estado de revisión: <Badge tone={tone}>{doc?.status || 'pendiente'}</Badge></span>
          <button onClick={onClose} className="btn-secondary">Cerrar</button>
        </div>
      }
    >
      <div className="mb-3 flex justify-end">
        <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
          <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="btn-icon h-7 w-7"><ZoomOut className="h-4 w-4" /></button>
          <span className="w-12 text-center font-mono text-xs text-slate-600">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.2))} className="btn-icon h-7 w-7"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => setRotation((r) => (r + 90) % 360)} className="btn-icon h-7 w-7"><RotateCw className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-8">
        <div style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform .2s ease' }}>
          {doc?.url ? (
            <img src={doc.url} alt={doc.name} className="max-h-[380px] rounded-md shadow-lg" />
          ) : isDpi ? <SampleDpi request={request} /> : <SamplePatente request={request} />}
        </div>
      </div>
    </Modal>
  );
}
