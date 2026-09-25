import React, { useRef, useState } from 'react';
import { FilePlus2, Pencil, UploadCloud, FileImage, X, Save, Send, Check } from 'lucide-react';
import { Modal, Field, Callout } from './ui';
import { TRADE_TYPES, HARDWARE, SALE_TYPES, emptyProgramming } from '../lib/workflow';

const EMPTY = {
  firstName: '', lastName: '', nit: '', dpi: '', email: '', phone: '',
  businessName: '', tradeType: TRADE_TYPES[0], address: '',
  hardware: 'inalambrico', saleTypes: ['normal'],
  dpiDoc: null, patenteDoc: null,
};

const MAX_PREVIEW = 1.5 * 1024 * 1024; // se guarda vista previa solo de archivos pequeños

function formatDpi(v) {
  const d = v.replace(/\D/g, '').slice(0, 13);
  return [d.slice(0, 4), d.slice(4, 9), d.slice(9, 13)].filter(Boolean).join(' ');
}

function UploadBox({ label, hint, value, onChange, error }) {
  const input = useRef(null);
  const pick = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('El archivo supera 5 MB'); return; }
    const base = { name: file.name, size: file.size, type: file.type, status: 'pendiente', url: '' };
    if (file.type.startsWith('image/') && file.size <= MAX_PREVIEW) {
      const reader = new FileReader();
      reader.onload = () => onChange({ ...base, url: reader.result });
      reader.readAsDataURL(file);
    } else onChange(base);
  };
  return (
    <div>
      <p className="label">{label} <span className="text-brand-600">*</span></p>
      {value?.name ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          {value.url ? (
            <img src={value.url} alt="" className="h-12 w-16 rounded-md object-cover" />
          ) : (
            <span className="flex h-12 w-16 items-center justify-center rounded-md bg-white text-slate-400"><FileImage className="h-5 w-5" /></span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-900">{value.name}</p>
            <p className="text-[11px] text-slate-500">{value.size ? `${(value.size / 1024).toFixed(0)} KB · ` : ''}Cargado</p>
          </div>
          <button type="button" onClick={() => onChange(null)} className="btn-icon"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
          className={`flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-5 text-center transition hover:border-brand-500 hover:bg-brand-50/40 ${error ? 'border-red-300 bg-red-50/40' : 'border-slate-300'}`}
        >
          <UploadCloud className="mb-1.5 h-5 w-5 text-slate-400" />
          <span className="text-xs font-medium text-slate-700">Arrastra o <span className="text-brand-600">selecciona un archivo</span></span>
          <span className="text-[11px] text-slate-500">{hint}</span>
        </button>
      )}
      <input ref={input} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default function RequestFormModal({ state, onClose, onCreate, onSave }) {
  const isEdit = state?.mode === 'edit';
  const [f, setF] = useState(() => {
    if (!isEdit) return EMPTY;
    const r = state.request;
    return {
      firstName: r.customer.firstName, lastName: r.customer.lastName, nit: r.customer.nit, dpi: r.customer.dpi,
      email: r.customer.email, phone: r.customer.phone, businessName: r.business.name, tradeType: r.business.tradeType,
      address: r.business.address, hardware: r.hardware, saleTypes: r.saleTypes,
      dpiDoc: r.documents.dpi?.name ? r.documents.dpi : null, patenteDoc: r.documents.patente?.name ? r.documents.patente : null,
    };
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = (requireDocs) => {
    const e = {};
    if (!f.firstName.trim()) e.firstName = 'Requerido';
    if (!f.lastName.trim()) e.lastName = 'Requerido';
    if (!/^\d{5,8}-?[\dkK]$/.test(f.nit.trim())) e.nit = 'NIT inválido (ej. 4829105-8)';
    if (f.dpi.replace(/\D/g, '').length !== 13) e.dpi = 'El CUI debe tener 13 dígitos';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Correo inválido';
    if (f.phone.replace(/\D/g, '').length < 8) e.phone = 'Teléfono inválido';
    if (!f.businessName.trim()) e.businessName = 'Requerido';
    if (!f.address.trim()) e.address = 'Requerida';
    if (!f.saleTypes.length) e.saleTypes = 'Selecciona al menos uno';
    if (requireDocs && !f.dpiDoc) e.dpiDoc = 'Carga la foto del DPI';
    if (requireDocs && !f.patenteDoc) e.patenteDoc = 'Carga la patente de comercio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const build = () => ({
    customer: { firstName: f.firstName.trim(), lastName: f.lastName.trim(), nit: f.nit.trim(), dpi: f.dpi, email: f.email.trim(), phone: f.phone.trim() },
    business: { name: f.businessName.trim(), tradeType: f.tradeType, address: f.address.trim() },
    hardware: f.hardware,
    saleTypes: SALE_TYPES.map((s) => s.key).filter((k) => f.saleTypes.includes(k)),
    documents: { dpi: f.dpiDoc || { name: '', url: '', status: 'pendiente' }, patente: f.patenteDoc || { name: '', url: '', status: 'pendiente' } },
  });

  const submit = (sendNow) => {
    if (!validate(sendNow)) return;
    if (isEdit) {
      onSave({ ...state.request, ...build() });
    } else {
      onCreate({
        ...build(),
        completed: false,
        affiliates: { normal: '', cuotas: '', puntos: '' },
        validation: null,
        programming: emptyProgramming(),
        delivery: { date: '', shift: 'AM', technician: '', address: f.address.trim(), notes: '' },
        installation: null,
      }, sendNow);
    }
    onClose();
  };

  const toggleSale = (k) => setF({ ...f, saleTypes: f.saleTypes.includes(k) ? f.saleTypes.filter((x) => x !== k) : [...f.saleTypes, k] });

  return (
    <Modal
      open={!!state}
      onClose={onClose}
      size="xl"
      icon={isEdit ? Pencil : FilePlus2}
      title={isEdit ? `Editar gestión ${state.request.id}` : 'Nueva gestión POS'}
      subtitle="Etapa 1 · Servicio al cliente — captura de datos del cliente"
      footer={
        isEdit ? (
          <>
            <button onClick={onClose} className="btn-secondary">Cancelar</button>
            <button onClick={() => submit(false)} className="btn-primary"><Save className="h-4 w-4" /> Guardar cambios</button>
          </>
        ) : (
          <>
            <button onClick={onClose} className="btn-ghost">Cancelar</button>
            <button onClick={() => submit(false)} className="btn-secondary"><Save className="h-4 w-4" /> Guardar borrador</button>
            <button onClick={() => submit(true)} className="btn-primary"><Send className="h-4 w-4" /> Crear y enviar a validación</button>
          </>
        )
      }
    >
      <div className="space-y-7">
        {Object.keys(errors).length > 0 && <Callout tone="red">Revisa los campos marcados antes de continuar.</Callout>}

        <section>
          <p className="section-title mb-3">Datos del solicitante</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Nombre" required error={errors.firstName}><input value={f.firstName} onChange={set('firstName')} className="input" placeholder="Juan Manuel" /></Field>
            <Field label="Apellido" required error={errors.lastName}><input value={f.lastName} onChange={set('lastName')} className="input" placeholder="Pérez Gómez" /></Field>
            <Field label="NIT" required error={errors.nit}><input value={f.nit} onChange={set('nit')} className="input font-mono" placeholder="4829105-8" /></Field>
            <Field label="DPI (CUI)" required error={errors.dpi}><input value={f.dpi} onChange={(e) => setF({ ...f, dpi: formatDpi(e.target.value) })} className="input font-mono" placeholder="1982 45102 0101" /></Field>
            <Field label="Correo electrónico" required error={errors.email}><input value={f.email} onChange={set('email')} className="input" placeholder="cliente@empresa.com" /></Field>
            <Field label="Teléfono" required error={errors.phone}><input value={f.phone} onChange={set('phone')} className="input" placeholder="+502 5555-0000" /></Field>
          </div>
        </section>

        <section>
          <p className="section-title mb-3">Empresa</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Razón social o nombre de la empresa" required error={errors.businessName} className="md:col-span-2"><input value={f.businessName} onChange={set('businessName')} className="input" placeholder="Distribuidora Central, S.A." /></Field>
            <Field label="Tipo de comercio" required>
              <select value={f.tradeType} onChange={set('tradeType')} className="input">{TRADE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </Field>
            <Field label="Dirección del comercio" required error={errors.address} className="md:col-span-3" help="Se usará como dirección de entrega del POS"><input value={f.address} onChange={set('address')} className="input" placeholder="Calzada Roosevelt 14-22 Zona 11, Guatemala" /></Field>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="section-title mb-3">Tipo de terminal</p>
            <div className="grid grid-cols-2 gap-2">
              {HARDWARE.map((h) => {
                const active = f.hardware === h.key;
                return (
                  <button key={h.key} type="button" onClick={() => setF({ ...f, hardware: h.key })}
                    className={`rounded-lg border px-3 py-2.5 text-left transition ${active ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className="block text-sm font-semibold text-slate-900">{h.label}</span>
                    <span className="block text-[11px] text-slate-500">{h.detail}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="section-title mb-3">Tipos de venta del POS</p>
            <div className="space-y-2">
              {SALE_TYPES.map((s) => {
                const active = f.saleTypes.includes(s.key);
                return (
                  <button key={s.key} type="button" onClick={() => toggleSale(s.key)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${active ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className={`flex h-4 w-4 items-center justify-center rounded border ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}`}>{active && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                    <span className="text-sm font-medium text-slate-900">{s.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.saleTypes && <p className="error">{errors.saleTypes}</p>}
          </div>
        </section>

        <section>
          <p className="section-title mb-3">Documentos</p>
          <div className="grid gap-4 md:grid-cols-2">
            <UploadBox label="Foto del DPI" hint="JPG, PNG o PDF · máx. 5 MB" value={f.dpiDoc} onChange={(v) => setF({ ...f, dpiDoc: v })} error={errors.dpiDoc} />
            <UploadBox label="Patente de comercio" hint="JPG, PNG o PDF · máx. 5 MB" value={f.patenteDoc} onChange={(v) => setF({ ...f, patenteDoc: v })} error={errors.patenteDoc} />
          </div>
          {!isEdit && <p className="help">Los documentos son obligatorios para enviar a validación; puedes guardar un borrador sin ellos.</p>}
        </section>
      </div>
    </Modal>
  );
}
