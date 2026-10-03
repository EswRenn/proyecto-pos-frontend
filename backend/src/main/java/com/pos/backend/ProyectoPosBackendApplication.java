package com.pos.backend;

import com.pos.backend.model.Usuario;
import com.pos.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class ProyectoPosBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoPosBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Usuario admin = new Usuario(); admin.setUsername("Administrador"); admin.setPassword("12345"); admin.setRole("admin");
                Usuario et1 = new Usuario(); et1.setUsername("Etapa1"); et1.setPassword("12345"); et1.setRole("1");
                Usuario et2 = new Usuario(); et2.setUsername("Etapa2"); et2.setPassword("12345"); et2.setRole("2");
                Usuario et3 = new Usuario(); et3.setUsername("Etapa3"); et3.setPassword("12345"); et3.setRole("3");
                Usuario et4 = new Usuario(); et4.setUsername("Etapa4"); et4.setPassword("12345"); et4.setRole("4");
                Usuario et5 = new Usuario(); et5.setUsername("Etapa5"); et5.setPassword("12345"); et5.setRole("5");
                
                repository.saveAll(List.of(admin, et1, et2, et3, et4, et5));
                System.out.println("Usuarios por defecto creados.");
            }
        };
    }
}
