import { useMemo } from "react";
import { normalization } from "../../utils/helper";
import { getCardColor, getHoverGradient, getHoverBorder, ColorType } from "../../utils/cardStyles";
import { motion } from "framer-motion";

type CardProps = {
  title: string;
  description: string;
  record_count: number;
  updated_at: string;
  onClick?: () => void;
};

type CardRegistryGroupProps = {
  title: string;
  cards: CardProps[];
  onCardClick?: (card: CardProps) => void;
};

// Map card types to their corresponding color classes is now in color.json

// Function to determine the color based on title is now in cardStyles.ts

// Helper function to get the appropriate gradient class based on color scheme is now in cardStyles.ts

// Helper function to get the hover border class based on color scheme is now in cardStyles.ts

const CardRegistry = ({
  title,
  description,
  record_count,
  updated_at,
  onClick,
}: CardProps) => {
  // Use useMemo to compute the color only when the title changes
  const colorStyle = useMemo(() => getCardColor(title), [title]);
  const hoverGradient = useMemo(() => getHoverGradient(colorStyle.colorScheme), [colorStyle]);
  const hoverBorder = useMemo(() => getHoverBorder(colorStyle.colorScheme), [colorStyle]);

  return (
    <motion.div
      className={`group relative rounded-lg border border-gray-200 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/50 px-6 py-3
                 dark:border-gray-800 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-950
                 hover:shadow-md ${hoverBorder}
                 transition-all duration-300 ease-in-out flex items-center w-full h-full`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
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
        scale: 0.97,
        opacity: 0.92,
        transition: { duration: 0.1 }
      }}
    >
      {/* Hover overlay with color */}
      <div 
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out 
                   bg-gradient-to-br ${hoverGradient}`}
      ></div>

      {/* Content positioned above the overlay */}
      <div className="relative z-10 flex flex-col justify-center w-full">
        <div className="flex items-center justify-start gap-2">
          {/* Colored dot visible at all times */}
          <span className={`h-1.5 w-1.5 rounded-full ${colorStyle.dotColorClass}`}></span>
          <p className="text-[16px] font-semibold truncate">{normalization(title)}</p>
        </div>
        <p className="text-[14px] text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 mt-1 line-clamp-1">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export const CardRegistryGroup = ({
  title,
  cards,
  onCardClick,
}: CardRegistryGroupProps) => {
  return (
    <div className="group -ml-4">
      <div className="mb-8 flex items-center justify-start gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="h-px flex-1 translate-y-px bg-gradient-to-r from-gray-200/60 from-60% to-transparent dark:from-gray-800/60 dark:to-gray-950"></div>
      </div>
      <div className="flex flex-wrap gap-4 justify-start">
        {cards.map((card, index) => (
          <div 
            key={index}
            style={{ width: "406px", height: "70px" }}
          >
            <CardRegistry
              {...card}
              onClick={() => onCardClick && onCardClick(card)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardRegistry;
