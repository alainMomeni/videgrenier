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
      <div className="container mx-auto px-4">
        <div className="py-12 border-t border-[#dcd6c9]">
          <nav 
            // --- AMÉLIORATION ICI ---
            className="flex flex-col md:flex-row justify-center text-center md:text-left gap-y-10 md:gap-x-24 mb-10" 
            aria-label="Liens du footer"
          >
            <div>
              <h3 className="font-serif text-[#2a363b] text-lg mb-4">Company</h3>
              <ul className="space-y-2 font-serif text-gray-600">
                <li><a href="#about" className="hover:text-[#2a363b] transition">About Us</a></li>
                <li><a href="#careers" className="hover:text-[#2a363b] transition">Careers</a></li>
                <li><a href="#press" className="hover:text-[#2a363b] transition">Press</a></li>
                <li><a href="#blog" className="hover:text-[#2a363b] transition">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-[#2a363b] text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 font-serif text-gray-600">
                <li><a href="#help" className="hover:text-[#2a363b] transition">Help Center</a></li>
                <li><a href="#contact" className="hover:text-[#2a363b] transition">Contact Us</a></li>
                <li><a href="#shipping" className="hover:text-[#2a363b] transition">Shipping Info</a></li>
                <li><a href="#returns" className="hover:text-[#2a363b] transition">Returns</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-[#2a363b] text-lg mb-4">Legal</h3>
              <ul className="space-y-2 font-serif text-gray-600">
                <li><a href="#privacy" className="hover:text-[#2a363b] transition">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-[#2a363b] transition">Terms of Service</a></li>
                <li><a href="#cookies" className="hover:text-[#2a363b] transition">Cookie Policy</a></li>
                <li><a href="#accessibility" className="hover:text-[#2a363b] transition">Accessibility</a></li>
              </ul>
            </div>
          </nav>
          
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