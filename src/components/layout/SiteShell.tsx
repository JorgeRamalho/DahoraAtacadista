import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppStatusBar } from "@/components/layout/AppStatusBar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-mesh">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-dahora-forest focus:px-4 focus:py-2 focus:text-white"
      >
        Ir para o conteúdo
      </a>
      <div className="sticky top-0 z-50">
        <Header />
        <AppStatusBar />
      </div>
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
