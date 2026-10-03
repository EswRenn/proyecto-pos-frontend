package com.pos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "ordenes_despacho")
public class OrdenDespacho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaHabil;
    private String jornada; // AM/PM
    private String estadoInstalacion; // Pendiente, Confirmacion de Instalacion

    @OneToOne
    @JoinColumn(name = "terminal_id")
    private Terminal terminal;
}
