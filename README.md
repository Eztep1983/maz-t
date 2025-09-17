Documentación de la Aplicación Next.js - Tmaz Quality Toners
Índice
Descripción General

Estructura del Proyecto

Componentes Principales

Funcionalidades Clave

Tecnologías Utilizadas

Configuración y Despliegue

SEO y Metadatos

Consideraciones de Rendimiento

Descripción General
La aplicación es un catálogo digital para Tmaz Quality Toners, una empresa distribuidora de tóneres y suministros de impresión ubicada en Pasto, Nariño, Colombia. La aplicación permite a los usuarios explorar productos, conocer la empresa, ver testimonios y contactar a la empresa.

Estructura del Proyecto
text
src/
├── app/
│   └── catalog/
│       └── page.tsx          # Página principal del catálogo
├── components/
│   ├── AboutUs.tsx           # Componente "Sobre Nosotros"
│   ├── CatalogWebsite.tsx    # Componente principal del catálogo
│   ├── Cart.tsx              # Componente del carrito de compras
│   ├── ContactForm.tsx       # Formulario de contacto
│   ├── Footer.tsx            # Pie de página
│   ├── Loading.tsx           # Componente de carga
│   ├── ProductGrid.tsx       # Grid de productos
│   └── TestimonialsSection.tsx # Sección de testimonios
└── services/
    └── firebaseConfig.ts     # Configuración de Firebase
Componentes Principales
1. app/catalog/page.tsx
Página principal que sirve como punto de entrada para el catálogo.

Funcionalidades:

Generación dinámica de metadatos SEO basados en parámetros de búsqueda

Implementación de Suspense para loading states

Manejo de parámetros de URL para productos específicos

Características SEO:

Títulos y descripciones dinámicas según el producto

Metatags para Open Graph

URLs canónicas

Palabras clave optimizadas

2. components/CatalogWebsite.tsx
Componente principal que gestiona la navegación entre secciones.

Estado:

activeSection: Controla la sección visible (about, catalog, testimonials, contact)

menuOpen: Estado del menú móvil

testimonialsPage: Paginación de testimonios

sectionHistory: Historial de navegación

Funcionalidades:

Navegación entre secciones

Menú responsive para dispositivos móviles

Botón de retroceso en móviles

Integración con Firebase Authentication

3. components/AboutUs.tsx
Componente que muestra información sobre la empresa.

Secciones:

Historia de la empresa

Misión y visión

Información del equipo

Información de contacto

Marcas compatibles

Preguntas frecuentes

Características:

Animaciones con Framer Motion

Diseño responsive

Múltiples CTAs (Call to Action)

Integración con Google Maps

Botón flotante de WhatsApp

Funcionalidades Clave
1. Navegación Responsive
Menú adaptativo para desktop y móvil

Navegación por pestañas en la sección "Sobre Nosotros"

Historial de navegación para móviles

2. Gestión de Estado
Estado local para UI components

Integración con Firebase para autenticación

Manejo de parámetros de URL

3. Optimización SEO
Metadatos dinámicos por producto

Estructura semántica HTML

URLs canónicas

Optimización para redes sociales (Open Graph)

4. Experiencia de Usuario
Animaciones suaves con Framer Motion

Estados de carga

Diseño mobile-first

Botones de acción flotantes (WhatsApp)

5. Integraciones
Firebase para autenticación

Google Maps para ubicación

WhatsApp API para comunicación

Meta Pixel (preparado para implementación)

Tecnologías Utilizadas
Frameworks y Librerías
Next.js 14: Framework React con App Router

React 18: Librería principal de UI

TypeScript: Tipado estático

Framer Motion: Animaciones

Firebase: Autenticación y base de datos

Lucide React: Iconografía

React Icons: Iconos adicionales

Estilos
Tailwind CSS: Framework de estilos

CSS personalizado para componentes específicos

APIs y Servicios Externos
Google Maps: Embed API para ubicación

WhatsApp: API de enlaces directos

Firebase: Servicios de backend

Configuración y Despliegue
Variables de Entorno
env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
Comandos de Despliegue
bash
# Instalación
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
SEO y Metadatos
La aplicación implementa una estrategia SEO avanzada con:

Metadatos Dinámicos: Títulos y descripciones que cambian según el producto

Open Graph: Optimización para compartir en redes sociales

URLs Canónicas: Prevención de contenido duplicado

Palabras Clave: Optimizadas para productos y ubicación

Estructura Semántica: Uso adecuado de headings y landmarks

Consideraciones de Rendimiento
Optimizaciones Implementadas
Lazy Loading: Imágenes y componentes

Suspense: Estados de carga para mejor UX

Memoización: Uso de useMemo y useCallback

Image Optimization: Componente Next.js Image

Mejoras Potenciales
Implementar ISR (Incremental Static Regeneration) para productos

Añadir PWA capabilities

Implementar más estrategias de caching

Optimizar bundles con code splitting

Próximos Pasos
Implementar carrito de compras completo

Añadir pasarela de pagos

Implementar panel de administración

Añadir más integraciones (email marketing, analytics)

Implementar búsqueda y filtros avanzados

Este documento proporciona una visión general completa de la aplicación. Para detalles específicos de implementación, referirse a los comentarios en el código de cada componente.
