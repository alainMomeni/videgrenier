import { useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { Search, ShoppingCart, Gift, DollarSign, Leaf, MessageSquare, Instagram, Facebook, Twitter } from 'lucide-react';

type HomeProps = {
  onAddToCart: (product: any, quantity: number) => void;
};

const Home = ({ onAddToCart }: HomeProps) => {

  useEffect(() => {
    document.title = "Vide Grenier Kamer - Vêtements Vintage & Seconde Main";
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Découvrez Vide Grenier Kamer, votre marketplace de vêtements vintage et seconde main. Mode durable, pièces uniques et prix abordables.');
    document.head.appendChild(metaDescription);

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'vêtements vintage, seconde main, cameroun, vide grenier kamer, mode durable, fripe, vêtements occasion, marketplace mode');
    document.head.appendChild(metaKeywords);

    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Vide Grenier Kamer - Mode Vintage et Seconde Main');
    document.head.appendChild(ogTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Marketplace de vêtements vintage et seconde main. Mode durable et pièces uniques au Cameroun.');
    document.head.appendChild(ogDescription);

    const ogType = document.querySelector('meta[property="og:type"]') || document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    ogType.setAttribute('content', 'website');
    document.head.appendChild(ogType);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "name": "Vide Grenier Kamer",
      "description": "Marketplace de vêtements vintage et seconde main",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
    };
  }, []);

  const categories = [
    { name: 'Men\'s Fashion', image: '/assets/categorie1.png', alt: 'Mannequin homme portant un long manteau marron' },
    { name: 'Handbags', image: '/assets/categorie2.png', alt: 'Sac à main en cuir marron de luxe' },
    { name: 'Graphic Tees', image: '/assets/categorie3.png', alt: 'T-shirt blanc avec un portrait graphique' },
    { name: 'Jewelry', image: '/assets/categorie4.png', alt: 'Collection de bijoux vintage en argent et pierres précieuses' },
    { name: 'Sandals', image: '/assets/categorie5.png', alt: 'Paire de sandales dorées pour femme' },
    { name: 'Sneakers', image: '/assets/categorie6.png', alt: 'Paire de baskets blanches classiques' }
  ];

  const testimonials = [
    {
      name: "Sarah Martinez",
      text: "Found amazing vintage pieces at half the retail price!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      name: "James Chen", 
      text: "Sold my entire old wardrobe in just 2 weeks!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    }
  ];

  return (
    <main>
      <section className="relative bg-cover bg-center" style={{ backgroundImage: `url('/assets/hero.jpg')` }} aria-label="Section principale">
        {/* CORRECTION: Ajout de padding horizontal cohérent */}
        <div className="container mx-auto px-8 lg:px-12 xl:px-16">
          <div className="flex items-center min-h-[500px] md:min-h-[600px]">
            <div className="md:w-1/2 lg:w-5/12 py-16">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                  Give Your Wardrobe<br /> a Second Life
                </h1>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => onAddToCart({ id: 99, name: 'Sample Item from Hero', price: 99.99, image: '/assets/categorie6.png' }, 1)} 
                    className="px-8 py-3 bg-[#C06C54] text-white rounded-full transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg" 
                    aria-label="Commencer à acheter des vêtements"
                  >
                    Shop Now
                  </button>
                  <button className="px-8 py-3 bg-[#70816B] text-white rounded-full transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg" aria-label="Vendre vos vêtements">
                    Sell Your Clothes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section 
        className="bg-[#f3efe7] py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-label="Catégories de vêtements"
      >
        {/* CORRECTION: Ajout de padding horizontal cohérent */}
        <div className="container mx-auto px-8 lg:px-12 xl:px-16">
          <h2 className="text-center text-3xl font-serif font-bold text-[#2a363b] mb-12">Featured Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {categories.map((category, index) => (
              <article key={index} className="group cursor-pointer text-center">
                <div className="overflow-hidden rounded-md">
                  <img 
                    src={category.image} 
                    alt={category.alt} 
                    className="w-full h-80 object-cover transform transition-transform duration-300 group-hover:scale-105"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <h3 className="text-xl font-serif text-[#2a363b] mt-6">{category.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="bg-[#f3efe7] py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-label="Comment ça marche"
      >
        {/* CORRECTION: Ajout de padding horizontal cohérent */}
        <div className="container mx-auto px-8 lg:px-12 xl:px-16">
          <h2 className="text-center text-3xl font-serif font-bold text-[#2a363b] mb-20">How it Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-y-8 md:gap-x-12 lg:gap-x-20">
            <div className="flex flex-col items-center text-center w-48 group">
              <div className="w-28 h-28 border border-[#a9b1a8] rounded-full flex items-center justify-center mb-4 transition-colors group-hover:border-[#2a363b]">
                <Search className="w-12 h-12 text-[#2a363b]" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-[#2a363b]">Discover Unique Styles</h3>
            </div>
            <div className="w-24 border-t-2 border-dotted border-[#a9b1a8] hidden md:block" aria-hidden="true"></div>
            <div className="flex flex-col items-center text-center w-48 group">
              <div className="w-28 h-28 border border-[#a9b1a8] rounded-full flex items-center justify-center mb-4 transition-colors group-hover:border-[#2a363b]">
                <ShoppingCart className="w-12 h-12 text-[#2a363b]" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-[#2a363b]">Add to Cart</h3>
            </div>
            <div className="w-24 border-t-2 border-dotted border-[#a9b1a8] hidden md:block" aria-hidden="true"></div>
            <div className="flex flex-col items-center text-center w-48 group">
              <div className="w-28 h-28 border border-[#a9b1a8] rounded-full flex items-center justify-center mb-4 transition-colors group-hover:border-[#2a363b]">
                <Gift className="w-12 h-12 text-[#2a363b]" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-[#2a363b]">Receive & Enjoy</h3>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="bg-[#f3efe7] py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-label="Pourquoi choisir Vide Grenier Kamer et témoignages"
      >
        {/* CORRECTION: Ajout de padding horizontal cohérent */}
        <div className="container mx-auto px-8 lg:px-12 xl:px-16 grid lg:grid-cols-2 gap-x-20 gap-y-16">
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#2a363b] mb-8">Why Choose Vide Grenier Kamer?</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex-shrink-0 border border-[#a9b1a8] rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#2a363b]" aria-hidden="true" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg text-[#2a363b]">List Your Items</h3>
                    <p className="text-gray-600 font-serif">Ship to Buyer - Earn Cash</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex-shrink-0 border border-[#a9b1a8] rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-[#2a363b]" aria-hidden="true" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg text-[#2a363b]">List Your Items</h3>
                    <p className="text-gray-600 font-serif">Ship to VideGrenier - Earn Cash</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-serif font-bold text-[#2a363b] mb-6">Stay in the Loop!</h2>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 bg-white border border-[#dcd6c9] rounded-md py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#c0b8a8]" aria-label="Votre adresse email pour la newsletter" />
                <button className="px-6 py-2 bg-[#C06C54] text-white rounded-md hover:bg-opacity-90 transition">Subscribe</button>
              </div>
              <div className="flex space-x-4 mt-4 text-gray-500" role="list" aria-label="Réseaux sociaux">
                <a href="#facebook" className="hover:text-black transition" aria-label="Suivez-nous sur Facebook"><Facebook className="w-5 h-5" /></a>
                <a href="#twitter" className="hover:text-black transition" aria-label="Suivez-nous sur Twitter"><Twitter className="w-5 h-5" /></a>
                <a href="#instagram" className="hover:text-black transition" aria-label="Suivez-nous sur Instagram"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="space-y-16">
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center"><Leaf className="w-8 h-8 mx-auto mb-2 text-[#2a363b]" aria-hidden="true" /><span className="font-serif text-[#2a363b]">Eco-Friendly</span></div>
                <div className="text-center"><Search className="w-8 h-8 mx-auto mb-2 text-[#2a363b]" aria-hidden="true" /><span className="font-serif text-[#2a363b]">Affordable Fashion</span></div>
                <div className="text-center"><MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#2a363b]" aria-hidden="true" /><span className="font-serif text-[#2a363b]">Unique Finds</span></div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#2a363b] mb-8">Testimonials</h2>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <article key={index} className="border border-[#dcd6c9] p-6 rounded-md transition-colors hover:bg-white/50">
                    <div className="flex items-center gap-4">
                      <img src={testimonial.avatar} alt={`Photo de ${testimonial.name}`} className="w-14 h-14 rounded-full object-cover flex-shrink-0"/>
                      <div>
                        <h3 className="font-serif text-lg text-[#2a363b]">{testimonial.name}</h3>
                        <blockquote className="italic font-serif text-gray-700">"{testimonial.text}"</blockquote>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Home;