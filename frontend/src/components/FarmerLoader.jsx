import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import farmerAnimation from '../assets/farmer-loading.json';

const FarmerLoader = ({ message = "Gathering field data..." }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: farmerAnimation,
    });

    return () => anim.destroy();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div ref={containerRef} className="w-48 h-48 sm:w-64 sm:h-64" />
      <p className="text-green-700 font-medium mt-4 text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default FarmerLoader;
