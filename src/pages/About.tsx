// src/pages/About.js

import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-serif text-[#2a363b] mb-4">About VideGrenier</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          VideGrenier is a community-driven marketplace dedicated to giving pre-loved fashion a second life. We believe in sustainable style and the power of circular fashion to make a positive impact on the planet.
        </p>
      </div>
    </motion.div>
  );
};

export default About;