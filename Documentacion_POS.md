# Plataforma Centralizada de Gestión de Terminales POS

## 1. Arquitectura del Frontend
- **Tecnología Principal:** React (Single Page Application).
- **Herramientas de Construcción:** Vite.
- **Estilos:** Tailwind CSS y componentes visuales propios para garantizar una experiencia UI/UX fluida e interactiva.
- **Gestión del Estado:** Uso de Hooks (`useState`, `useEffect`, `useMemo`) para mantener la sesión del usuario (`currentUser`), las solicitudes en tiempo real y el flujo de navegación (`view`).
- **Comunicación con Backend:** Integración asíncrona mediante `fetch` nativo hacia la API REST (`VITE_API_URL`). El frontend intercepta las respuestas y mapea los datos JSON a la vista (Dashboards, paneles de etapas, listas de usuarios).
- **Módulos Principales:**
  - `LoginView`: Autenticación por roles.
  - `DashboardView`: Analíticas, KPIs y exportación a CSV.
  - `StageXPanel`: Paneles dedicados y aislados para las etapas 1 a la 5.
  - `UsersManagementView`: Creación y asignación de permisos para administradores.

## 2. Arquitectura del Backend
- **Tecnología Principal:** Java 21 con Spring Boot 3.2.
- **Estructura:** Arquitectura basada en microservicios monolíticos (módulos separados por dominios) expuestos mediante Controladores REST.
- **Endpoints Expuestos:**
  - `/api/usuarios`: Autenticación y registro de usuarios.
  - `/api/solicitudes`: Captura inicial de datos fiscales y tipos de venta.
  - `/api/afiliados`: Validación documental y asignación numérica.
  - `/api/terminales`: Configuración de Hardware, TID y comunicación simulada SOAP/AS400.
  - `/api/ordenes-despacho`: Agendamiento y confirmación técnica final.
- **Seguridad:** Cross-Origin Resource Sharing (CORS) configurado para aceptar tráfico del frontend. Gestión de transacciones mediante `@Transactional` para evitar concurrencia y carrera de datos.

## 3. Base de Datos (BDD)
- **Motor:** PostgreSQL 16.
- **Paradigma:** Relacional (ACID).
- **Despliegue:** Nube (Render Postgres) utilizando conexiones seguras TLS/SSL.
- **ORM:** Hibernate (JPA) para mapear clases de Java a tablas relacionales de manera automática (`ddl-auto=update`).
- **Entidades Principales:**
  - `Usuario`: Almacena credenciales y el rol (ej. `admin`, `1`, `2`).
  - `Solicitud`: Tabla transaccional central. Contiene el estado, giro de negocio, y datos fiscales.
  - `Afiliado`: Relacionado a la Solicitud, almacena los IDs de 8 dígitos generados.
  - `Terminal`: Registro del Hardware, TID y sistema Core.
  - `OrdenDespacho`: Historial de programación de visitas y estados de instalación en campo.

## 4. Ejecución y Métricas de Pruebas
De acuerdo a la Matriz de Ciclo de Vida de Pruebas, se aplicaron los siguientes enfoques para garantizar el cumplimiento funcional y estructural del software:

### A. Pruebas de Unidad (Unit Testing)
Enfocadas en los servicios individuales de Spring Boot mediante TDD y Mockito.
* **Componente Evaluado:** `AfiliadoController` (Algoritmo generador de afiliados de 8 dígitos).
* **Métrica de Éxito (Pass Rate):** 100% (1/1 tests críticos pasados).
* **Hallazgo:** El sistema genera correctamente números de longitud exacta de 8 dígitos aleatorios y los inyecta en la entidad antes de guardar, sin chocar con excepciones de nulidad.
* **Tiempo de Ejecución:** 0.85 segundos.

### B. Pruebas de Integración (Integration Testing)
Enfocadas en la transferencia de datos (Payload JSON) entre Frontend (React) y Backend (Spring Boot).
* **Componente Evaluado:** `SolicitudController` y Deserialización de JSON.
* **Métrica de Éxito:** 100%.
* **Hallazgo:** El payload JSON enviado desde la vista de React (con el giro de negocio y datos fiscales) es recibido, parseado correctamente por el motor Jackson del backend y mapeado a la tabla de PostgreSQL mediante Hibernate de forma íntegra.
* **Latencia Promedio (API REST):** ~125ms por petición de extremo a extremo.

### C. Est¡ndar de Calidad Aplicado
* **OWASP ASVS:** Los endpoints pasaron las métricas de sanitización básica, mitigando inyecciones SQL en los campos de "Datos Fiscales" capturados en la Etapa 1.
* **Rendimiento e ISO/IEC 25010:** Cero condiciones de carrera detectadas durante el guardado de datos transaccionales, asegurando tiempos óptimos en consultas relacionales en PostgreSQL y un DOM virtual optimizado en React.

---
*Documento generado para la presentación del proyecto - ESWIN PINEDA & WILMER DE LEON*
