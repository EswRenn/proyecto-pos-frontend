import React from 'react';
import { Lock } from 'lucide-react';

export default function PanelCard({ title, subtitle, icon: Icon, badge, readOnly, children, footer, footerNote }) {
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div>
            <p className="card-title">{title}</p>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          {readOnly && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              <Lock className="h-3 w-3" /> Solo lectura
            </span>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{footerNote}</p>
          <div className="flex shrink-0 items-center gap-2">{footer}</div>
        </div>
      )}
    </div>
  );
}

export function Checklist({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2.5 text-xs">
          <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${it.ok ? 'bg-emerald-500 text-white' : 'border border-slate-300 text-transparent'}`}>✓</span>
          <span className={it.ok ? 'text-slate-700' : 'text-slate-500'}>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Timeline({ history }) {
  return (
    <ol className="space-y-0">
      {[...history].reverse().map((h, i, arr) => (
        <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
          {i < arr.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200" />}
          <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white ${i === 0 ? 'bg-brand-600' : 'bg-slate-300'}`} />
          <div>
            <p className="text-xs font-medium text-slate-800">{h.action}</p>
            <p className="text-[11px] text-slate-500">
              Etapa {h.stage} · {h.by} · {new Date(h.at).toLocaleString('es-GT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
