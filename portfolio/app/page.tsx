"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { PortfolioData } from "./types";
import { getPortfolioData, hasPortfolioData } from "./lib/storage";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has portfolio data
    if (!hasPortfolioData()) {
      router.push("/onboarding");
      return;
    }
    setData(getPortfolioData());
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <Navbar />
      <main>
        <Hero
          name={data.name}
          title={data.title}
          bio={data.bio}
          skills={data.skills}
        />
        <Projects projects={data.projects} />
      </main>
      <Footer contact={data.contact} name={data.name} />
    </>
  );
}
