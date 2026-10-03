package com.pos.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "afiliados")
public class Afiliado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 8, unique = true)
    private String numeroAfiliado;

    @OneToOne
    @JoinColumn(name = "solicitud_id")
    private Solicitud solicitud;
}
