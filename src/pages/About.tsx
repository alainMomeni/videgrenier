// src/pages/AboutPage.tsx

import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- TYPES (si vous les utilisez dans des fichiers séparés) ---
interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

// Composant pour le CTA Hero
const CTASection = ({ title, description, buttonText, buttonLink, backgroundImage }: CTASectionProps) => (
  <section className="relative overflow-hidden">
    {/* Image de fond avec img tag pour meilleur chargement */}
    <div className="absolute inset-0">
      <img 
        src={backgroundImage}
        alt="Background"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
    
    {/* Contenu */}
    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center text-white">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold">{title}</h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
        {description}
      </p>
      <div className="mt-8">
        <a 
          href={buttonLink}
          className="inline-block px-8 py-3 bg-white text-[#2a363b] rounded-full transition-transform transform hover:scale-105 hover:shadow-lg font-serif"
        >
          {buttonText}
        </a>
      </div>
    </div>
  </section>
);

// --- DONNÉES ---
const teamMembers: TeamMember[] = [
  {
    name: 'Carine Momeni',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    linkedin: '#',
  },
  {
    name: 'Alain Momeni',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    linkedin: '#',
  },
  {
    name: 'Yvan Momo',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    linkedin: '#',
  },
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
      {/* Section d'introduction */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-8 lg:px-12 xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2a363b]">
              Vide Grenier Kamer
            </h1>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12 text-gray-700 leading-relaxed text-left">
            <p>
              Welcome to Vide Grenier Kamer, where every garment finds a second chance. Born from a passion for fashion and a deep commitment to the planet, our mission is to combat textile waste. We believe that style should not be ephemeral. That is why we hunt for and select with the utmost care quality pieces, rich in history, ready to start a new life with you and enrich your wardrobe.
            </p>
            <p>
              Our concept is inspired by the community spirit of flea markets and the richness of Cameroonian culture, valuing transmission and authenticity. More than just an online thrift store, we are a bridge between the past and the present. By choosing one of our gems, you are not just making a purchase: you are adopting a unique piece, making a conscious act for more durable fashion, and joining a community that celebrates style with soul.
            </p>
          </div>
        </div>
      </section>

      {/* Section "Our Story" */}
      <section className="py-16 sm:py-20 bg-[#f3efe7] ">
        <div className="container mx-auto px-8 lg:px-12 xl:px-16">
          <h2 className="text-center text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-12">
            Our Story
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="/assets/about.jpg" // Assurez-vous que l'extension (.png, .jpg, .webp) est correcte
                alt="Happy shoppers representing the Vide Grenier Kamer community"
                className="w-full h-full object-cover rounded-lg shadow-lg" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2a363b]">
                From passion, a project was born
              </h3>
              <p className="mt-6 text-gray-700 leading-relaxed">
                Vide Grenier Kamer was born from a simple conviction: fashion can be stylish, affordable, and respectful of the planet. We select each piece with heart, for its quality and potential.
              </p>
              <div className="mt-8">
                <Link 
                  to="/contact" 
                  className="inline-block px-8 py-3 bg-[#a9b1a8] text-white rounded-md transition-transform transform hover:-translate-y-1 hover:shadow-lg font-serif"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SECTION "MEET THE TEAM" RÉINTÉGRÉE --- */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-8 lg:px-12 xl:px-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-12">
            Meet the Team
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-start gap-10">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name} 
                className="w-full max-w-xs text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <img src={member.image} alt={`Portrait of ${member.name}`} className="w-full h-[320px] object-cover rounded-lg shadow-lg mb-4"/>
                <h3 className="text-2xl font-serif font-bold">{member.name}</h3>
                <p className="text-gray-500 font-serif">{member.role}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-gray-500 hover:text-[#2a363b] transition">
                  <Linkedin size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <CTASection 
        title="Become Part of the Story" 
        description="Your wardrobe has a future. Let's build it together." 
        buttonText="Explore the Collection" 
        buttonLink="/shop" 
        backgroundImage="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=500&fit=crop&q=80" 
      />
    </motion.div>
  );
};

export default AboutPage;