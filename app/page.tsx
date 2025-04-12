import Head from 'next/head'
import CatalogWebsite from '@/components/CatalogWebsite'
import AboutUs from '@/components/AboutUs'
import TestimonialsSection from '@/components/testimonials'
import ContactForm from '@/components/ContactForm'
import ProductGrid from '@/components/ProductGrid'


export default function Home() {
  return (
    <>
      <Head>
        <title>Venta de Tóner, Tinta y Repuestos | Servicio Técnico en Colombia</title>
        <meta name="description" content="Tienda especializada en tóner, tinta, consumibles y repuestos para impresoras. Servicio técnico especializado. Ubicados en Pasto Envíos en toda Colombia." />
        <meta name="keywords" content="toner, toner pasto,toner nariño, toner colombia, 
        fotocopiadoras toshiba pasto, kyocera, Epson pasto, Hp pasto, Tintas impresora pasto, tintas pasto, 
        repuestos para impresora, comprar tinta impresoras, toners, tintas originales impresoras, tintas genericas, tintas genericas impresoras,
         pasto, servicio tecnico toshiba pasto, toner kilos, toner color, cilindros, cuchillas fotocopiadoras, impresoras hp , mantenimiento, recarga de tinta, recarga hp, recarga de toner
        toner ricoh pasto, toner ricoh, Minolta, toner generico de calidad, servicio tecnico especializado
        distribuidor de toner autorizado en colombia de alta calidad, repuestos impresoras, servicio técnico, insumos impresoras, fotocopiadoras, Colombia" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Insumos y Repuestos para Impresoras | Tóner y Tinta" />
        <meta property="og:description" content="Expertos en insumos para impresoras. Calidad, servicio técnico y repuestos garantizados." />
      </Head>

      <CatalogWebsite />
      <AboutUs />
      <ContactForm />
      <ProductGrid />
      <ContactForm />
    </>
  )
}
