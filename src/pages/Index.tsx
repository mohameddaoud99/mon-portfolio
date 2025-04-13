
import React from 'react';
import Header from '@/components/Header';
import About from '@/components/About';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-white">
      <Header />
      
      <main>
        <About />
        <Education />
        <Experience />
        <Certifications />
        <Projects />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
