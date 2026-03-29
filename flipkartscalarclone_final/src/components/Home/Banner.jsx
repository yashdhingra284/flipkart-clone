import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    title: "Men's Sandals",
    subtitle: 'From ₹129',
    description: 'Time to shop is now',
    bgColor: 'from-slate-300 to-slate-400',
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Next-gen Smartphones',
    subtitle: 'From ₹12,999',
    description: 'Latest technology at your fingertips',
    bgColor: 'from-red-500 to-red-600',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Smart TVs',
    subtitle: 'From ₹28,990',
    description: 'Enjoy the best viewing experience',
    bgColor: 'from-blue-600 to-blue-700',
    image: 'https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative h-64 md:h-96 overflow-hidden rounded-lg group">
      {banners.map((banner, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
          }}
        >
          <div className={`h-full bg-gradient-to-r ${banner.bgColor} flex items-center justify-between px-8 md:px-16`}>
            <div className="text-white max-w-lg">
              <h2 className="text-3xl md:text-5xl font-bold mb-2">{banner.title}</h2>
              <p className="text-2xl md:text-4xl font-semibold mb-4">{banner.subtitle}</p>
              <p className="text-lg md:text-xl">{banner.description}</p>
            </div>
            <div className="hidden md:block">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-64 w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};