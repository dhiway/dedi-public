import { useMemo } from "react";
import Doctorimg from "../../assets/doctor.jpg";

type cardProps = {
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
};

const colors = ["#445819", "#B1C29E", "#27548A", "#4F959D", "#9F8383"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Card = ({ title, description, imageUrl, onClick }: cardProps) => {
  const bgColor = useMemo(getRandomColor, []);

  return (
    <div
      className="rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out hover:cursor-pointer p-1"
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="relative">
        <img
          src={Doctorimg}
          alt={title}
          className="w-full h-45 object-fit rounded-xl"
        />
        <div
          className="absolute bottom-0 left-0 w-full h-30"
          style={{
            background: `linear-gradient(to top, ${bgColor}, transparent)`,
          }}
        ></div>
      </div>

      {/* Card Header */}
      <div className="p-3">
        <div className="uppercase tracking-wide text-white font-bold text-xl">
          {title}
        </div>
        <p className="mt-1 text-white">{description}</p>
      </div>
    </div>
  );
};

export default Card;
