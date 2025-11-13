# Sales Insights - Dashboard de Análisis de Ventas

Una aplicación web moderna para el análisis de datos de ventas, construida con **Astro**, **React**, **TypeScript** y **Tailwind CSS**. Ofrece visualizaciones interactivas, comparaciones de productos y análisis detallado por sucursales.

## Características Principales

- **Dashboard de Productos**: Vista general con métricas clave y lista interactiva de productos
- **Análisis por Sucursales**: Estadísticas detalladas de rendimiento por ubicación  
- **Comparador de Productos**: Herramienta para comparar hasta 3 productos simultáneamente
- **Gráficas Interactivas**: Visualizaciones con Recharts para mejor comprensión de datos
- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Dashboard de Analytics**: Sistema de seguimiento interno de interacciones de usuario

## Tecnologías Utilizadas

- **Astro 4.x** - Framework web moderno con SSR
- **React 18** - Biblioteca de UI para componentes interactivos
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de estilos utilitarios
- **Recharts** - Biblioteca de gráficas para React
- **Inter Font** - Tipografía moderna y legible

## Instalación

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** como gestor de paquetes

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/MarcoDavidVillanuevaRamirez159/PRUEBA-TECNICA-ASTRO.git
   cd prueba-tecnica-astro
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   Ve a `http://localhost:4321` para ver la aplicación funcionando.

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 4321 |
| `npm run build` | Construye la aplicación para producción en `/dist/` |
| `npm run preview` | Previsualiza la versión de producción localmente |
| `npm run astro check` | Verifica el código TypeScript |

## Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── AnalyticsDashboard.tsx    # Dashboard de métricas internas
│   ├── CompareChart.tsx          # Gráfica de comparación
│   ├── ProductRevenueChart.tsx   # Gráfica de ingresos por producto  
│   ├── SalesList.tsx             # Lista principal con filtros
│   └── StoreSalesChart.tsx       # Gráfica de ventas por sucursal
├── data/                # Datos de ejemplo
│   └── sales.json       # Datos de productos y ventas
├── layouts/             # Layouts base de Astro
│   └── BaseLayout.astro # Layout principal con navegación
├── lib/                 # Utilidades y lógica de negocio
│   ├── analytics.ts     # Sistema de tracking interno
│   └── sales.ts         # Funciones para procesar datos de ventas  
├── pages/               # Páginas de la aplicación (rutas)
│   ├── index.astro      # Dashboard principal de productos
│   ├── stores.astro     # Análisis por sucursales
│   ├── compare.astro    # Comparador de productos
│   ├── analytics.astro  # Dashboard interno de métricas
│   └── item/[slug].astro # Detalle individual de productos
└── styles/
    └── global.css       # Estilos globales
```

## Funcionalidades Detalladas

### Dashboard Principal (`/`)
- **Métricas generales**: Ingresos totales, tickets, productos analizados y margen promedio
- **Gráfica de barras**: Visualización de ingresos por producto
- **Lista interactiva**: Tabla con filtros de búsqueda, categoría y sucursal
- **Comparador**: Selección múltiple de productos para análisis comparativo

### Análisis por Sucursales (`/stores`)
- **Métricas por tienda**: Rendimiento individual de cada sucursal
- **Gráfica comparativa**: Ingresos por sucursal en formato visual
- **Tabla detallada**: Estadísticas completas por ubicación

### Comparador de Productos (`/compare`)
- **Selección múltiple**: Compara de 2 a 3 productos simultáneamente
- **Métricas avanzadas**: Incluye ROI estimado y ganancia por unidad
- **Resumen ejecutivo**: Identifica automáticamente el mejor performer
- **Gráfica comparativa**: Visualización lado a lado de los productos

### Dashboard de Analytics (`/analytics`)
- **Métricas en tiempo real**: Seguimiento de interacciones de usuario
- **Gráficas de comportamiento**: Distribución de eventos por categoría
- **Productos más vistos**: Ranking de productos con mayor interacción
- **Actividad reciente**: Log de acciones del usuario

## Datos de Ejemplo

La aplicación incluye un conjunto de datos de muestra con:
- **6 productos** de diferentes categorías (electrónicos, ropa, hogar)
- **3 sucursales** (Centro, Norte, Sur)
- **Métricas reales**: Ventas, tickets, ingresos y márgenes por producto

## Optimizaciones Implementadas

- **Rendimiento**: Componentes optimizados y carga mínima de JavaScript
- **SEO**: Meta tags dinámicos y estructura semántica
- **Accesibilidad**: Navegación por teclado y labels apropiados
- **Responsive Design**: Adaptación completa a todos los tamaños de pantalla
- **TypeScript**: Tipado estricto para prevenir errores

