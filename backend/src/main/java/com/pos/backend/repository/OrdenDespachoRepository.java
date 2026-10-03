package com.pos.backend.repository;

import com.pos.backend.model.OrdenDespacho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenDespachoRepository extends JpaRepository<OrdenDespacho, Long> {
}
