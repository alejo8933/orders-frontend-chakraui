# Orders Dashboard (Frontend)

Este es el repositorio del frontend para el sistema de gestión de pedidos (Orders Dashboard), construido utilizando las tecnologías más modernas y diseñado para brindar una experiencia de usuario rápida, limpia y completamente responsiva.

## Stack Tecnológico
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **UI Library:** Chakra UI v2
- **HTTP Client:** Axios

## Requisitos Previos
- Node.js 18+
- npm (Node Package Manager)

## Instalación paso a paso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/alejo8933/orders-frontend-chakraui.git
   ```

2. Entrar al directorio del proyecto:
   ```bash
   cd orders-frontend-chakraui
   ```

3. Instalar las dependencias:
   ```bash
   npm install
   ```

4. Crear el archivo `.env.local` en la raíz del proyecto y agregar la URL de la API:
   ```env
   NEXT_PUBLIC_API_URL=https://orders-rest-api-python.onrender.com
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

## Páginas disponibles

| Ruta | Descripción |
|---|---|
| `/` | Dashboard principal con KPIs y últimos pedidos |
| `/orders` | Listado general de pedidos con filtros y paginación |
| `/orders/new` | Creación de nuevos pedidos interactiva |
| `/orders/[id]` | Vista en detalle de un pedido específico |
| `/orders/[id]/edit` | Edición de un pedido existente |
| `/products` | Listado de productos con opciones de creación/edición (Modal) |
| `/customers` | Listado de clientes con creación/edición e historial |
| `/health` | Estado en tiempo real del servicio (API) y enlace a Swagger |

## Enlaces del Backend
- Documentación interactiva (Swagger): [https://orders-rest-api-python.onrender.com/api/v1/docs](https://orders-rest-api-python.onrender.com/api/v1/docs)

## Estructura del proyecto
```
orders-frontend-chakraui/
├── app/                  # Rutas de Next.js (App Router)
│   ├── customers/
│   ├── health/
│   ├── orders/
│   ├── products/
│   ├── layout.tsx        # Layout global
│   ├── page.tsx          # Dashboard Home
│   └── providers.tsx     # Configuración de Chakra UI
├── components/           # Componentes modulares
│   ├── customers/
│   ├── layout/
│   ├── orders/
│   ├── products/
│   └── ui/               # Reutilizables (Pagination, Badges, Modals)
├── services/             # Servicios y capa de acceso a datos (Axios)
└── types/                # Interfaces TypeScript estandarizadas
```
