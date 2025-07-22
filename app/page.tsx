import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";

export default function Home() {
  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      <Navbar />
      <main className="h-full pt-40">
        <div className="min-h-full flex flex-col justify-between">
          <div className="flex flex-col items-center justify-center flex-1">
            <Header />
            <Hero />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
