package com.pos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "solicitudes")
public class Solicitud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String giroNegocio;
    private String datosFiscales;
    
    // cuotas, puntos o venta normal
    private String modalidadPos;
    
    // Pendiente, Aprobada, Rechazada
    private String estado; 

    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
