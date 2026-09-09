# Calle Zero

## Integrantes

- Eduardo José Gálvez Benítez  
- Leonel Adrián Ramos López  
- Diego Alejandro López Granados  
- Diego Alberto López Zelaya  

---

## Descripción del proyecto

Calle Zero es una aplicación web de tipo e-commerce enfocada en ropa streetwear.

El sistema está compuesto por tres partes principales:

- Frontend público (tienda para clientes)
- Panel administrativo (gestión interna)
- Backend API REST (Node.js + Express + MongoDB)

El objetivo del proyecto es simular una tienda en línea funcional, permitiendo la gestión de productos, usuarios y órdenes, además de la experiencia de compra y navegación por parte de los clientes.

---

## Tecnologías utilizadas

### Frontend
- React (Vite)
- React Router DOM
- Tailwind CSS
- Sonner
- Lucide React

### Backend
- Node.js (ESModules)
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- cookie-parser
- cors
- dotenv
- multer
- multer-storage-cloudinary
- Cloudinary
- nodemailer
- express-rate-limit
- node-fetch

---

## Estructura del proyecto

calle-zero/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── calleZero/
│   ├── components/
│   ├── assets/
│   ├── data/
│   ├── pages/
│
├── calle-zero-admin/
│   ├── components/
│   ├── assets/
│   ├── data/
│   ├── pages/
│
├── calleZero-movil/          # App móvil (React Native + Expo)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   └── screens/
│   └── App.js
│
└── README.md

---

## Funcionalidades

### Aplicación pública (calleZero)

- Visualización de productos
- Filtros por categoría
- Detalle de productos
- Carrito de compras simulado
- Registro e inicio de sesión
- Interfaz responsiva

### Panel administrativo (calle-zero-admin)

- Gestión de productos (crear, editar, eliminar)
- Gestión de usuarios
- Gestión de órdenes
- Subida de imágenes
- Panel de control

### Backend

- API REST con Express
- Autenticación con JWT
- CRUD de productos, usuarios y órdenes
- Integración con Cloudinary
- Envío de correos con Nodemailer
- Protección de rutas con middlewares
- Rate limiting para seguridad

---

## Instalación y ejecución

### Requisitos

- Node.js
- MongoDB (local o Atlas)

---

### Backend (puerto 4000)

cd backend  
npm install  
npm run dev  

Servidor: http://localhost:4000  

---

### Frontend público (calleZero)

cd calleZero  
npm install  
npm run dev  

Servidor: http://localhost:5173  

---

### Panel administrativo (calle-zero-admin)

cd calle-zero-admin  
npm install  
npm run dev  

Servidor: http://localhost:5174  

---

### App móvil (calleZero-movil)

cd calleZero-movil  
npm install  
npx expo start  

Se abre en Expo Go (escanea el QR) o en un emulador. El backend debe estar
corriendo y el teléfono en la misma red Wi-Fi. Ver `calleZero-movil/README.md`.

---

## Notas importantes

- El backend corre en el puerto 4000
- Se requiere conexión a MongoDB
- Las imágenes se almacenan en Cloudinary
- Ambos frontends consumen la misma API
