package com.pos.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "terminales")
public class Terminal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroSerie;
    private String tid; // Terminal ID
    
    // IP, GPRS, Inalambrico
    private String tipoConexion; 
    
    // VHQ, AS400, CSP
    private String sistemaSubyacente; 

    @ManyToOne
    @JoinColumn(name = "afiliado_id")
    private Afiliado afiliado;
}
