import { Phone, Mail, MapPin, Facebook, Instagram, Clock, Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b-2 border-blue-500 pb-2 inline-block">
              Contacto
            </h3>
            <div className="flex items-center space-x-3 text-slate-700 group hover:translate-x-1 transition-transform">
              <div className="bg-blue-50 p-2 rounded-full">
                <Phone className="text-blue-600" size={20} />
              </div>
              <span className="group-hover:text-blue-600 transition-colors">+57 (314) 784-5883</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 group hover:translate-x-1 transition-transform">
              <div className="bg-blue-50 p-2 rounded-full">
                <Mail className="text-blue-600" size={20} />
              </div>
              <span className="group-hover:text-blue-600 transition-colors">serviciotecnicokonicaminolta@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 group hover:translate-x-1 transition-transform">
              <div className="bg-blue-50 p-2 rounded-full">
                <MapPin className="text-blue-600" size={20} />
              </div>
              <span className="group-hover:text-blue-600 transition-colors">San Juan De Pasto, Nariño Colombia</span>
            </div>
          </div>

          {/* Business Hours */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b-2 border-blue-500 pb-2 inline-block">
              Horario de Atención
            </h3>
            <div className="space-y-3 mt-5">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-50 p-2 rounded-full mt-1">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Lunes - Viernes</p>
                  <p className="text-slate-600">9:30am - 12:00pm | 2:40pm - 6:30pm</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 pl-10">
                <p className="font-medium text-slate-800">Sábado:</p>
                <p className="text-slate-600">9:00 - 14:00</p>
              </div>
              <div className="flex items-center space-x-3 pl-10">
                <p className="font-medium text-slate-800">Domingo:</p>
                <p className="text-slate-600">Cerrado</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b-2 border-blue-500 pb-2 inline-block">
              Síguenos
            </h3>
            <div className="flex space-x-4 mt-5">
              <a 
                href="https://www.facebook.com/konica.minolta.7140" 
                target="_blank" 
                className="bg-slate-200 hover:bg-blue-600 p-3 rounded-full text-slate-700 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                className="bg-slate-200 hover:bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full text-slate-700 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-10 pt-6 border-t border-slate-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-sm text-slate-600 flex items-center">
              <Copyright size={16} className="mr-1" /> {new Date().getFullYear()} TMAZ Quality Toner. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;