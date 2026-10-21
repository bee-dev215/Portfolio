import Navbar from "./portfolio/Navbar";
import Hero from "./portfolio/Hero";
import About from "./portfolio/About";
import Skills from "./portfolio/Skills";
import Projects from "./portfolio/Projects";
import Experience from "./portfolio/Experience";
import Credentials, { downloadResume } from "./portfolio/Credentials";
import Contact from "./portfolio/Contact";
import Footer from "./portfolio/Footer";
import MotionLayer from "./portfolio/MotionLayer";

export default function AppLayout() {
  return (
    <div className="site-root site-bg min-h-screen antialiased">
      <div className="atmos" aria-hidden="true">
        <div className="atmos-glow g1" />
        <div className="atmos-glow g2" />
        <div className="atmos-heat" />
        <div className="atmos-grid" />
        <div className="atmos-scan" />
        <div className="atmos-vignette" />
      </div>
      <MotionLayer />
      <Navbar onResume={downloadResume} />
      <div className="pt-16">
        <main>
          <Hero onResume={downloadResume} />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Credentials />
          <Contact />
        </main>
        <Footer onResume={downloadResume} />
      </div>
    </div>
  );
}
