import { useMemo } from "react";
import { normalization } from "../../utils/helper";

// Define color associations for different types of cards
type ColorType = {
  dotColorClass: string;
  colorScheme: 'orange' | 'violet' | 'red' | 'lime' | 'fuchsia' | 'blue' | 'cyan' | 'green' | 'yellow' | 'indigo';
};

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

// Map card types to their corresponding color classes
const colorMap: Record<string, ColorType> = {
  transformers: {
    dotColorClass: "bg-orange-500",
    colorScheme: "orange"
  },
  diffusers: {
    dotColorClass: "bg-violet-500",
    colorScheme: "violet"
  },
  datasets: {
    dotColorClass: "bg-red-500",
    colorScheme: "red"
  },
  tokenizers: {
    dotColorClass: "bg-lime-500",
    colorScheme: "lime"
  },
  evaluate: {
    dotColorClass: "bg-fuchsia-500",
    colorScheme: "fuchsia"
  },
  timm: {
    dotColorClass: "bg-blue-500",
    colorScheme: "blue"
  },
  sentence: {
    dotColorClass: "bg-cyan-500",
    colorScheme: "cyan"
  },
  inference: {
    dotColorClass: "bg-green-500",
    colorScheme: "green"
  },
  peft: {
    dotColorClass: "bg-yellow-500",
    colorScheme: "yellow"
  },
  accelerate: {
    dotColorClass: "bg-indigo-500",
    colorScheme: "indigo"
  },
  default: {
    dotColorClass: "bg-blue-500",
    colorScheme: "blue"
  }
};

// Function to determine the color based on title
const getCardColor = (title: string): ColorType => {
  const lowerTitle = title.toLowerCase();
  
  // Use a hash function to ensure consistent color selection
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Try to match by keyword first
  for (const [keyword, color] of Object.entries(colorMap)) {
    if (lowerTitle.includes(keyword)) {
      return color;
    }
  }
  
  // If no keyword matches, use hash to pick a consistent color
  const colorKeys = Object.keys(colorMap).filter(key => key !== 'default');
  const index = Math.abs(hash) % colorKeys.length;
  return colorMap[colorKeys[index]] || colorMap.default;
};

// Helper function to get the appropriate gradient class based on color scheme
function getHoverGradient(colorScheme: string): string {
  const lightModeGradients: Record<string, string> = {
    orange: 'from-orange-100 to-orange-50/60 dark:from-orange-900/30 dark:to-orange-950/20',
    violet: 'from-violet-100 to-violet-50/60 dark:from-violet-900/30 dark:to-violet-950/20',
    red: 'from-red-100 to-red-50/60 dark:from-red-900/30 dark:to-red-950/20',
    lime: 'from-lime-100 to-lime-50/60 dark:from-lime-900/30 dark:to-lime-950/20',
    fuchsia: 'from-fuchsia-100 to-fuchsia-50/60 dark:from-fuchsia-900/30 dark:to-fuchsia-950/20',
    blue: 'from-blue-100 to-blue-50/60 dark:from-blue-900/30 dark:to-blue-950/20',
    cyan: 'from-cyan-100 to-cyan-50/60 dark:from-cyan-900/30 dark:to-cyan-950/20',
    green: 'from-green-100 to-green-50/60 dark:from-green-900/30 dark:to-green-950/20',
    yellow: 'from-yellow-100 to-yellow-50/60 dark:from-yellow-900/30 dark:to-yellow-950/20',
    indigo: 'from-indigo-100 to-indigo-50/60 dark:from-indigo-900/30 dark:to-indigo-950/20'
  };

  return lightModeGradients[colorScheme] || lightModeGradients.blue;
}

// Helper function to get the hover border class based on color scheme
function getHoverBorder(colorScheme: string): string {
  const borderClasses: Record<string, string> = {
    orange: 'group-hover:border-orange-300/50 dark:group-hover:border-orange-700/50',
    violet: 'group-hover:border-violet-300/50 dark:group-hover:border-violet-700/50',
    red: 'group-hover:border-red-300/50 dark:group-hover:border-red-700/50',
    lime: 'group-hover:border-lime-300/50 dark:group-hover:border-lime-700/50',
    fuchsia: 'group-hover:border-fuchsia-300/50 dark:group-hover:border-fuchsia-700/50',
    blue: 'group-hover:border-blue-300/50 dark:group-hover:border-blue-700/50',
    cyan: 'group-hover:border-cyan-300/50 dark:group-hover:border-cyan-700/50',
    green: 'group-hover:border-green-300/50 dark:group-hover:border-green-700/50',
    yellow: 'group-hover:border-yellow-300/50 dark:group-hover:border-yellow-700/50',
    indigo: 'group-hover:border-indigo-300/50 dark:group-hover:border-indigo-700/50'
  };

  return borderClasses[colorScheme] || borderClasses.blue;
}

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
    <a 
      className={`group relative rounded-lg border border-gray-200 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/50 px-6 py-3
                 dark:border-gray-800 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-950
                 hover:shadow-md ${hoverBorder}
                 transition-all duration-300 ease-in-out flex items-center w-full h-full`}
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
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
    </a>
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
