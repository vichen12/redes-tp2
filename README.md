# TuFinanza — Contabilidad Inteligente

App de finanzas personales construida con React + Vite + Express + SQLite. Gratis, open source y sin suscripciones.

## Funcionalidades

- **Dashboard** con KPIs de ingresos, gastos, ahorro y meta %
- **Mascota animada** con estados de ánimo que reflejan tu situación financiera
- **Registro de movimientos** — cargá un gasto o ingreso en segundos
- **Metas de ahorro** con barra de progreso y alertas de completado
- **Presupuesto por categoría** con alertas cuando te acercás al límite
- **Gráficos** — pie de gastos por categoría + barras ingresos vs gastos (últimos 4 meses)
- **Modo oscuro** con persistencia automática
- **Categorías personalizadas** — creá las tuyas propias
- **Exportar CSV** — descargá todos tus movimientos del mes
- **Regla 50/30/20** integrada en Presupuesto y Metas
- **Tips financieros** diarios aleatorios
- **Búsqueda y filtros** por mes, tipo y categoría

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Gráficos | Recharts |
| Routing | React Router v6 |
| Backend | Express.js |
| Base de datos | SQLite (better-sqlite3) |

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` — el backend corre en el puerto 3001.

## Producción

```bash
npm run build
NODE_ENV=production npm start
```

## Estructura

```
├── src/
│   ├── pages/         # Dashboard, Transacciones, Metas, Presupuesto, Categorias
│   ├── components/    # Navbar, StatCard, Monedita, Charts, modals
│   ├── context/       # AppContext (estado global)
│   └── utils/         # format.js, categories.js
└── server/
    ├── index.js       # Express server
    ├── db.js          # SQLite setup
    └── routes/        # transactions, goals, budgets, categories
```
