package com.telpt.backend.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "isikud")
@Data

public class Isik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "isikud_id")
    private long id;

    @Column(name = "nimi", nullable = false)
    private String nimi;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "sunnipaev")
    private LocalDate sunnipaev;

    @Column(name = "isikukood", nullable = false)
    private String isikukood;
}
