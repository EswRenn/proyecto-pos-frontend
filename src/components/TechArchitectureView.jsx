import React from 'react';
import { Layers, Server, Network, Database, Cloud, Container, ShieldCheck, Users, CalendarClock, Wallet, Award } from 'lucide-react';

const STACK = [
  { component: 'Frontend web', tech: 'React', icon: Layers },
  { component: 'Backend', tech: 'Java 21 / Spring Boot 3.2', icon: Server },
  { component: 'API Gateway', tech: 'Kong Enterprise / Spring Cloud Gateway', icon: Network },
  { component: 'Base de datos', tech: 'PostgreSQL 16 (ACID)', icon: Database },
  { component: 'Infraestructura', tech: 'Google Cloud (GCP)', icon: Cloud },
  { component: 'Contenedores', tech: 'Docker', icon: Container },
];

const STANDARDS = [
  { title: 'ISO/IEC 25010', subtitle: 'Calidad del producto', detail: 'Mantenibilidad, usabilidad y rendimiento del software.' },
  { title: 'OWASP ASVS v4.0', subtitle: 'Seguridad de la aplicación', detail: 'Estándar de verificación de seguridad para la aplicación web.' },
  { title: 'PCI-DSS v4.0', subtitle: 'Procesamiento de pagos', detail: 'Estándar obligatorio, crítico e innegociable para datos de tarjeta.' },
];

const TEAM = [
  { name: 'Eswin Pineda', role: 'Desarrollador Senior Frontend', id: '5190-15-901' },
  { name: 'Wilmer de León', role: 'Desarrollador Senior Backend', id: '5190-22-50' },
];

export default function TechArchitectureView() {
  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-title">Propuesta técnica</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Plataforma Centralizada de Gestión POS</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Plataforma B2B que unifica las páginas web de gestión en una sola aplicación con flujo de tareas por rol, basada en
            microservicios con APIs REST y SOAP para sistemas legados.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <Award className="h-5 w-5 text-slate-500" />
          <div className="text-xs">
            <p className="font-semibold text-slate-900">Aprobado por: Jefe de Desarrollo</p>
            <p className="text-slate-500">Fecha de revisión: 21/09/2026</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><p className="card-title">Herramientas de desarrollo y plataforma</p></div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
          {STACK.map((s) => (
            <div key={s.component} className="flex items-center gap-3 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><s.icon className="h-5 w-5" /></span>
              <div>
                <p className="kv-label">{s.component}</p>
                <p className="text-sm font-semibold text-slate-900">{s.tech}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {STANDARDS.map((s) => (
          <div key={s.title} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">{s.subtitle}</p>
              <ShieldCheck className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-base font-semibold text-slate-900">{s.title}</p>
            <p className="mt-1 text-xs text-slate-600">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="card">
          <div className="card-header"><p className="card-title flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /> Equipo</p></div>
          <ul className="divide-y divide-slate-100">
            {TEAM.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
                <span className="font-mono text-xs text-slate-500">{m.id}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Metodología Scrum · sprints de 2 a 3 semanas · prototipado en Figma</div>
        </div>

        <div className="card">
          <div className="card-header"><p className="card-title flex items-center gap-2"><Wallet className="h-4 w-4 text-slate-400" /> Costo y tiempo</p></div>
          <dl className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-5 py-3.5">
              <dt className="flex items-center gap-2 text-xs text-slate-500"><CalendarClock className="h-4 w-4" /> Tiempo estimado</dt>
              <dd className="text-sm font-semibold text-slate-900">3.5 a 4 meses</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <dt className="text-xs text-slate-500">Desarrollador Fullstack/Backend Senior</dt>
              <dd className="font-mono text-sm font-semibold text-slate-900">Q29,260</dd>
            </div>
            <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
              <dt className="text-xs font-medium text-slate-700">Inversión total (2 recursos × 4 meses)</dt>
              <dd className="font-mono text-sm font-semibold text-slate-900">$234,080 – $240,400</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
