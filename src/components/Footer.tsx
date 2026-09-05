import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600">
                <span className="text-sm font-bold text-navy-950">P</span>
              </div>
              <span className="text-xl font-bold text-white">
                Port<span className="text-gold-400">buff</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-500">
              {t("footer.description")}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.platform")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("nav.features")}
                </a>
              </li>
              <li>
                <a
                  href="#plans"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("nav.plans")}
                </a>
              </li>
              <li>
                <a
                  href="#dashboard"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("nav.dashboard")}
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  className="flex items-center gap-1 text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("nav.signup")}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.careers")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.blog")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.help")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-navy-400 transition-colors hover:text-gold-400"
                >
                  {t("footer.risk")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-navy-600">{t("footer.copyright")}</p>
            <p className="text-xs text-navy-600">{t("footer.disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
