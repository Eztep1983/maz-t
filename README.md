#  Documentación de la Aplicación Next.js - Tmaz Quality Toners

##  Índice
- [Descripción General](#-descripción-general)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Principales](#-componentes-principales)
- [Funcionalidades Clave](#-funcionalidades-clave)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Configuración y Despliegue](#-configuración-y-despliegue)
- [SEO y Metadatos](#-seo-y-metadatos)
- [Consideraciones de Rendimiento](#-consideraciones-de-rendimiento)
- [Próximos Pasos](#-próximos-pasos)

---

##  Descripción General
La aplicación es un catálogo digital para **Tmaz Quality Toners**, una empresa distribuidora de tóneres y suministros de impresión ubicada en **Pasto, Nariño, Colombia**.  
Permite a los usuarios:
- Explorar productos
- Conocer la empresa
- Ver testimonios
- Contactar a la empresa

---

##  Estructura del Proyecto

src/
├── app/
│ └── catalog/
│ └── page.tsx # Página principal del catálogo
├── components/
│ ├── AboutUs.tsx # Componente "Sobre Nosotros"
│ ├── CatalogWebsite.tsx # Componente principal del catálogo
│ ├── Cart.tsx # Componente del carrito de compras
│ ├── ContactForm.tsx # Formulario de contacto
│ ├── Footer.tsx # Pie de página
│ ├── Loading.tsx # Componente de carga
│ ├── ProductGrid.tsx # Grid de productos
│ └── TestimonialsSection.tsx # Sección de testimonios
└── services/
└── firebaseConfig.ts # Configuración de Firebase


---

##  Componentes Principales

### 1. `app/catalog/page.tsx`
**Página principal del catálogo.**

**Funcionalidades:**
- Generación dinámica de metadatos SEO
- Suspense para estados de carga
- Manejo de parámetros de URL

**SEO:**
- Títulos y descripciones dinámicas
- Metatags Open Graph
- URLs canónicas
- Palabras clave optimizadas

---

### 2. `components/CatalogWebsite.tsx`
**Componente central de la aplicación.**

**Estado:**
- `activeSection`: controla la sección visible
- `menuOpen`: estado del menú móvil
- `testimonialsPage`: paginación de testimonios
- `sectionHistory`: historial de navegación

**Funcionalidades:**
- Navegación entre secciones
- Menú responsive
- Botón de retroceso en móviles
- Integración con Firebase Authentication

---

### 3. `components/AboutUs.tsx`
**Componente “Sobre Nosotros”.**

**Secciones:**
- Historia de la empresa
- Misión y visión
- Equipo
- Información de contacto
- Marcas compatibles
- Preguntas frecuentes

**Características:**
- Animaciones con **Framer Motion**
- Diseño responsive
- CTAs múltiples
- Integración con Google Maps
- Botón flotante de WhatsApp

---

##  Funcionalidades Clave
1. **Navegación Responsive**: menú adaptable + historial de navegación móvil  
2. **Gestión de Estado**: integración con Firebase + URL params  
3. **Optimización SEO**: metadatos dinámicos, Open Graph, URLs canónicas  
4. **Experiencia de Usuario**: animaciones, estados de carga, diseño mobile-first  
5. **Integraciones**: Firebase, Google Maps, WhatsApp API, Meta Pixel  

---

##  Tecnologías Utilizadas

### Frameworks y Librerías
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Framer Motion**
- **Firebase**
- **Lucide React**
- **React Icons**

### Estilos
- **Tailwind CSS**
- CSS personalizado

### APIs y Servicios
- Google Maps (Embed API)
- WhatsApp API
- Firebase

---

##  Configuración y Despliegue

### Variables de Entorno
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

SEO y Metadatos

Metadatos Dinámicos: títulos y descripciones por producto

Open Graph: optimización para redes sociales

URLs Canónicas: evitar contenido duplicado

Palabras Clave: optimizadas para productos y ubicación

Estructura Semántica: headings y landmarks correctos

     Consideraciones de Rendimiento
Optimizaciones

Lazy Loading

Suspense

Memoización (useMemo, useCallback)

next/image para optimización de imágenes

Mejoras Potenciales

Implementar ISR (Incremental Static Regeneration)

PWA capabilities

Estrategias de caching adicionales

Code splitting

     Próximos Pasos

Carrito de compras completo

Pasarela de pagos

Panel de administración

Integraciones (email marketing, analytics)

Búsqueda y filtros avanzados
