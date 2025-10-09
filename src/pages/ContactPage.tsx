// src/pages/ContactPage.tsx

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour envoyer le message (appel API)
    console.log('Contact form submitted:', formData);
    // Afficher une notification de succès et réinitialiser le formulaire
  };
  
  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7] text-[#2a363b]"
    >

      {/* Contact Info & Form Section */}
      <section className="py-16 sm:py-20 mx-auto px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-3xl font-serif font-bold text-[#2a363b]">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#fcfaf7] border border-[#dcd6c9] p-3 rounded-lg mt-1">
                    <Mail size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg">Email Us</h3>
                    <p className="text-gray-600 mt-1">Our team is here to help. Drop us a line!</p>
                    <a href="mailto:contact@vgkamer.com" className="text-[#C06C54] hover:underline font-medium text-sm mt-2 inline-block">
                      contact@vgkamer.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#fcfaf7] border border-[#dcd6c9] p-3 rounded-lg mt-1">
                    <Phone size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg">Call Us</h3>
                    <p className="text-gray-600 mt-1">Mon-Fri from 9am to 5pm.</p>
                    <a href="tel:+237600000000" className="text-[#C06C54] hover:underline font-medium text-sm mt-2 inline-block">
                      +237 657697064
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#fcfaf7] border border-[#dcd6c9] p-3 rounded-lg mt-1">
                    <MapPin size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg">Our Location</h3>
                    <p className="text-gray-600 mt-1">Douala, Cameroon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#fcfaf7] border border-[#dcd6c9] rounded-lg shadow-sm p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Full Name</label>
                      <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Email Address</label>
                      <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Subject</label>
                    <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-serif font-medium text-[#2a363b] mb-1">Message</label>
                    <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows={5} className={inputStyle} required></textarea>
                  </div>
                  <div className="text-right">
                    <button type="submit" className="px-8 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default ContactPage;