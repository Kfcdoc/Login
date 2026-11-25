# Proyecto 2 — Aplicación Web Front-End con React y Vite

Aplicación web de una sola página (SPA) construida con **React 19** y **Vite**, que implementa manejo de sesión con **Context API + `useReducer`**, protección de rutas públicas y privadas con **React Router**, validación de formularios con **React Hook Form**, alertas con **SweetAlert2**, estilos con **Bootstrap 5** y consumo de la **API de Rick and Morty** mediante parámetros dinámicos en la URL.

---

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
| --- | --- |
| **React 19** | Construcción de componentes e interfaz de usuario |
| **Vite 8** | Servidor de desarrollo y empaquetador de producción |
| **React Router DOM 7** | Navegación SPA, parámetros dinámicos (`useParams`) y protección de rutas |
| **React Hook Form 7** | Manejo y validación de formularios sin eventos manuales (`register`, `handleSubmit`, `errors`) |
| **SweetAlert2** | Alertas modales de confirmación y bienvenida |
| **Bootstrap 5** | Diseño responsivo y componentes visuales |
| **ESLint** | Análisis estático y verificación de buenas prácticas |

---

## Estructura del proyecto

```text
Proyecto-2/
├── .env                                # Variable de entorno con la URL base de la API
├── index.html                          # Documento HTML base (#root)
├── package.json                        # Dependencias y scripts de npm
├── vite.config.js                      # Configuración de Vite
└── src/
    ├── main.jsx                        # Punto de entrada: monta <Provider> y <App />
    ├── App.jsx                         # Re-exporta el enrutador principal (src/assets/App.jsx)
    ├── index.css                       # Estilos globales
    ├── context/
    │   ├── type.js                     # Constantes de acciones (login, logout)
    │   ├── Contexto.jsx                # Creación del Contexto de React
    │   ├── MiReducer.jsx               # Reducer que actualiza el estado de sesión
    │   └── Provider.jsx                # Proveedor global: expone estado, login() y cerrar_sesion()
    └── assets/
        ├── App.jsx                     # Definición de rutas públicas y privadas
        ├── routes/
        │   ├── RutasPrivadas.jsx       # Permite acceso solo si hay usuario autenticado
        │   └── RutasPublicas.jsx       # Permite acceso solo si NO hay usuario autenticado
        └── pages/
            ├── Login.jsx               # Inicio de sesión con validación y alerta
            ├── Register.jsx            # Registro de cuenta nueva
            ├── Home.jsx                # Pantalla principal, saludo al usuario y personaje por ID
            ├── Usuarios.jsx            # Vista de usuario usando parámetro :nombre
            └── Error.jsx               # Página 404 para rutas no existentes
```

---

## Configuración e instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

El archivo `.env` en la raíz del proyecto define la URL base de la API de Rick and Morty:

```env
VITE_API_URL = https://rickandmortyapi.com/api/character
```

Vite expone las variables que comienzan con `VITE_` a través de `import.meta.env.VITE_API_URL`.

### 3. Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo local (por defecto en `http://localhost:5173`) |
| `npm run build` | Compila la aplicación optimizada para producción en la carpeta `dist/` |
| `npm run preview` | Previsualiza localmente la compilación generada en `dist/` |
| `npm run lint` | Ejecuta ESLint para revisar errores o advertencias en el código |

---

## Cómo funciona la aplicación

### 1. Arranque de la aplicación

1. `index.html` carga el módulo `/src/main.jsx`.
2. `src/main.jsx` importa Bootstrap (`css` y `js`) y renderiza `<App />` envuelto dentro de `<Provider>` y `<StrictMode>`.
3. Esto permite que cualquier página o ruta acceda al estado de sesión compartido mediante `useContext(Contexto)`.

---

### 2. Manejo de estado y autenticación (`src/context/`)

La autenticación funciona del lado del cliente combinando **Context API**, **`useReducer`** y **`localStorage`**:

- **`type.js`**: Define los tipos de acción disponibles (`type.login` y `type.logout`).
- **`Contexto.jsx`**: Crea el contexto con `createContext()`.
- **`MiReducer.jsx`**: Recibe `(state, action)` y actualiza el estado:
  - `type.login` → devuelve `{ logged: true, usuario: action.payload }`.
  - `type.logout` → devuelve `{ logged: false, usuario: null }`.
- **`Provider.jsx`**:
  - Usa `inicio()` como función inicializadora de `useReducer`: lee `localStorage.getItem('usuario')` y lo convierte con `JSON.parse(user)` para mantener la sesión activa al recargar la página.
  - `login(sesion)`: guarda la sesión en `localStorage` bajo la clave `'usuario'` y despacha la acción `type.login`.
  - `cerrar_sesion()`: elimina `'usuario'` de `localStorage` y despacha `type.logout`.
  - Expone `{ ...logeado, login, cerrar_sesion }` a toda la aplicación.

---

### 3. Sistema de rutas y protección (`src/assets/App.jsx` y `src/assets/routes/`)

Las rutas se definen con `BrowserRouter`, `Routes` y `Route`:

| Ruta | Tipo | Componente | Descripción |
| --- | --- | --- | --- |
| `/` | Privada | `Home` | Inicio; muestra el personaje `#1` por defecto |
| `/personaje/:id` | Privada | `Home` | Muestra el personaje cuyo ID coincide con `:id` |
| `/usuario/:nombre` | Privada | `Usuarios` | Muestra el parámetro `:nombre` recibido en la URL |
| `/login` | Pública | `Login` | Formulario de inicio de sesión |
| `/registro` | Pública | `Register` | Formulario de registro de usuario |
| `*` | Cualquiera | `Error` | Página `404` cuando la ruta no existe |

- **`RutasPrivadas.jsx`**: Consulta `usuario` desde `Contexto`. Si existe, renderiza `{children}`; si no, redirige a `/login` con `<Navigate to="/login" />`.
- **`RutasPublicas.jsx`**: Consulta `usuario` desde `Contexto`. Si **no** existe, renderiza `{children}`; si ya inició sesión, redirige a `/` con `<Navigate to="/" />`.

---

### 4. Páginas y flujo del usuario

#### Registro (`Register.jsx`)
- Utiliza `useForm()` (`register`, `handleSubmit`, `formState: { errors }`) con el objeto `validacion` para exigir `nombre`, `email` y `password`.
- Al enviar (`onSubmit(data)`):
  1. Guarda `{ nombre, email }` en `localStorage` bajo la clave `'usuarios_registrados'` (para recordar el nombre en futuros inicios de sesión).
  2. Llama a `login({ nombre: data.nombre, email: data.email })`.
  3. Muestra una alerta de SweetAlert2 (`¡Bienvenido, <nombre>!`) y redirige a `/` con `{ replace: true }`.

#### Inicio de sesión (`Login.jsx`)
- Utiliza `useForm()` con validación para `email` y `password`, mostrando los mensajes de error cuando algún campo está vacío.
- Al enviar (`onSubmit(data)`):
  1. Busca el correo en `localStorage` (`'usuarios_registrados'`) para recuperar el `nombre` del usuario (si no se registró previamente, utiliza `data.email`).
  2. Llama a `login({ nombre, email: data.email })`.
  3. Muestra una alerta de SweetAlert2 de bienvenida y redirige a `/` con `{ replace: true }`.

#### Inicio y personajes (`Home.jsx`)
- Lee `logged`, `usuario` y `cerrar_sesion` desde `Contexto` y muestra el saludo `Bienvenido, <nombreUsuario>`.
- El botón **Cerrar Sesión** ejecuta `logout()`, que pide confirmación con `Swal.fire`; al confirmar, llama a `cerrar_sesion()` y `RutasPrivadas` redirige automáticamente a `/login`.
- **Consulta a la API por ID**:
  - Lee `:id` con `useParams()` (si no hay `:id` en la URL, usa `1` por defecto).
  - En `useEffect`, consulta `${import.meta.env.VITE_API_URL}/${personajeId}` cada vez que cambia `personajeId`.
  - Renderiza la imagen, `#id - nombre`, especie y estado del personaje, o un mensaje de error si el ID no existe.

#### Vista de usuario (`Usuarios.jsx`) y Error (`Error.jsx`)
- `Usuarios.jsx` lee `:nombre` mediante `useParams()` y lo muestra en pantalla.
- `Error.jsx` muestra una tarjeta `404` con enlace para regresar a `/`.

---

## Flujo de prueba recomendado

1. Ejecuta `npm run dev` y abre `http://localhost:5173`.
2. Al no haber sesión activa, `RutasPrivadas` redirige automáticamente a `/login`.
3. Entra a **Regístrate** (`/registro`), crea una cuenta con tu nombre, correo y contraseña.
4. Serás redirigido a `/` viendo tu nombre y el personaje `#1` (Rick Sanchez).
5. Cambia la URL a `http://localhost:5173/personaje/8` (o cualquier ID del `1` al `826`) para ver el personaje correspondiente.
6. Haz clic en **Cerrar Sesión**, confirma en SweetAlert2 y vuelve a iniciar sesión desde `/login` con el mismo correo para comprobar que conserva tu nombre.
