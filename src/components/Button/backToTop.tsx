import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react'; // usando ícone do Lucide, mais moderno

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <button
        id="backToTopBtn"
        className="btn btn-danger rounded-circle position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
        onClick={scrollToTop}
      >
        <ArrowUp color="white" />
      </button>
    )
  );
}
