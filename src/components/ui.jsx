import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { STAGES, TONES, getSaleType, getHardware, requestStatus, initials } from '../lib/workflow';

export function Badge({ tone = 'slate', dot = false, className = '', children }) {
  const t = TONES[tone] || TONES.slate;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${t.soft} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ request }) {
  const s = requestStatus(request);
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
}

export function SaleTypeChips({ types }) {
  return (
    <div className="flex flex-wrap gap-1">
      {types.map((k) => (
        <span key={k} className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
          {getSaleType(k)?.label}
        </span>
      ))}
    </div>
  );
}

export function HardwareTag({ hardware }) {
  const hw = getHardware(hardware);
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
      {hw?.label}
    </span>
  );
}

export function Avatar({ name, size = 'md', className = '' }) {
  const s = size === 'sm' ? 'h-7 w-7 text-[10px]' : size === 'lg' ? 'h-11 w-11 text-sm' : 'h-9 w-9 text-xs';
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-slate-900 font-semibold text-white ${s} ${className}`}>
      {initials(name)}
    </span>
  );
}

// Progreso compacto por etapa (para tablas)
export function MiniProgress({ request }) {
  return (
    <div className="flex items-center gap-1" title={`Etapa ${request.stage} de 5`}>
      {STAGES.map((s) => {
        const done = request.completed || s.id < request.stage;
        const current = !request.completed && s.id === request.stage;
        return (
          <span
            key={s.id}
            className={`h-1.5 w-5 rounded-full ${done ? 'bg-emerald-500' : current ? TONES[s.tone].bar : 'bg-slate-200'}`}
          />
        );
      })}
    </div>
  );
}

// Stepper horizontal del flujo completo
export function StageStepper({ request, compact = false }) {
  return (
    <ol className="flex w-full items-start">
      {STAGES.map((s, i) => {
        const done = request.completed || s.id < request.stage;
        const current = !request.completed && s.id === request.stage;
        const Icon = s.icon;
        return (
          <li key={s.id} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && (
              <span className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${done || current ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                done
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : current
                    ? 'border-brand-600 bg-white text-brand-600 ring-4 ring-brand-100'
                    : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" />}
            </span>
            {!compact && (
              <>
                <span className={`mt-2 text-[11px] font-semibold ${current ? 'text-slate-900' : done ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s.short}
                </span>
                <span className="text-[10px] text-slate-400">Etapa {s.id}</span>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function Modal({ open, onClose, title, subtitle, icon: Icon, size = 'lg', children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const width = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 pt-[6vh] backdrop-blur-[2px] animate-fade-in" onMouseDown={onClose}>
      <div className={`card w-full ${width} shadow-xl animate-pop-in`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" />
              </span>
            )}
            <div>
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Cerrar"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50/60 px-6 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function SlideOver({ open, onClose, children, width = 'max-w-2xl' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 animate-fade-in" onMouseDown={onClose}>
      <div className={`h-full w-full ${width} overflow-y-auto bg-white shadow-2xl animate-slide-in-right`} onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({ label, required, error, help, className = '', children }) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-brand-600">*</span>}
        </label>
      )}
      {children}
      {error ? <p className="error">{error}</p> : help ? <p className="help">{help}</p> : null}
    </div>
  );
}

export function KV({ label, children, mono = false }) {
  return (
    <div className="min-w-0">
      <dt className="kv-label">{label}</dt>
      <dd className={`kv-value truncate ${mono ? 'font-mono text-[13px]' : ''}`}>{children || <span className="text-slate-400">—</span>}</dd>
    </div>
  );
}

export function Callout({ tone = 'slate', icon: Icon, children, className = '' }) {
  const styles = {
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  }[tone];
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs ${styles} ${className}`}>
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0" />}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

export function Toasts({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto card flex items-start gap-3 px-4 py-3 shadow-lg animate-pop-in">
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${t.tone === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="text-slate-400 hover:text-slate-700"><X className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}
