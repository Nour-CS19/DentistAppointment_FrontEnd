import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, User, LogOut, LayoutDashboard, Sparkles, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const { t, i18n } = useTranslation();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.services"), path: "/services" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <nav className="max-w-7xl mx-auto glass-nav rounded-2xl border border-white/60 dark:border-white/10 shadow-lg shadow-black/5 transition-all duration-300">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-teal-500 to-accent flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1">
                  Dent<span className="text-primary">Care</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider -mt-1">Modern Clinic</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1.5 rounded-full border border-border/50">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher Badge */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-full text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-muted-foreground" />
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    document.documentElement.dir = "ltr";
                  }}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    i18n.language === "en" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    document.documentElement.dir = "rtl";
                  }}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    i18n.language === "ar" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  عربي
                </button>
              </div>

              {user ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="rounded-full shadow-xs">
                        <LayoutDashboard className="w-4 h-4 mr-1.5 text-primary" />
                        {t("nav.admin")}
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="rounded-full shadow-xs">
                        <User className="w-4 h-4 mr-1.5 text-primary" />
                        {t("nav.my_dashboard")}
                      </Button>
                    </Link>
                  )}

                  <Link to="/book">
                    <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-md shadow-primary/25">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {t("nav.book")}
                    </Button>
                  </Link>

                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="rounded-full font-semibold">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/book">
                    <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-md shadow-primary/20">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {t("nav.book")}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border/60 animate-slide-up">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(link.path)
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="flex items-center justify-between px-4 py-2 my-2 bg-secondary/50 rounded-xl">
                  <span className="text-xs font-medium text-muted-foreground">Language</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        i18n.changeLanguage("en");
                        document.documentElement.dir = "ltr";
                      }}
                      className={`px-3 py-1 text-xs rounded-lg font-bold ${
                        i18n.language === "en" ? "bg-primary text-white" : "text-muted-foreground"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        i18n.changeLanguage("ar");
                        document.documentElement.dir = "rtl";
                      }}
                      className={`px-3 py-1 text-xs rounded-lg font-bold ${
                        i18n.language === "ar" ? "bg-primary text-white" : "text-muted-foreground"
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                  {user ? (
                    <>
                      {isAdmin ? (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start rounded-xl">
                            <LayoutDashboard className="w-4 h-4 mr-2 text-primary" />
                            {t("nav.admin")}
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start rounded-xl">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            My Dashboard
                          </Button>
                        </Link>
                      )}
                      <Link to="/book" onClick={() => setIsOpen(false)}>
                        <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-destructive hover:bg-destructive/10 rounded-xl"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start rounded-xl">
                          {t("nav.login")}
                        </Button>
                      </Link>
                      <Link to="/book" onClick={() => setIsOpen(false)}>
                        <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

