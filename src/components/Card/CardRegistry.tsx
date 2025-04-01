import { useMemo } from "react";
import { timeAgo } from "../../utils/helper";

type cardProps = {
  title: string;
  description: string;
  record_count: number;
  updated_at: string;
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
}: cardProps) => {
  const background = useMemo(getRandomGradient, []);

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden border-gray-200/60 hover:shadow-inner  hover:brightness-110 hover:scale-102 transition-transform duration-300 ease-in-out rounded-xl shadow-lg text-white hover:cursor-pointer`}
      style={{ background }}
    >
      <div className="p-2 bg-linear-to-b  bg-black/[0.04] from-black/[0.04] to-transparent to-20% text-xs">
        {timeAgo(updated_at)}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-bold ">{title}</h3>
        <p className="text-sm mt-1 opacity-90">{description}</p>
      </div>
      <div className="p-2 bg-linear-to-b  bg-black/[0.04] from-black/[0.04] to-transparent to-20%">
        <p className="text-sm mt-1 opacity-90">Record Count: {record_count}</p>
      </div>
    </div>
  );
};

export default CardRegistry;

// {
//   digest:
//     "0x89935f8cc0f14fb185273e3d57f1eef64dc2c2ee75091e3d9c6aa80f36092c2b",
//   registry_id:
//     "registry:cord:bdqqLo7StDxse1kDQCyJb28UY3mjRPVYjAwxxmPXAgsCf3az3",
//   registry_name: "doctors_1963.csv",
//   description: "doctors_1963.csv",
//   created_by: "3yeUwsUtukp6s5UFyB2Fh1mMr2xJQ2YHg5hPEzSS286CV73A",
//   schema: {
//     "Sl.No": "number",
//     "Year of Info": "number",
//     "Registration Number": "number",
//     "State Medical Councils": "string",
//     Name: "string",
//     "Father Name": "string",
//   },
//   created_at: "2025-03-27T05:07:24.042Z",
//   updated_at: "2025-03-27T05:07:24.042Z",
//   record_count: 100,
//   version_count: 1,
//   version:
//     "0x7a36a445bb2922b13d929543f1c45104cf2f070279876173fe0de466508ca894",
//   query_allowed: true,
//   is_revoked: false,
//   is_archived: false,
//   delegates: [],
// },
