import { emptyProgramming } from '../lib/workflow';

const doc = (name, status = 'pendiente') => ({ name, url: '', status });

const h = (at, stage, action, by) => ({ at, stage, action, by });

function programmingFor(hardware, saleTypes, seed, done) {
  const p = emptyProgramming();
  if (!done) return p;
  if (hardware === 'inalambrico' || hardware === 'ip') {
    p.vhq = {
      serial: `VG0${seed} - 1355664877${seed}87`,
      terminals: {
        normal: saleTypes.includes('normal') ? `VG00${seed}1` : '',
        cuotas: saleTypes.includes('cuotas') ? `VG00${seed}2` : '',
        puntos: saleTypes.includes('puntos') ? `VG00${seed}3` : '',
      },
      done: true,
    };
  } else {
    p.mipos = {
      terminals: {
        normal: saleTypes.includes('normal') ? `MPG0${seed}1` : '',
        cuotas: saleTypes.includes('cuotas') ? `MPG0${seed}2` : '',
        puntos: saleTypes.includes('puntos') ? `MPG0${seed}3` : '',
      },
      contactName: '',
      email: '',
      phone: '',
      readerId: hardware === 'hit' ? '' : `MPOS20211${seed}78`,
      done: true,
    };
    p.csp = { currency: 'GTQ', transactionType: '0003', closingTime: '2230', binFrom: '400000000', binTo: '499999999', done: true };
  }
  p.as400 = { serial: `VG0${seed}`, done: true };
  return p;
}

export const initialRequests = [
  {
    id: 'POS-2026-008',
    createdAt: '2026-09-23T09:10:00-06:00',
    customer: { firstName: 'Jorge Luis', lastName: 'Ajquí Tzul', nit: '6612093-1', dpi: '2987 11234 0901', email: 'jorge@visionclara.gt', phone: '+502 7765-2210' },
    business: { name: 'Óptica Visión Clara', tradeType: 'Farmacia y salud', address: '14 Avenida 5-20 Zona 1, Quetzaltenango' },
    hardware: 'hit',
    saleTypes: ['normal', 'cuotas'],
    stage: 3,
    completed: false,
    documents: { dpi: doc('dpi_jorge_ajqui.jpg', 'aprobado'), patente: doc('patente_vision_clara.pdf', 'aprobado') },
    affiliates: { normal: '12887410', cuotas: '12239054', puntos: '' },
    validation: { by: 'Marta Fuentes', at: '2026-09-23T11:05:00-06:00', notes: '' },
    programming: emptyProgramming(),
    delivery: { date: '', shift: 'AM', technician: '', address: '14 Avenida 5-20 Zona 1, Quetzaltenango', notes: '' },
    installation: null,
    history: [
      h('2026-09-23T09:10:00-06:00', 1, 'Gestión creada', 'Ana López'),
      h('2026-09-23T09:18:00-06:00', 1, 'Enviada a validación', 'Ana López'),
      h('2026-09-23T11:05:00-06:00', 2, 'Documentos aprobados y afiliados creados', 'Marta Fuentes'),
    ],
  },
  {
    id: 'POS-2026-007',
    createdAt: '2026-09-23T08:30:00-06:00',
    customer: { firstName: 'Lucía', lastName: 'Herrera Paz', nit: '9921034-7', dpi: '3011 45678 0101', email: 'lucia@baristaxela.com', phone: '+502 5521-8890' },
    business: { name: 'Café Barista Xela', tradeType: 'Restaurante y gastronomía', address: 'Diagonal 6 13-01 Zona 10, Guatemala' },
    hardware: 'ip',
    saleTypes: ['normal'],
    stage: 1,
    completed: false,
    documents: { dpi: doc('dpi_lucia_herrera.jpg'), patente: doc('') },
    affiliates: { normal: '', cuotas: '', puntos: '' },
    validation: null,
    programming: emptyProgramming(),
    delivery: { date: '', shift: 'AM', technician: '', address: 'Diagonal 6 13-01 Zona 10, Guatemala', notes: '' },
    installation: null,
    history: [h('2026-09-23T08:30:00-06:00', 1, 'Gestión creada (borrador)', 'Ana López')],
  },
  {
    id: 'POS-2026-006',
    createdAt: '2026-09-19T10:00:00-06:00',
    customer: { firstName: 'Andrea', lastName: 'Monzón Rivera', nit: '7745120-9', dpi: '2210 98765 0301', email: 'reservas@casamaya.gt', phone: '+502 7832-4455' },
    business: { name: 'Hotel Casa Maya Antigua', tradeType: 'Hotel y turismo', address: '5a Avenida Norte 22, Antigua Guatemala' },
    hardware: 'mipos',
    saleTypes: ['normal', 'cuotas', 'puntos'],
    stage: 5,
    completed: false,
    documents: { dpi: doc('dpi_andrea_monzon.jpg', 'aprobado'), patente: doc('patente_casa_maya.pdf', 'aprobado') },
    affiliates: { normal: '12451190', cuotas: '12230981', puntos: '45452277' },
    validation: { by: 'Marta Fuentes', at: '2026-09-19T14:20:00-06:00', notes: '' },
    programming: programmingFor('mipos', ['normal', 'cuotas', 'puntos'], '3225', true),
    delivery: { date: '2026-09-24', shift: 'AM', technician: 'Karla Méndez', address: '5a Avenida Norte 22, Antigua Guatemala', notes: 'Preguntar por recepción', dispatchedAt: '2026-09-22T16:00:00-06:00' },
    installation: null,
    history: [
      h('2026-09-19T10:00:00-06:00', 1, 'Gestión creada', 'Ana López'),
      h('2026-09-19T10:12:00-06:00', 1, 'Enviada a validación', 'Ana López'),
      h('2026-09-19T14:20:00-06:00', 2, 'Documentos aprobados y afiliados creados', 'Marta Fuentes'),
      h('2026-09-21T11:40:00-06:00', 3, 'Programación completada (Backend Mipos, CSP, AS400)', 'José Ramírez'),
      h('2026-09-22T16:00:00-06:00', 4, 'Visita programada y POS despachado', 'Luis Pérez'),
    ],
  },
  {
    id: 'POS-2026-005',
    createdAt: '2026-09-22T15:40:00-06:00',
    customer: { firstName: 'Pedro Antonio', lastName: 'Xoy Chen', nit: '5519023-4', dpi: '2654 12098 1601', email: 'ventas@elmartillo.gt', phone: '+502 4410-3321' },
    business: { name: 'Ferretería El Martillo', tradeType: 'Ferretería y construcción', address: 'Km 18.5 Carretera a El Salvador, Fraijanes' },
    hardware: 'inalambrico',
    saleTypes: ['normal', 'cuotas'],
    stage: 1,
    completed: false,
    documents: { dpi: doc('dpi_pedro_xoy.jpg'), patente: doc('patente_el_martillo.pdf') },
    affiliates: { normal: '', cuotas: '', puntos: '' },
    validation: null,
    programming: emptyProgramming(),
    delivery: { date: '', shift: 'AM', technician: '', address: 'Km 18.5 Carretera a El Salvador, Fraijanes', notes: '' },
    installation: null,
    history: [h('2026-09-22T15:40:00-06:00', 1, 'Gestión creada (borrador)', 'Ana López')],
  },
  {
    id: 'POS-2026-004',
    createdAt: '2026-09-16T11:15:00-06:00',
    customer: { firstName: 'María Reneé', lastName: 'Salazar Díaz', nit: '5543219-0', dpi: '2541 33211 0301', email: 'bistro@antiguagourmet.com', phone: '+502 7832-1100' },
    business: { name: 'Bistro Gourmet Antigua', tradeType: 'Restaurante y gastronomía', address: 'Calle del Arco No. 15, Antigua Guatemala' },
    hardware: 'hit',
    saleTypes: ['normal', 'cuotas', 'puntos'],
    stage: 5,
    completed: true,
    documents: { dpi: doc('dpi_maria_salazar.jpg', 'aprobado'), patente: doc('patente_bistro.pdf', 'aprobado') },
    affiliates: { normal: '33445566', cuotas: '77889900', puntos: '11223344' },
    validation: { by: 'Marta Fuentes', at: '2026-09-16T13:30:00-06:00', notes: '' },
    programming: programmingFor('hit', ['normal', 'cuotas', 'puntos'], '7721', true),
    delivery: { date: '2026-09-22', shift: 'PM', technician: 'Roberto Gómez', address: 'Calle del Arco No. 15, Antigua Guatemala', notes: '', dispatchedAt: '2026-09-18T09:00:00-06:00' },
    installation: { confirmedAt: '2026-09-22T16:30:00-06:00', receivedBy: 'María Reneé Salazar', notes: 'Instalado y probado en caja principal.', by: 'Roberto Gómez' },
    history: [
      h('2026-09-16T11:15:00-06:00', 1, 'Gestión creada', 'Ana López'),
      h('2026-09-16T11:30:00-06:00', 1, 'Enviada a validación', 'Ana López'),
      h('2026-09-16T13:30:00-06:00', 2, 'Documentos aprobados y afiliados creados', 'Marta Fuentes'),
      h('2026-09-17T10:05:00-06:00', 3, 'Programación completada (Backend, CSP, AS400)', 'José Ramírez'),
      h('2026-09-18T09:00:00-06:00', 4, 'Visita programada y POS despachado', 'Luis Pérez'),
      h('2026-09-22T16:30:00-06:00', 5, 'Instalación confirmada — gestión cerrada', 'Roberto Gómez'),
    ],
  },
  {
    id: 'POS-2026-003',
    createdAt: '2026-09-18T15:20:00-06:00',
    customer: { firstName: 'Fernando José', lastName: 'Castillo Ruiz', nit: '1290384-5', dpi: '1654 87654 0901', email: 'fcastillo@farmacialavida.com', phone: '+502 7761-9000' },
    business: { name: 'Farmacias La Vida', tradeType: 'Farmacia y salud', address: '12 Avenida 4-50 Zona 3, Quetzaltenango' },
    hardware: 'ip',
    saleTypes: ['normal', 'puntos'],
    stage: 4,
    completed: false,
    documents: { dpi: doc('dpi_fernando_castillo.jpg', 'aprobado'), patente: doc('patente_la_vida.pdf', 'aprobado') },
    affiliates: { normal: '88776655', cuotas: '', puntos: '99887766' },
    validation: { by: 'Marta Fuentes', at: '2026-09-18T16:50:00-06:00', notes: '' },
    programming: programmingFor('ip', ['normal', 'puntos'], '9123', true),
    delivery: { date: '', shift: 'AM', technician: '', address: '12 Avenida 4-50 Zona 3, Quetzaltenango', notes: '' },
    installation: null,
    history: [
      h('2026-09-18T15:20:00-06:00', 1, 'Gestión creada', 'Ana López'),
      h('2026-09-18T15:35:00-06:00', 1, 'Enviada a validación', 'Ana López'),
      h('2026-09-18T16:50:00-06:00', 2, 'Documentos aprobados y afiliados creados', 'Marta Fuentes'),
      h('2026-09-22T12:10:00-06:00', 3, 'Programación completada (VHQ, AS400)', 'José Ramírez'),
    ],
  },
  {
    id: 'POS-2026-002',
    createdAt: '2026-09-23T08:45:00-06:00',
    customer: { firstName: 'Sofía Isabel', lastName: 'Morales León', nit: '8912304-2', dpi: '2341 90123 0501', email: 'sofia@glamour.gt', phone: '+502 5544-7788' },
    business: { name: 'Boutique Glamour Escuintla', tradeType: 'Moda y calzado', address: '4a Calle 3-12 Zona 1, Escuintla' },
    hardware: 'mipos',
    saleTypes: ['normal', 'cuotas'],
    stage: 2,
    completed: false,
    documents: { dpi: doc('dpi_sofia_morales.jpg'), patente: doc('patente_glamour.pdf') },
    affiliates: { normal: '', cuotas: '', puntos: '' },
    validation: null,
    programming: emptyProgramming(),
    delivery: { date: '', shift: 'PM', technician: '', address: '4a Calle 3-12 Zona 1, Escuintla', notes: '' },
    installation: null,
    history: [
      h('2026-09-23T08:45:00-06:00', 1, 'Gestión creada', 'Ana López'),
      h('2026-09-23T09:02:00-06:00', 1, 'Enviada a validación', 'Ana López'),
    ],
  },
  {
    id: 'POS-2026-001',
    createdAt: '2026-09-22T10:30:00-06:00',
    customer: { firstName: 'Carlos Eduardo', lastName: 'Mendoza Pérez', nit: '4829105-8', dpi: '1982 45102 0101', email: 'cmendoza@elroble.gt', phone: '+502 5544-3322' },
    business: { name: 'Supermercados El Roble S.A.', tradeType: 'Supermercado y retail', address: 'Calzada Roosevelt 14-22 Zona 11, Guatemala' },
    hardware: 'inalambrico',
    saleTypes: ['normal', 'cuotas', 'puntos'],
    stage: 3,
    completed: false,
    documents: { dpi: doc('dpi_carlos_mendoza.jpg', 'aprobado'), patente: doc('patente_el_roble.pdf', 'aprobado') },
    affiliates: { normal: '12457845', cuotas: '12235877', puntos: '45454555' },
    validation: { by: 'Marta Fuentes', at: '2026-09-22T14:15:00-06:00', notes: '' },
    programming: emptyProgramming(),
    delivery: { date: '', shift: 'AM', technician: '', address: 'Calzada Roosevelt 14-22 Zona 11, Guatemala', notes: 'Entregar en caja 3' },
    installation: null,
    history: [
      h('2026-09-22T10:30:00-06:00', 1, 'Gestión creada', 'Ana López'),
      h('2026-09-22T10:45:00-06:00', 1, 'Enviada a validación', 'Ana López'),
      h('2026-09-22T14:15:00-06:00', 2, 'Documentos aprobados y afiliados creados', 'Marta Fuentes'),
    ],
  },
];

export const initialNotifications = [
  { id: 'n1', stage: 2, requestId: 'POS-2026-002', message: 'Nueva gestión pendiente de validación: Boutique Glamour Escuintla', at: '2026-09-23T09:02:00-06:00', read: false },
  { id: 'n2', stage: 3, requestId: 'POS-2026-008', message: 'Tienes pendiente una programación nueva: Óptica Visión Clara', at: '2026-09-23T11:05:00-06:00', read: false },
  { id: 'n3', stage: 3, requestId: 'POS-2026-001', message: 'Tienes pendiente una programación nueva: Supermercados El Roble S.A.', at: '2026-09-22T14:15:00-06:00', read: true },
  { id: 'n4', stage: 4, requestId: 'POS-2026-003', message: 'POS programado, listo para coordinar entrega: Farmacias La Vida', at: '2026-09-22T12:10:00-06:00', read: false },
  { id: 'n5', stage: 5, requestId: 'POS-2026-006', message: 'Visita asignada para el 24 sep (AM): Hotel Casa Maya Antigua', at: '2026-09-22T16:00:00-06:00', read: false },
];
