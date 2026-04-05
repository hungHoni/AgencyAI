import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Phase 2 sections will be added here */}
        <div className="min-h-[80dvh] flex items-center justify-center">
          <p className="text-zinc-400 text-lg">Sections coming in Phase 2</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
