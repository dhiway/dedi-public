import { useMemo } from "react";
import { normalization, timeAgo } from "../../utils/helper";

type cardProps = {
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

const getRandomGradient = () => {
  const [color1, color2] = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(to bottom right, ${color1}, ${color2})`;
};

const CardRegistry = ({
  title,
  description,
  record_count,
  updated_at,
  onClick,
}: cardProps) => {
  const background = useMemo(getRandomGradient, []);

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden border-gray-200/60 hover:shadow-inner  hover:brightness-110 hover:scale-102 transition-transform duration-300 ease-in-out rounded-xl shadow-lg text-white hover:cursor-pointer`}
      style={{ background }}
      onClick={onClick}
    >
      <div className="p-2 bg-linear-to-b  bg-black/[0.04] from-black/[0.04] to-transparent to-20% text-xs">
        {timeAgo(updated_at)}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-bold ">{normalization(title)}</h3>
        <p className="text-sm mt-1 opacity-90">{description}</p>
      </div>
      <div className="p-2 bg-linear-to-b  bg-black/[0.04] from-black/[0.04] to-transparent to-20%">
        <p className="text-sm mt-1 opacity-90">Record Count: {record_count}</p>
      </div>
    </div>
  );
};

export default CardRegistry;
