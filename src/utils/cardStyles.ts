import colorData from '../data/color.json';

// Define color associations for different types of cards
export type ColorType = {
  dotColorClass: string;
  colorScheme: 'orange' | 'violet' | 'red' | 'lime' | 'fuchsia' | 'blue' | 'cyan' | 'green' | 'yellow' | 'indigo';
};

// Define types for our JSON data structure
type ColorScheme = 'orange' | 'violet' | 'red' | 'lime' | 'fuchsia' | 'blue' | 'cyan' | 'green' | 'yellow' | 'indigo';

interface ColorDataType {
  colorMap: Record<string, ColorType>;
  gradients: Record<ColorScheme, string>;
  borders: Record<ColorScheme, string>;
}

// Type assertion for imported data
const typedColorData = colorData as ColorDataType;

// Function to determine the color based on title
export const getCardColor = (title: string): ColorType => {
  const lowerTitle = title.toLowerCase();
  const colorMap = typedColorData.colorMap;
  
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
export function getHoverGradient(colorScheme: ColorScheme | string): string {
  const gradients = typedColorData.gradients;
  return gradients[colorScheme as ColorScheme] || gradients.blue;
}

// Helper function to get the hover border class based on color scheme
export function getHoverBorder(colorScheme: ColorScheme | string): string {
  const borders = typedColorData.borders;
  return borders[colorScheme as ColorScheme] || borders.blue;
} 