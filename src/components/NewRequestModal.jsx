import React, { useState } from 'react';
import { X, Upload, CheckCircle, Shield, CreditCard, Building2, Store } from 'lucide-react';

export default function NewRequestModal({ isOpen, onClose, onCreateRequest }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientLastName: '',
    nit: '',
    dpi: '',
    businessName: '',
    tradeType: 'Restaurante y Gastronomía',
    posHardwareType: 'Inalámbrico',
    posTypes: ['VENTA NORMAL', 'CUOTAS'],
    dpiFile: null,
    patenteFile: null
  });

  if (!isOpen) return null;

  const handlePosTypeToggle = (type) => {
    if (formData.posTypes.includes(type)) {
      if (formData.posTypes.length > 1) {
        setFormData({
          ...formData,
          posTypes: formData.posTypes.filter(t => t !== type)
        });
      }
    } else {
      setFormData({
        ...formData,
        posTypes: [...formData.posTypes, type]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.nit || !formData.dpi) {
      alert("Por favor complete los campos obligatorios (Nombre, NIT, DPI)");
      return;
    }

    const newReq = {
      id: `POS-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: `${formData.clientName} ${formData.clientLastName}`.trim(),
      businessName: formData.businessName || `${formData.clientName} Comercio`,
      nit: formData.nit,
      dpi: formData.dpi,
      tradeType: formData.tradeType,
      posTypesRequested: formData.posTypes,
      posHardwareType: formData.posHardwareType,
      currentStage: 1,
      createdAt: new Date().toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' }),
      documents: {
        dpiUploaded: true,
        patenteUploaded: true
      },
      affiliates: { normal: '', cuotas: '', puntos: '', validatedBy: '', validatedAt: '' },
      programming: {
        vhq: { serialPos: '', idNormal: '', idCuotas: '', idPuntos: '', configured: false },
        as400: { serialId: '', ocgNormal: '', ocaCuotas: '', t002Puntos: '', configured: false },
        mipos: { terminalId: '', saleType: '', contactName: '', email: '', phone: '', lectorId: '', configured: false },
        csp: { saleId: '', currency: 'GTQ', transType: '0003', closingTime: '2230', binRange: '', contactless: true, chip: true, magStripe: false, configured: false }
      },
      delivery: { scheduledDate: '', shift: 'AM', technician: '', address: 'Dirección Comercial Registrada', notes: '' },
      completion: { installed: false, confirmedAt: null }
    };

    onCreateRequest(newReq);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 p-6 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit']">Etapa 1: Servicio al Cliente</h2>
              <p className="text-xs text-slate-400">Captura de datos del cliente para inicio de gestión POS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Datos Personales */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" /> Datos del Solicitante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="form-label">Nombre *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Juan Manuel"
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Apellido *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Perez Gomez"
                  value={formData.clientLastName}
                  onChange={e => setFormData({...formData, clientLastName: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">NIT *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. 7845120-9"
                  value={formData.nit}
                  onChange={e => setFormData({...formData, nit: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">DPI (CUI) *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. 1990 88210 0101"
                  value={formData.dpi}
                  onChange={e => setFormData({...formData, dpi: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Datos Empresa */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4" /> Empresa y Giro Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="form-label">Nombre Razón Social / Empresa *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Distribuidora Central S.A."
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Tipo de Comercio</label>
                <select 
                  value={formData.tradeType}
                  onChange={e => setFormData({...formData, tradeType: e.target.value})}
                  className="form-input"
                >
                  <option value="Supermercado y Retail">Supermercado y Retail</option>
                  <option value="Restaurante y Gastronomía">Restaurante y Gastronomía</option>
                  <option value="Farmacia y Salud">Farmacia y Salud</option>
                  <option value="Moda y Calzado">Moda y Calzado</option>
                  <option value="Servicios Profesionales">Servicios Profesionales</option>
                  <option value="Hotel y Turismo">Hotel y Turismo</option>
                </select>
              </div>

              <div>
                <label className="form-label">Modelo de Terminal POS</label>
                <select 
                  value={formData.posHardwareType}
                  onChange={e => setFormData({...formData, posHardwareType: e.target.value})}
                  className="form-input"
                >
                  <option value="Inalámbrico">POS Inalámbrico (Cellular / GPRS)</option>
                  <option value="IP">POS IP (Conexión LAN Ethernet)</option>
                  <option value="Mipos">Mipos (Lector móvil con smartphone)</option>
                  <option value="HIT">HIT (Integrado Host to Terminal sin lector)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tipo de POS que quiere el cliente */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Tipos de Transacciones POS Solicitadas
            </h3>
            <p className="text-xs text-slate-400">Seleccione los tipos de venta requeridos por el comercio:</p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {['VENTA NORMAL', 'CUOTAS', 'PUNTOS'].map((type) => {
                const isSelected = formData.posTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePosTypeToggle(type)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      isSelected 
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10' 
                        : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-rose-400 bg-rose-500' : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adjunto de Documentos (Patente y DPI) */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4" /> Documentación Digitalizada
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-dashed border-slate-700 hover:border-rose-500/50 p-3 rounded-xl text-center cursor-pointer transition bg-slate-900/40">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-xs text-slate-300 font-semibold block">Adjuntar Foto DPI</span>
                <span className="text-[10px] text-slate-500">PDF, JPG o PNG (Max 5MB)</span>
              </div>
              <div className="border border-dashed border-slate-700 hover:border-rose-500/50 p-3 rounded-xl text-center cursor-pointer transition bg-slate-900/40">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-xs text-slate-300 font-semibold block">Adjuntar Patente Comercio</span>
                <span className="text-[10px] text-slate-500">PDF, JPG o PNG (Max 5MB)</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary text-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Crear Gestión POS (Etapa 1 Iniciada)</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
