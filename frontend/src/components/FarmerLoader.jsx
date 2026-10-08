import { Player } from '@lottiefiles/react-lottie-player';
import farmerAnimation from '../assets/farmer-loading.json';

const FarmerLoader = ({ message = "Gathering field data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-green-50">
      <div className="w-48 h-48 sm:w-64 sm:h-64">
        <Player
          autoplay
          loop
          src={farmerAnimation}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <p className="text-green-700 font-semibold mt-2 text-lg animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  );
};

export default FarmerLoader;
