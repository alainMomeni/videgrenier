// src/pages/AboutPage.tsx

import { motion } from 'framer-motion';
import { Linkedin, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- TYPES ---
interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

// --- DONNÉES ---
const teamMembers: TeamMember[] = [
  { name: 'Carine Momeni', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop', linkedin: '#' },
  { name: 'Alain Momeni', role: 'Software Engineer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', linkedin: '#' },
  { name: 'Yvan Momo', role: 'Software Engineer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop', linkedin: '#' },
];

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7] text-[#2a363b]"
    >
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white text-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="/assets/about.jpg" alt="A collection of vintage clothes" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold"
          >
            About Us
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-gray-200"
          >
            Giving every garment a second chance.
          </motion.p>
        </div>
      </section>

      {/* Our Conviction Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <Quote className="text-[#a9b1a8] h-12 w-12 mx-auto" strokeWidth={1} />
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}
            className="mt-6 text-2xl sm:text-3xl font-serif text-[#2a363b] leading-snug"
          >
            "Fashion can be stylish, affordable, and respectful of the planet. We select each piece with heart, for its quality and potential."
          </motion.p>
          <p className="mt-6 font-semibold font-serif">- The Vide Grenier Kamer Team</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 bg-white border-y border-[#dcd6c9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b]">A Bridge Between Past & Present</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed mt-6">
                <p>
                  Welcome to Vide Grenier Kamer, where every garment finds a second chance. Born from a passion for fashion and a deep commitment to the planet, our mission is to combat textile waste. We believe that style should not be ephemeral.
                </p>
                <p>
                  Inspired by the community spirit of flea markets and the richness of Cameroonian culture, we are more than just an online thrift store; we are a bridge between the past and the present. By choosing one of our gems, you adopt a unique piece, make a conscious act for durable fashion, and join a community that celebrates style with soul.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/contact" className="inline-block px-8 py-3 bg-[#a9b1a8] text-white rounded-md transition-transform transform hover:-translate-y-1 hover:shadow-lg font-serif">
                  Contact Us
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?fit=crop&w=800&h=900" 
                alt="A vibrant collection of hanging clothes"
                className="w-full h-full object-cover rounded-lg shadow-lg" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name} 
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="relative inline-block">
                  <img src={member.image} alt={`Portrait of ${member.name}`} className="w-48 h-48 object-cover rounded-full shadow-lg mb-4 mx-auto"/>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                    <Linkedin size={18} className="text-[#2a363b]" />
                  </a>
                </div>
                <h3 className="text-xl font-serif font-bold mt-2">{member.name}</h3>
                <p className="text-gray-500 font-serif">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    

    </motion.div>
  );
};

export default AboutPage;