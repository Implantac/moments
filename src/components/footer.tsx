import Link from "next/link";
import { MapPin, MessageCircle, QrCode } from "lucide-react";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter";
import { SITE, whatsappLink } from "@/lib/site";

function InstagramIcon({
  size = 17,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const shopLinks = [
  { href: "/produtos", label: "Todos os perfumes" },
  { href: "/produtos?categoria=feminino", label: "Feminino" },
  { href: "/produtos?categoria=masculino", label: "Masculino" },
  { href: "/produtos?promo=1", label: "Promoções" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-noir-950 text-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-rose-500/15 blur-[120px]"
      />

      {/* Newsletter band */}
      <div className="border-b border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-rose-300">
              Fique por dentro
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              Novidades, promoções e <em className="text-rose-300">lançamentos</em>
            </h2>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light tagline />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/55">
            Perfumes importados 100% originais, lacrados e com nota. De Paris
            para o Brasil, com curadoria e carinho de {SITE.city}.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-all hover:border-rose-400 hover:text-rose-300"
            >
              <InstagramIcon size={17} />
            </a>
            <a
              href={whatsappLink("Olá! Vim pelo site da Moments Paris.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-all hover:border-rose-400 hover:text-rose-300"
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-300">
            Loja
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/60">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-ivory"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-300">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/60">
            <li className="flex items-start gap-2.5">
              <MessageCircle size={15} className="mt-0.5 shrink-0 text-rose-300" />
              <a
                href={whatsappLink("Olá! Vim pelo site da Moments Paris.")}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ivory"
              >
                {SITE.whatsappDisplay}
                <span className="block text-xs text-ivory/40">
                  Atendimento com {SITE.representative}
                </span>
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <InstagramIcon size={15} className="mt-0.5 shrink-0 text-rose-300" />
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ivory"
              >
                {SITE.instagramHandle}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-rose-300" />
              {SITE.city}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-300">
            Pagamento
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/60">
            <li className="flex items-start gap-2.5">
              <QrCode size={15} className="mt-0.5 shrink-0 text-rose-300" />
              <span>
                PIX: {SITE.pixKey}
                <span className="block text-xs text-ivory/40">
                  {SITE.pixHolder} · 5% de desconto
                </span>
              </span>
            </li>
            <li className="text-sm text-ivory/60">
              Cartão de crédito em até 10x sem juros
            </li>
            <li className="text-sm text-ivory/60">Pedidos também pelo WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-ivory/40 sm:flex-row sm:px-6 sm:text-left">
          <p>
            © 2026 {SITE.name} — {SITE.tagline}. Todos os direitos reservados.
          </p>
          <p>Fotos meramente ilustrativas · Preços sujeitos a alteração</p>
        </div>
      </div>
    </footer>
  );
}
