import { useMemo } from "react";
import { normalization, timeAgo } from "../../utils/helper";

type CardProps = {
  title: string;
  description: string;
  record_count: number;
  updated_at: string;
  onClick?: () => void;
};

const colors = [
  ["#4f39f6", "#ff758c"],
  ["#4a5565", "#4a5565"],
  ["#e17100", "#e7000b"],
  ["#4f39f6", "#4a5565"],
  ["#e60076", "#4f39f6"],
  ["#009966", "#e17100"],
];

// Function to get a consistent gradient based on the title
const getStaticGradient = (title: string) => {
  // Use a hash of the title to pick a consistent color from the colors array
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  const [color1, color2] = colors[index];
  return `linear-gradient(to bottom right, ${color1}, ${color2})`;
};

const CardRegistry = ({
  title,
  description,
  record_count,
  updated_at,
  onClick,
}: CardProps) => {
  // Use useMemo to compute the static gradient only when the title changes
  const background = useMemo(() => getStaticGradient(title), [title]);

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden border-gray-200/60 hover:shadow-inner hover:brightness-110 hover:scale-102 transition-transform duration-300 ease-in-out rounded-xl shadow-lg text-white hover:cursor-pointer`}
      style={{ background }}
      onClick={onClick}
    >
      <div className="p-2 bg-linear-to-b bg-black/[0.04] from-black/[0.04] to-transparent to-20% text-xs">
        {timeAgo(updated_at)}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-bold ">{normalization(title)}</h3>
        <p className="text-sm mt-1 opacity-90">{description}</p>
      </div>
      <div className="p-2 bg-linear-to-b bg-black/[0.04] from-black/[0.04] to-transparent to-20%">
        <p className="text-sm mt-1 opacity-90">Record Count: {record_count}</p>
      </div>
    </div>
  );
};

export default CardRegistry;
