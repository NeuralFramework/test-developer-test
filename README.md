# Guía Rápida para Desplegar la API de Inventario y Compras

La app es una API REST en Node.js con Express, Sequelize para la DB (MySQL en este caso), JWT para auth, y roles de Admin (que maneja productos y ve compras) vs Cliente (que compra y ve su historial). Todo empaquetado en Docker.

## 1. Clonando el Repositorio desde GitHub

Si no tienes Git instalado, ve a [git-scm.com](https://git-scm.com/) y descárgalo (es gratis y rápido). Asumimos que ya lo tienes.

Abre tu terminal (en Windows usa Git Bash o PowerShell, en Mac/Linux la de siempre) y haz lo siguiente:

```bash
# Ve a la carpeta donde quieres guardar el proyecto (ej: tu carpeta de desarrollo)
cd ~/Documentos/proyectos

# Clona el repo. Esto copia todo el código desde GitHub a tu máquina local
git clone https://github.com/NeuralFramework/test-developer-test.git

# Entra al directorio recién clonado
cd test-developer-test
```


Una vez clonado, verifica con `ls` (o `dir` en Windows): verás carpetas como `config/`, `models/`, `controllers/`, y el `docker-compose.yaml` en la raíz. Si no ves algo, repite nuevamente el proceso de clonado.

## 2. Ejecutando Docker Compose para Levantar la App en Contenedores

Docker! Si no lo tienes, bájatelo de [docker.com](https://www.docker.com/products/docker-desktop) (elige tu OS). Es como una caja mágica que corre todo aislado.

El archivo `docker-compose.yaml` está en la raíz del proyecto (lo confirmamos: define dos servicios – `db` para MySQL y `api` para Node.js). Este archivo le dice a Docker qué contenedores armar, cómo conectarlos y con qué puertos.

En tu terminal, desde la raíz del proyecto (`test-developer-test`), ejecuta:

```bash
# Levanta todo en modo detached (fondo, sin bloquear tu terminal) y construye las imágenes si no existen
docker compose up -d --build # en su ultima versión

# Verifica que todo esté corriendo (debe mostrar 4/4 servicios up)
docker compose ps
```
 
**Para parar todo:** `docker-compose down`. Si quieres borrar datos de DB, agrega `-v` (¡cuidado, pierde todo!).

¡Ya está corriendo! La app en `http://localhost:3000`.

## 3. Sincronizando Modelos con la Base de Datos Usando Sequelize CLI

Sequelize es el ORM que maneja los modelos (Usuario, Producto, etc.). Para crear las tablas, usamos migraciones. Como estamos en Docker, ejecutamos el comando **dentro del contenedor de la app**.

Desde la raíz del proyecto:

```bash
# Entra al contenedor de la API (app-node es el nombre del servicio en docker-compose.yaml)
docker exec -it app-node npx sequelize-cli db:migrate
```

**Resultado esperado:**
```
== 20241030000000-create-usuario.js: Migrating ===============================

[INFO] Migration successful!

== 20241030000000-create-usuario.js: Migration Succeeded =====================

[INFO] All migrations successful!
```

Si ves errores (ej. conexión DB fallida), chequea logs con `docker-compose logs app-mysql`. ¡Las tablas ya están listas para insertar datos!

## 4. Acceso a phpMyAdmin para Ver la Info y Estructura de la DB

PhpMyAdmin es como un explorador gráfico para MySQL.

**Acceso:** Abre tu browser y ve a `http://localhost`.

## 5. Acceso a la Documentación de apiDoc

¡La doc automática! apiDoc genera HTML con todos los endpoints, params, ejemplos y errores. En el proyecto, corre en el contenedor, pero expuesto en un puerto fijo.

**Acceso:** Abre `http://localhost:8000` en tu browser.

## 6. Listado de Endpoints Configurados en apiDoc (con Paths y Ejemplos curl)

**Todos los endpoints clave** basados en la config de apiDoc, confirmo paths exactos, métodos, y ejemplos con `curl` (asumiendo server en `localhost:3000`). Incluyo bodies JSON, headers, y respuestas posibles (éxito/error). Usa un cliente como Insomnia ó Postman para probar.

**Nota general:**
- Todos devuelven JSON.
- Auth: Para protegidos, primero login y usa `Authorization: Bearer <token>`.
- Errores comunes: 401 (sin token), 403 (rol malo), 400 (validación), 404 (no encontrado), 500 (servidor).

### Grupo: Autenticación (Sin auth requerida)

| Método | Path | Descripción | Ejemplo curl | Respuesta Éxito | Posible Error |
|--------|------|-------------|--------------|-----------------|---------------|
| POST | `/api/auth/login` | Login y obtén JWT | `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@inventario.com","password":"admin123"}'` | `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}` (200 OK) | `{"message": "Credenciales inválidas"}` (401) |
| POST | `/api/auth/register` | Registra nuevo user (pruebas) | `curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"nuevo@ej.com","password":"pass123","nombre":"Juan","rol":"Cliente"}'` | `{"id":3,"email":"nuevo@ej.com","rol":"Cliente"}` (201 Created) | `{"errors": [{"msg": "Email inválido"}]} ` (400) |

### Grupo: Usuarios (Requiere token + rol Admin)

| Método | Path | Descripción | Ejemplo curl | Respuesta Éxito | Posible Error |
|--------|------|-------------|--------------|-----------------|---------------|
| GET | `/api/usuarios` | Lista todos | `TOKEN=ey...; curl -X GET http://localhost:3000/api/usuarios -H "Authorization: Bearer $TOKEN"` | `[{"id":1,"email":"admin@...","nombre":"Admin","rol":"Administrador"}]` (200 OK) | `{"message": "Requiere rol Administrador"}` (403) |
| GET | `/api/usuarios/:id` | Uno por ID | `curl -X GET http://localhost:3000/api/usuarios/1 -H "Authorization: Bearer $TOKEN"` | `{"id":1,"email":"admin@...","rol":"Administrador"}` (200) | `{"message": "Usuario no encontrado"}` (404) |
| POST | `/api/usuarios` | Crea uno | `curl -X POST http://localhost:3000/api/usuarios -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"email":"nuevo@ej.com","password":"pass123","nombre":"Ana","rol":"Cliente"}'` | `{"id":4,"email":"nuevo@ej.com","rol":"Cliente"}` (201) | `{"message": "Contraseña debe tener al menos 5 caracteres"}` (400) |
| PUT | `/api/usuarios/:id` | Actualiza | `curl -X PUT http://localhost:3000/api/usuarios/1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nombre":"Admin Actualizado"}'` | `{"id":1,"nombre":"Admin Actualizado","rol":"Administrador"}` (200) | `{"message": "Usuario no encontrado"}` (404) |
| DELETE | `/api/usuarios/:id` | Borra | `curl -X DELETE http://localhost:3000/api/usuarios/1 -H "Authorization: Bearer $TOKEN"` | (204 No Content) | `{"message": "Usuario no encontrado"}` (404) |

### Grupo: Productos (Requiere token + rol Admin)

| Método | Path | Descripción | Ejemplo curl | Respuesta Éxito | Posible Error |
|--------|------|-------------|--------------|-----------------|---------------|
| GET | `/api/productos` | Lista todos | `curl -X GET http://localhost:3000/api/productos -H "Authorization: Bearer $TOKEN"` | `[{"id":1,"lote":"L001","nombre":"Laptop","precio":"1200.00","cantidad":5,"fechaIngreso":"2025-10-30T00:00:00.000Z"}]` (200) | `{"message": "Requiere rol Administrador"}` (403) |
| GET | `/api/productos/:id` | Uno por ID | `curl -X GET http://localhost:3000/api/productos/1 -H "Authorization: Bearer $TOKEN"` | `{"id":1,"nombre":"Laptop",...}` (200) | `{"message": "Producto no encontrado"}` (404) |
| POST | `/api/productos` | Crea | `curl -X POST http://localhost:3000/api/productos -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"lote":"L002","nombre":"Mouse","precio":25.50,"cantidad":10}'` | `{"id":2,"lote":"L002","nombre":"Mouse",...}` (201) | `{"message": "Precio debe ser >= 0"}` (400) |
| PUT | `/api/productos/:id` | Actualiza | `curl -X PUT http://localhost:3000/api/productos/1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"cantidad":3}'` | `{"id":1,"cantidad":3,...}` (200) | `{"message": "Producto no encontrado"}` (404) |
| DELETE | `/api/productos/:id` | Borra | `curl -X DELETE http://localhost:3000/api/productos/1 -H "Authorization: Bearer $TOKEN"` | (204) | `{"message": "Producto no encontrado"}` (404) |

### Grupo: Compras (Requiere token; Admin ve todas, Cliente solo suyas)

| Método | Path | Descripción | Ejemplo curl | Respuesta Éxito | Posible Error |
|--------|------|-------------|--------------|-----------------|---------------|
| POST | `/api/compras` | Realiza compra (Cliente) | `curl -X POST http://localhost:3000/api/compras -H "Authorization: Bearer $TOKEN_CLIENTE" -H "Content-Type: application/json" -d '{"productos":[{"productoId":1,"cantidad":2},{"productoId":2,"cantidad":1}]}'` | `{"compraId":5,"total":"2451.00"}` (201) | `{"message": "Stock insuficiente para Laptop"}` (400) |
| GET | `/api/compras/factura/:id` | Factura (Cliente) | `curl -X GET http://localhost:3000/api/compras/factura/5 -H "Authorization: Bearer $TOKEN_CLIENTE"` | `{"id":5,"total":"2451.00","DetalleCompras":[{...}],"Usuario":{...}}` (200) | `{"message": "Compra no encontrada"}` (404) |
| GET | `/api/compras/historial` | Historial (Cliente) | `curl -X GET http://localhost:3000/api/compras/historial -H "Authorization: Bearer $TOKEN_CLIENTE"` | `[{"id":5,"total":"2451.00","DetalleCompras":[...]}]` (200) | (Vacío si no hay compras) |
| GET | `/api/compras` | Todas (Admin) | `curl -X GET http://localhost:3000/api/compras -H "Authorization: Bearer $TOKEN_ADMIN"` | `[{"id":5,"total":"2451.00","Usuario":{...},"DetalleCompras":[...]}]` (200) | `{"message": "Requiere rol Administrador"}` (403) |

**Tip final:** Reemplaza `$TOKEN` con uno real de login.