import React from 'react';
import { Globe, Terminal, Smartphone, Server, ArrowDown } from 'lucide-react';
import { HARDWARE, SYSTEMS, SALE_TYPES } from '../lib/workflow';
import { Badge } from './ui';

const ICONS = { vhq: Globe, as400: Terminal, mipos: Smartphone, csp: Server };

const FIELDS = {
  vhq: [['ID serie POS', 'VG04566 - 13556648778987'], ['ID venta normal', 'VG000001'], ['ID cuotas', 'VG000002'], ['ID puntos', 'VG000003']],
  as400: [['ID de la serie', 'VG04566'], ['Venta normal', 'OCG'], ['Cuotas', 'OCA'], ['Puntos', 'T 002']],
  mipos: [['ID terminal (uno por tipo de venta)', 'MPG03225'], ['Contacto', 'Nombre, correo, teléfono'], ['Lector ID (enlazado al correo)', 'MPOS2021124578'], ['HIT', 'Mismo proceso, sin lector']],
  csp: [['ID venta · nombre · moneda', 'Afiliado · GTQ'], ['Tipo de transacción', '0003'], ['Hora de cierre', '2230'], ['Ranqueo de bines', '999999999 a 999999999']],
};

export default function LegacySystemsViewer() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="section-title">Unificación de plataformas</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">Un solo flujo para cuatro sistemas</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Antes, cada gestión requería ingresar manualmente a varias páginas web y consolas. La plataforma centraliza la captura en la
          etapa 3 y el API Gateway distribuye la información a cada sistema mediante adaptadores REST (modernos) y SOAP (legados).
        </p>
      </div>

      {/* Matriz terminal → sistemas */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <div>
            <p className="card-title">Sistemas por tipo de terminal</p>
            <p className="card-subtitle">Qué se programa en la etapa 3 según el POS solicitado</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Terminal</th>
                {Object.values(SYSTEMS).map((s) => <th key={s.key} className="text-center">{s.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {HARDWARE.map((h) => (
                <tr key={h.key}>
                  <td><p className="font-medium text-slate-900">{h.label}</p><p className="text-xs text-slate-500">{h.detail}</p></td>
                  {Object.keys(SYSTEMS).map((k) => {
                    const idx = h.systems.indexOf(k);
                    return (
                      <td key={k} className="text-center">
                        {idx >= 0 ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">{idx + 1}</span> : <span className="text-slate-300">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500">El número indica el orden de registro. El AS400 siempre cierra la programación con el alta de los códigos por tipo de venta.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {Object.values(SYSTEMS).map((s) => {
          const Icon = ICONS[s.key];
          return (
            <div key={s.key} className="card">
              <div className="card-header">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white"><Icon className="h-4 w-4" /></span>
                  <div>
                    <p className="card-title">{s.name}</p>
                    <p className="card-subtitle">{s.kind}</p>
                  </div>
                </div>
                <Badge tone={s.protocol === 'SOAP' ? 'amber' : 'blue'}>{s.protocol}</Badge>
              </div>
              <div className="p-5">
                <p className="mb-4 text-xs text-slate-600">{s.description}</p>
                <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                  {FIELDS[s.key].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 px-3.5 py-2">
                      <dt className="text-xs text-slate-500">{k}</dt>
                      <dd className="text-right font-mono text-xs font-medium text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <p className="card-title mb-4">Flujo de integración</p>
        <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
          {[
            ['Frontend React', 'Formulario unificado de etapa 3'],
            ['API Gateway', 'Kong Enterprise / Spring Cloud Gateway'],
            ['Microservicios Java 21 · Spring Boot 3.2', 'Orquestación y adaptadores REST / SOAP'],
            ['VHQ · AS400 · Backend Mipos · CSP', 'Alta sin intervención manual'],
          ].map(([t, d], i, arr) => (
            <React.Fragment key={t}>
              <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{t}</p>
                <p className="text-[11px] text-slate-500">{d}</p>
              </div>
              {i < arr.length - 1 && <ArrowDown className="h-4 w-4 text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SALE_TYPES.map((t) => (
            <span key={t.key} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-700">{t.label}: AS400 {t.as400} · CSP {t.entryMode.toLowerCase()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
