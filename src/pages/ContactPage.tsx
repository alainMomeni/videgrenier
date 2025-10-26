// frontend/src/pages/ContactPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Submitting contact form...');
      
      const response = await contactAPI.submit(formData);
      
      console.log('✅ Contact form submitted successfully');
      
      toast.success(response.data.message || 'Message sent successfully! We will get back to you soon.', {
        duration: 5000,
        icon: '✉️'
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error: any) {
      console.error('❌ Error submitting contact form:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage, {
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full bg-white border border-[#dcd6c9] rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0b8a8] text-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f3efe7] text-[#2a363b]"
    >
      {/* Section principale unifiée */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 xl:gap-16">
            
            {/* Colonne des Informations de Contact */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2a363b] mb-8">
                Contact Information
              </h1>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white border border-[#dcd6c9] p-3 rounded-lg mt-1">
                    <Mail size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-serif font-semibold text-lg">Email Us</h2>
                    <p className="text-gray-600 text-sm mt-1">Our team is here to help.</p>
                    <a 
                      href="mailto:videgrenierkamer2025@gmail.com" 
                      className="text-[#C06C54] hover:underline font-medium text-sm mt-2 inline-block"
                    >
                      videgrenierkamer2025@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white border border-[#dcd6c9] p-3 rounded-lg mt-1">
                    <Phone size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-serif font-semibold text-lg">Call Us</h2>
                    <p className="text-gray-600 text-sm mt-1">Mon-Fri from 9am to 5pm.</p>
                    <a 
                      href="tel:+237657697064" 
                      className="text-[#C06C54] hover:underline font-medium text-sm mt-2 inline-block"
                    >
                      +237 657 697 064
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white border border-[#dcd6c9] p-3 rounded-lg mt-1">
                    <MapPin size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-serif font-semibold text-lg">Our Location</h2>
                    <p className="text-gray-600 text-sm mt-1">Yaoundé, Cameroon</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Colonne du Formulaire de Contact */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white border border-[#dcd6c9] rounded-lg shadow-sm p-6 sm:p-8 h-full">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <div className="flex-grow space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-serif font-medium text-[#2a363b] mb-2">
                          Full Name *
                        </label>
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          placeholder="John Doe"
                          className={inputStyle} 
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-serif font-medium text-[#2a363b] mb-2">
                          Email Address *
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          placeholder="john@example.com"
                          className={inputStyle} 
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-serif font-medium text-[#2a363b] mb-2">
                        Subject *
                      </label>
                      <input 
                        type="text" 
                        name="subject" 
                        id="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        placeholder="How can we help you?"
                        className={inputStyle} 
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-serif font-medium text-[#2a363b] mb-2">
                        Message *
                      </label>
                      <textarea 
                        name="message" 
                        id="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        placeholder="Tell us more about your inquiry..."
                        rows={5} 
                        className={inputStyle} 
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="text-right mt-6 pt-6 border-t border-[#e7e2d9]">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition font-serif shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default ContactPage;