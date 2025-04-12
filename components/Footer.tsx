import { Phone, Mail, MapPin, Facebook, Instagram, Clock, Copyright } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  // Datos de contacto reutilizables
  const contactInfo = [
    {
      icon: <Phone className="text-blue-600" size={20} />,
      text: "+57 (314) 74-883",
      href: "tel:+573147845883"
    },
    {
      icon: <Mail className="text-blue-600" size={20} />,
      text: "tmazqualitytoner@gmail.com",
      href: "mailto:tmazqualitytoner@gmail.com"
    },
    {
      icon: <MapPin className="text-blue-600" size={20} />,
      text: "San Juan De Pasto, Nariño Colombia",
      href: "https://www.google.com/maps/place/Servicio+T%C3%A9cnico+Konica/@1.2182379,-77.2789939,15z"

    }
  ];

  const businessHours = [
    {
      days: "Lunes - Viernes",
      hours: "9:30am - 12:00pm | 2:40pm - 6:30pm",
      icon: <Clock className="text-blue-600" size={20} />
    },
    {
      days: "Sábado",
      hours: "9:00 - 14:00"
    },
    {
      days: "Domingo",
      hours: "Cerrado"
    }
  ];

  const socialMedia = [
    {
      platform: "Facebook",
      url: "https://www.facebook.com/konica.minolta.7140",
      icon: <Facebook size={24} />,
      className: "hover:bg-blue-600 hover:text-white"
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/pro_toshiba_service?igsh=bWR1cmx2bzJmbHl0",
      icon: <Instagram size={24} />,
      className: "hover:bg-gradient-to-r from-pink-500 to-purple-500 hover:text-white"
    }
  ];

  return (
    <footer className="bg-slate-100 text-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-slate-800 border-b-2 border-blue-500 pb-2 inline-block">
              Contacto
            </h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 group transition-all"
                  aria-label={item.text}
                >
                  <div className="bg-blue-50 p-2 rounded-full flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="group-hover:text-blue-600 group-hover:underline transition-colors">
                    {item.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 border-b-2 border-blue-500 pb-2 inline-block">
              Horario de Atención
            </h3>
            <div className="space-y-4 mt-5">
              {businessHours.map((item, index) => (
                <div key={index} className="flex gap-3">
                  {item.icon && (
                    <div className="bg-blue-50 p-2 rounded-full flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
                  )}
                  <div className={!item.icon ? "ml-10" : ""}>
                    <p className="font-medium text-slate-800">{item.days}</p>
                    <p className="text-slate-600">{item.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 border-b-2 border-blue-500 pb-2 inline-block">
              Síguenos
            </h3>
            <div className="flex gap-4 mt-5">
              {socialMedia.map((social) => (
                <Link
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-slate-200 p-3 rounded-full transition-colors ${social.className}`}
                  aria-label={social.platform}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm flex items-center justify-center gap-1">
              <Copyright size={16} />
              {new Date().getFullYear()} TMAZ Quality Toner. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;