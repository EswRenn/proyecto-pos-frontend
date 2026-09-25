import { FileText, ShieldCheck, Cpu, Truck, CheckCircle2 } from 'lucide-react';

// Etapas del flujo (documento QA + propuesta técnica)
export const STAGES = [
  {
    id: 1,
    name: 'Servicio al Cliente',
    short: 'Captura',
    status: 'Iniciada',
    role: 'Ejecutivo de Servicio al Cliente',
    user: 'Ana López',
    icon: FileText,
    tone: 'blue',
    description: 'Captura de datos del cliente, documentos (DPI y patente) y tipos de venta solicitados.',
  },
  {
    id: 2,
    name: 'Validación de Documentos',
    short: 'Validación',
    status: 'En validación',
    role: 'Validador de Documentos',
    user: 'Marta Fuentes',
    icon: ShieldCheck,
    tone: 'amber',
    description: 'Revisión de documentos cargados y creación de afiliados numéricos de 8 dígitos por tipo de venta.',
  },
  {
    id: 3,
    name: 'Programación',
    short: 'Programación',
    status: 'En proceso',
    role: 'Programador de Sistemas',
    user: 'José Ramírez',
    icon: Cpu,
    tone: 'violet',
    description: 'Configuración del POS en VHQ, AS400, Backend Mipos y CSP según el tipo de terminal.',
  },
  {
    id: 4,
    name: 'Entrega',
    short: 'Entrega',
    status: 'En entrega',
    role: 'Coordinador de Despacho',
    user: 'Luis Pérez',
    icon: Truck,
    tone: 'cyan',
    description: 'Programación de la visita en día hábil (AM/PM) y envío del POS a la dirección del cliente.',
  },
  {
    id: 5,
    name: 'Instalación',
    short: 'Instalación',
    status: 'Pendiente de instalación',
    role: 'Técnico de Campo',
    user: 'Roberto Gómez',
    icon: CheckCircle2,
    tone: 'emerald',
    description: 'El técnico visita al comercio, instala el POS y confirma su funcionamiento.',
  },
];

export const getStage = (id) => STAGES.find((s) => s.id === id);

// Clases por tono (Tailwind necesita las clases completas para detectarlas)
export const TONES = {
  blue: { dot: 'bg-blue-500', soft: 'bg-blue-50 text-blue-700 ring-blue-600/15', text: 'text-blue-600', bar: 'bg-blue-500', iconBg: 'bg-blue-50 text-blue-600' },
  amber: { dot: 'bg-amber-500', soft: 'bg-amber-50 text-amber-800 ring-amber-600/20', text: 'text-amber-600', bar: 'bg-amber-500', iconBg: 'bg-amber-50 text-amber-600' },
  violet: { dot: 'bg-violet-500', soft: 'bg-violet-50 text-violet-700 ring-violet-600/15', text: 'text-violet-600', bar: 'bg-violet-500', iconBg: 'bg-violet-50 text-violet-600' },
  cyan: { dot: 'bg-cyan-500', soft: 'bg-cyan-50 text-cyan-800 ring-cyan-600/20', text: 'text-cyan-600', bar: 'bg-cyan-500', iconBg: 'bg-cyan-50 text-cyan-700' },
  emerald: { dot: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', text: 'text-emerald-600', bar: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
  slate: { dot: 'bg-slate-400', soft: 'bg-slate-100 text-slate-700 ring-slate-500/15', text: 'text-slate-600', bar: 'bg-slate-400', iconBg: 'bg-slate-100 text-slate-600' },
};

// Tipos de venta y su mapeo a sistemas legados
export const SALE_TYPES = [
  { key: 'normal', label: 'Venta normal', as400: 'OCG', entryMode: 'Sin contacto', vhqSuffix: 1 },
  { key: 'cuotas', label: 'Cuotas', as400: 'OCA', entryMode: 'Chip', vhqSuffix: 2 },
  { key: 'puntos', label: 'Puntos', as400: 'T 002', entryMode: 'Banda', vhqSuffix: 3 },
];
export const getSaleType = (key) => SALE_TYPES.find((s) => s.key === key);

// Tipos de terminal POS y los sistemas que se programan en etapa 3
export const HARDWARE = [
  { key: 'inalambrico', label: 'Inalámbrico', detail: 'Terminal celular / GPRS', systems: ['vhq', 'as400'] },
  { key: 'ip', label: 'IP', detail: 'Terminal con conexión LAN', systems: ['vhq', 'as400'] },
  { key: 'mipos', label: 'Mipos', detail: 'Lector móvil enlazado a correo', systems: ['mipos', 'csp', 'as400'] },
  { key: 'hit', label: 'HIT', detail: 'Igual a Mipos, sin lector', systems: ['mipos', 'csp', 'as400'] },
];
export const getHardware = (key) => HARDWARE.find((h) => h.key === key);

export const SYSTEMS = {
  vhq: { key: 'vhq', name: 'VHQ', kind: 'Página web', protocol: 'REST', description: 'Registro de la serie del POS e IDs de terminal por tipo de venta.' },
  as400: { key: 'as400', name: 'AS400', kind: 'Alta en mainframe', protocol: 'SOAP', description: 'Alta de la serie con los códigos OCG (venta), OCA (cuotas) y T 002 (puntos).' },
  mipos: { key: 'mipos', name: 'Backend Mipos', kind: 'Página web', protocol: 'REST', description: 'Una terminal por tipo de transacción, datos de contacto y lector enlazado al correo.' },
  csp: { key: 'csp', name: 'CSP', kind: 'Página web', protocol: 'REST', description: 'Parámetros de venta: moneda, transacción 0003, hora de cierre y rango de bines.' },
};

export const TRADE_TYPES = [
  'Supermercado y retail',
  'Restaurante y gastronomía',
  'Farmacia y salud',
  'Moda y calzado',
  'Servicios profesionales',
  'Hotel y turismo',
  'Ferretería y construcción',
  'Otro',
];

export const TECHNICIANS = ['Roberto Gómez', 'Mario Álvarez', 'Karla Méndez', 'Diego Castillo'];

export const SHIFTS = {
  AM: 'AM · 08:00 – 12:00',
  PM: 'PM · 13:00 – 17:00',
};

// ---------- Helpers ----------

export const nowISO = () => new Date().toISOString();

export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDate(isoOrYmd) {
  if (!isoOrYmd) return '—';
  const d = isoOrYmd.length === 10 ? new Date(`${isoOrYmd}T12:00:00`) : new Date(isoOrYmd);
  return d.toLocaleDateString('es-GT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

export const fullName = (req) => `${req.customer.firstName} ${req.customer.lastName}`.trim();

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export const isValidAffiliate = (v) => /^\d{8}$/.test(v || '');

export const randomDigits = (n) => Array.from({ length: n }, (_, i) => (i === 0 ? 1 + Math.floor(Math.random() * 9) : Math.floor(Math.random() * 10))).join('');

// Días hábiles (lunes a viernes)
export const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function isBusinessDay(ymd) {
  if (!ymd) return false;
  const day = new Date(`${ymd}T12:00:00`).getDay();
  return day !== 0 && day !== 6;
}

export function nextBusinessDays(count = 5, from = new Date()) {
  const days = [];
  const d = new Date(from);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(toYMD(d));
  }
  return days;
}

export function requestStatus(req) {
  if (req.completed) return { label: 'Instalado', tone: 'emerald' };
  if (req.returned) return { label: 'Devuelta a etapa 1', tone: 'slate' };
  const st = getStage(req.stage);
  return { label: st.status, tone: st.tone };
}

export function searchMatches(req, q) {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  return [
    req.id, fullName(req), req.business.name, req.customer.nit, req.customer.dpi,
    ...Object.values(req.affiliates || {}),
    req.programming?.vhq?.serial, req.programming?.as400?.serial,
  ].some((v) => v && String(v).toLowerCase().includes(s));
}

export function newRequestId(existing) {
  const max = existing.reduce((m, r) => Math.max(m, Number(r.id.split('-')[2]) || 0), 0);
  return `POS-2026-${String(max + 1).padStart(3, '0')}`;
}

export function emptyProgramming() {
  return {
    vhq: { serial: '', terminals: { normal: '', cuotas: '', puntos: '' }, done: false },
    as400: { serial: '', done: false },
    mipos: { terminals: { normal: '', cuotas: '', puntos: '' }, contactName: '', email: '', phone: '', readerId: '', done: false },
    csp: { currency: 'GTQ', transactionType: '0003', closingTime: '2230', binFrom: '', binTo: '', done: false },
  };
}
