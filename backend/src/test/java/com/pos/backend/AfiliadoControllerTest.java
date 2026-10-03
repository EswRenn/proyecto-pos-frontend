package com.pos.backend;

import com.pos.backend.controller.AfiliadoController;
import com.pos.backend.model.Afiliado;
import com.pos.backend.repository.AfiliadoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AfiliadoControllerTest {

    @Mock
    private AfiliadoRepository repository;

    @InjectMocks
    private AfiliadoController controller;

    @Test
    public void testGeneracionAfiliado8Digitos() {
        // Arrange: mockear el repositorio para que retorne lo que se le pase
        when(repository.save(any(Afiliado.class))).thenAnswer(i -> i.getArguments()[0]);
        
        Afiliado req = new Afiliado();

        // Act: llamar al controlador
        Afiliado res = controller.create(req);

        // Assert: validar que generó el string y tiene exactamente 8 dígitos
        assertNotNull(res.getNumeroAfiliado(), "El afiliado no debe ser nulo");
        assertEquals(8, res.getNumeroAfiliado().length(), "Debe tener exactamente 8 dígitos");
        assertTrue(res.getNumeroAfiliado().matches("\\d{8}"), "Deben ser puros números");
    }
}
