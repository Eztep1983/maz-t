import React from 'react';

/**
 * Componente de Schema Markup para SEO
 * Implementa JSON-LD structured data para mejorar la visibilidad en búsquedas
 */
export const SchemaMarkup = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tmaz Quality Toner",
    "description": "Distribuidores autorizados de tóner compatible para fotocopiadoras multifuncionales Toshiba, Ricoh y Konica Minolta en Pasto, Nariño",
    "image": "https://tmazqualitytoner.com/images/Logo.jpeg",
    "logo": "https://tmazqualitytoner.com/images/Logo.jpeg",
    "url": "https://tmazqualitytoner.com",
    "telephone": "+573147845883",
    "email": "tmazqualitytoner@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle 20 # 27-105, Las Cuadras",
      "addressLocality": "Pasto",
      "addressRegion": "Nariño",
      "postalCode": "520001",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "1.2182379",
      "longitude": "-77.2789939"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:30",
        "closes": "12:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "14:40",
        "closes": "18:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61559681797295"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Efectivo", "Tarjeta de Crédito", "Tarjeta de Débito", "Transferencia Bancaria", "Nequi"],
    "currenciesAccepted": "COP",
    "areaServed": {
      "@type": "State",
      "name": "Nariño"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catálogo de Tóner",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Tóner Compatible Toshiba",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Tóner Compatible para Toshiba"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Tóner Compatible Ricoh",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Tóner Compatible para Ricoh"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Tóner Compatible Konica Minolta",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Tóner Compatible para Konica Minolta"
              }
            }
          ]
        }
      ]
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tmaz Quality Toner",
    "alternateName": "Tmaz Toner",
    "url": "https://tmazqualitytoner.com",
    "logo": "https://tmazqualitytoner.com/images/Logo.jpeg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+573147845883",
      "contactType": "Servicio al Cliente",
      "areaServed": "CO",
      "availableLanguage": ["Spanish"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61559681797295"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://tmazqualitytoner.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Acerca de Nosotros",
        "item": "https://tmazqualitytoner.com#about"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Realizan envíos a otras ciudades?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, realizamos envíos a todo Colombia. Se despacha el mismo día de la compra."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué métodos de pago aceptan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Aceptamos efectivo, transferencias bancarias, tarjetas de crédito y débito, y pagos a través de plataformas como Nequi."
        }
      },
      {
        "@type": "Question",
        "name": "¿Tienen stock disponible de todos los productos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Manejamos un inventario actualizado. Te recomendamos consultarnos directamente para confirmar existencias."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  );
};

export default SchemaMarkup;