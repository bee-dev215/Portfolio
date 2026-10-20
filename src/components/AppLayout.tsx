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
        <div className="atmos-wash w1" />
        <div className="atmos-wash w2" />
        <div className="atmos-wash w3" />
        <div className="atmos-dots" />
        <div className="atmos-grain" />
      </div>
      <MotionLayer />
      <Navbar onResume={downloadResume} />
      <div className="pt-16 lg:pl-64 lg:pt-0">
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
