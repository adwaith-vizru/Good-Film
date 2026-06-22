import { createFileRoute } from "@tanstack/react-router";
import {
  BookMarked,
  Globe,
  CalendarCheck,
  Printer,
  FilePlus2,
  Fingerprint,
  RefreshCw,
  CreditCard,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "e-Passport & Visa Services — Kiosk" },
      {
        name: "description",
        content:
          "Government e-services kiosk. Select a passport or visa service to begin.",
      },
      { property: "og:title", content: "e-Passport & Visa Services" },
      {
        property: "og:description",
        content: "Select a service to begin at the self-service kiosk.",
      },
    ],
  }),
  component: KioskHome,
});

type Service = {
  title: string;
  hint: string;
  Icon: LucideIcon;
};

const services: Service[] = [
  { title: "Passport Renewal", hint: "Renew an existing passport", Icon: BookMarked },
  { title: "Visa Application", hint: "Apply for a new visa", Icon: Globe },
  { title: "Appointment Booking", hint: "Schedule a counter visit", Icon: CalendarCheck },
  { title: "Status Check & Print", hint: "Track and print receipts", Icon: Printer },
  { title: "New Passport Pre-Application", hint: "Start a first-time application", Icon: FilePlus2 },
  { title: "Biometrics Enrolment", hint: "Capture fingerprints & photo", Icon: Fingerprint },
  { title: "Visa Extension", hint: "Extend your current visa", Icon: RefreshCw },
  { title: "Fee Payment", hint: "Pay government service fees", Icon: CreditCard },
  { title: "Contact/Address Update", hint: "Update your registered details", Icon: MapPin },
];

function KioskHome() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Page content */}
      <div className="max-w-[1792px] w-full mx-auto px-16 pt-12 pb-10 flex-1 flex flex-col gap-8">
        {/* Intro banner */}
        <section
          className="relative overflow-hidden rounded-2xl text-white px-10 flex items-center"
          style={{
            background:
              "linear-gradient(120deg, var(--navy-start) 0%, var(--navy-end) 100%)",
            height: 130,
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* soft glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(163,230,53,0.35), transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-40 bottom-[-60px] h-56 w-56 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="flex items-center gap-5 relative">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              aria-hidden
            >
              <ShieldCheck className="h-6 w-6 text-[#A3E635]" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl leading-8 font-semibold">Welcome</h2>
              <p className="text-sm text-white/70 mt-1">
                Select a service to begin
              </p>
            </div>
          </div>

          <div className="ml-auto relative hidden md:flex items-center gap-3 text-white/60 text-xs">
            <span className="h-2 w-2 rounded-full bg-[#A3E635] shadow-[0_0_12px_#A3E635]" />
            Kiosk online
          </div>
        </section>

        {/* Services grid */}
        <section className="flex-1">
          <div className="mb-5">
            <h2 className="text-2xl leading-8 font-semibold text-foreground">
              Available Services
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tap any card to continue
            </p>
          </div>

          <div
            className="grid grid-cols-3"
            style={{ columnGap: 32, rowGap: 20 }}
          >
            {services.map((s, i) => (
              <ServiceCard key={s.title} index={i + 1} {...s} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="h-14 border-t border-border bg-card/60">
        <div className="h-full max-w-[1792px] mx-auto px-16 flex items-center justify-between text-xs text-muted-foreground">
          <p>© Government Services Authority</p>
          <nav className="flex items-center gap-5">
            <a className="hover:text-foreground transition-colors" href="#">Privacy</a>
            <span aria-hidden>•</span>
            <a className="hover:text-foreground transition-colors" href="#">Terms</a>
            <span aria-hidden>•</span>
            <a className="hover:text-foreground transition-colors" href="#">Help Desk</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({
  title,
  hint,
  Icon,
  index,
}: Service & { index: number }) {
  return (
    <button
      className="group relative text-left bg-card rounded-2xl border border-border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        height: 176,
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      <div className="flex items-start justify-between">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center text-white transition-transform duration-200 group-hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, var(--navy-start), var(--navy-end))",
          }}
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <span className="text-xs tabular-nums tracking-widest text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-lg leading-7 font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {hint}
        </p>
      </div>

      {/* subtle bottom accent on hover */}
      <span
        aria-hidden
        className="absolute left-6 right-6 bottom-5 h-[2px] rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
}
