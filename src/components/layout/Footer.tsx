import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-teal-500 to-accent flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Dent<span className="text-teal-400">Care</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted clinical partner in total oral health. Providing painless, state-of-the-art care for your family.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{t("nav.services")}</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{t("nav.about")}</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{t("nav.contact")}</Link>
              </li>
              <li>
                <Link to="/book" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{t("nav.book")}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                +20 112 345 6789
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                hello@dentcare.com
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                شبين الكوم، محافظة المنوفية
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Working Hours</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p><span className="text-white font-medium">Mon - Fri:</span> 08:00 AM - 06:00 PM</p>
                  <p><span className="text-white font-medium">Saturday:</span> 09:00 AM - 04:00 PM</p>
                  <p><span className="text-white font-medium">Sunday:</span> Emergency Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} DentCare Clinic. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;