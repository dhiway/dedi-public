import { useMemo } from "react";

type cardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

const colors = ["#445819", "#34495E", "#8E44AD"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Card = ({ title, description, imageUrl }: cardProps) => {
  const bgColor = useMemo(getRandomColor, []);

  return (
    <div
      className="rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out hover:cursor-pointer"
      style={{ backgroundColor: bgColor }} // ✅ Set background color dynamically
    >
      {/* Card Image */}
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-45 object-fit" />
        <div
          className="absolute bottom-0 left-0 w-full h-30"
          style={{
            background: `linear-gradient(to top, ${bgColor}, transparent)`, // ✅ Apply gradient dynamically
          }}
        ></div>
      </div>

      {/* Card Header */}
      <div className="p-5">
        <div className="uppercase tracking-wide text-white font-bold text-xl">
          {title}
        </div>
        <p className="mt-2 text-white">{description}</p>
      </div>
    </div>
  );
};

export default Card;
