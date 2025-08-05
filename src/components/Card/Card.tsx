import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getCurrentEnvironment } from "../../utils/helper";

type cardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  namespace_id: string;
  recordCount?: number;
};

// Array of predefined, visually distinct gradients
const predefinedGradients = [
  'linear-gradient(to right, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)', // Peach
  'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)', // Light Blue
  'linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)', // Lime Green
  'linear-gradient(to right, #fbc2eb 0%, #a6c1ee 100%)', // Pink/Blue
  'linear-gradient(to right, #fdcbf1 0%, #e6dee9 100%)', // Light Pink/Lavender
  'linear-gradient(to right, #84fab0 0%, #8fd3f4 100%)', // Aqua
  'linear-gradient(to right, #fccb90 0%, #d57eeb 100%)', // Orange/Purple
  'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)', // Light Orange/Peach
  'linear-gradient(to right, #a8edea 0%, #fed6e3 100%)', // Cyan/Pink
  'linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)', // Lavender/Blue
];

// Simple hash function for string to number
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash); // Ensure positive number
};

// Function to get a gradient style based on a string
const getGradientStyle = (name: string): React.CSSProperties => {
  const hash = simpleHash(name);
  const gradientIndex = hash % predefinedGradients.length;
  const selectedGradient = predefinedGradients[gradientIndex];
  return { background: selectedGradient };
};

const Card = ({ title, description, imageUrl, namespace_id, recordCount }: cardProps) => {
  const navigate = useNavigate();
  
  // Get dynamic gradient style from predefined list
  const bannerStyle = getGradientStyle(title);
  
  // Generate a unique layout ID for this card based on namespace ID for shared element transitions
  const layoutId = `namespace-${namespace_id}`;

  // const handleClick = () => {
  //   // Set navigation data in localStorage for transition state
  //   localStorage.setItem('lastClickedNamespace', JSON.stringify({
  //     id: namespace_id,
  //     name: title,
  //     description: description,
  //     timestamp: Date.now()
  //   }));
    
  //   // Navigate with a slight delay to allow for click animation to complete
  //   setTimeout(() => {
  //     navigate({
  //       to: "/registries/$namespace_id",
  //       params: { namespace_id },
  //     });
  //   }, 100);
  // };
  const handleClick = () => {
    // Set navigation data in localStorage for transition state
    localStorage.setItem('lastClickedNamespace', JSON.stringify({
      id: namespace_id,
      name: title,
      description: description,
      timestamp: Date.now()
    }));

    // Get env and customEndpoint from URL
    const currentEnv = getCurrentEnvironment();
    const params = new URLSearchParams(window.location.search);
    const customEndpoint = params.get("customEndpoint");

    setTimeout(() => {
      navigate({
        to: "/registries/$namespace_id",
        params: { namespace_id },
        search: currentEnv === "custom" && customEndpoint
          ? { env: currentEnv, customEndpoint }
          : currentEnv
            ? { env: currentEnv }
            : undefined,
      });
    }, 100);
  };

  return (
    <motion.div
      className="group relative flex flex-col bg-primary dark:bg-primary border border-gray-400 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer h-full
      hover:shadow-xl hover:shadow-secondary/10 hover:border-secondary/40 hover:-translate-y-1"
      onClick={handleClick}
      style={{ minHeight: '260px', height: '100%', width: '100%' }}
      layoutId={layoutId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: Math.random() * 0.2,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95, 
        opacity: 0.8,
        transition: { duration: 0.1 }
      }}
    >
      {/* Top Banner Image - Now using dynamic gradient with layoutId for shared transitions */}
      <motion.div
        className="w-full h-20 md:h-24 overflow-hidden transition-all duration-300 group-hover:saturate-150"
        style={imageUrl ? {} : bannerStyle} // Apply gradient only if no image
        layoutId={`banner-${namespace_id}`}
      >
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={`${title} banner`} 
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Content Area */}
      <motion.div 
        className="p-5 pt-12 flex-grow flex flex-col relative"
        layoutId={`content-${namespace_id}`}
      > 
        {/* Name */}
        <motion.h6 
          className="font-semibold text-base md:text-lg text-cardTitle truncate mb-2 transition-colors duration-300 group-hover:text-cardTitleHover"
          layoutId={`title-${namespace_id}`}
        >
          {title}
        </motion.h6>

        {/* Description */}
        <motion.p 
          className="text-xs md:text-sm text-cardDescription line-clamp-2 mb-auto flex-grow"
          layoutId={`description-${namespace_id}`}
        >
          {description}
        </motion.p>

        {/* Stats without divider line */}
        {recordCount !== undefined && (
          <motion.div 
            className="text-xs text-cardStats mt-4"
            layoutId={`stats-${namespace_id}`}
          > 
            <span className="font-medium text-cardStatsNumber">
              {recordCount.toLocaleString()}
            </span>{' '}
            Registries
          </motion.div>
        )}
      </motion.div>
      
      {/* Floating Icon/Avatar - Positioned Absolutely */}
      <motion.div 
        className="absolute top-16 left-4 w-14 h-14 md:w-16 md:h-16 rounded-lg border-4 border-primary dark:border-primary bg-secondary flex items-center justify-center overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg"
        layoutId={`icon-${namespace_id}`}
      >
        <span className="text-white text-lg md:text-2xl font-bold">{title.charAt(0).toUpperCase()}</span>
      </motion.div>
    </motion.div>
  );
};

export default Card;
