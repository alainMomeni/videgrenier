import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-[#f3efe7]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      role="contentinfo"
    >
      {/* CORRECTION: Ajout de padding horizontal cohérent */}
      <div className="container mx-auto px-8 lg:px-12 xl:px-16">
        <div className="py-12 border-t border-[#dcd6c9]">
          <div className="flex justify-center">
            <img 
              src="/assets/paiement.png" 
              alt="Modes de paiement acceptés : Visa, PayPal, Mobile Money, Orange Money" 
              className="h-40"
            />
          </div>
        </div>
        
        <div className="py-6 border-t border-[#dcd6c9] text-center">
          <p className="text-sm text-gray-600 font-serif">
            &copy; 2024 VideGrenier. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;