import Card from "../../components/Card/Card";
import Doctorimg from "../../assets/doctor.jpg";
import demoimg from "../../assets/demo.jpg";
import demo2 from "../../assets/demo2.jpg";
import Header from "../../components/Header/Header";

const dummyData = [
  {
    digest:
      "0x4dfc74fec867c901fd0813023da48eec4ca5164aca14851c5a8a9267fdb82e4a",
    name: "Doctors-List",
    namespace_id:
      "namespace:cord:tioE1vviJDP9j7bHq1SDkyeqcGMTuguPMdbYZZQRhk6iK3eJh",
    description: "This is the namespace with list of doctors from 1947",
    created_at: "2025-03-26T15:29:25.003Z",
    updated_at: "2025-03-26T15:29:25.003Z",
    version_count: 1,
    version:
      "0xc79330fd1cea89eda23293d211888bc63804e358b4d4f0e217c20a2753dcdff2",
    registry_count: 67,
    ttl: 600,
    meta: {
      image: Doctorimg,
      displayName: "Doctors List",
      description: "NPCI is nation organization registry",
    },
  },
  {
    digest:
      "0x4dfc74fec867c901fd0813023da48eec4ca5164aca14851c5a8a9267fdb82e4a",
    name: "NPCI-List",
    namespace_id:
      "namespace:cord:tioE1vviJDP9j7bHq1SDkyeqcGMTuguPMdbYZZQRhk6iK3eJh",
    description: "This is the namespace with list of doctors from 1947",
    created_at: "2025-03-26T15:29:25.003Z",
    updated_at: "2025-03-26T15:29:25.003Z",
    version_count: 1,
    version:
      "0xc79330fd1cea89eda23293d211888bc63804e358b4d4f0e217c20a2753dcdff2",
    registry_count: 67,
    ttl: 600,
    meta: {
      image: demoimg,
      displayName: "NPCI",
      description: "NPCI is nation organization registry",
    },
  },
  {
    digest:
      "0x4dfc74fec867c901fd0813023da48eec4ca5164aca14851c5a8a9267fdb82e4a",
    name: "NPCI-List",
    namespace_id:
      "namespace:cord:tioE1vviJDP9j7bHq1SDkyeqcGMTuguPMdbYZZQRhk6iK3eJh",
    description: "This is the namespace with list of doctors from 1947",
    created_at: "2025-03-26T15:29:25.003Z",
    updated_at: "2025-03-26T15:29:25.003Z",
    version_count: 1,
    version:
      "0xc79330fd1cea89eda23293d211888bc63804e358b4d4f0e217c20a2753dcdff2",
    registry_count: 67,
    ttl: 600,
    meta: {
      image: demo2,
      displayName: "NPCI",
      description: "NPCI is nation organization registry",
    },
  },
  {
    digest:
      "0x4dfc74fec867c901fd0813023da48eec4ca5164aca14851c5a8a9267fdb82e4a",
    name: "NPCI-List",
    namespace_id:
      "namespace:cord:tioE1vviJDP9j7bHq1SDkyeqcGMTuguPMdbYZZQRhk6iK3eJh",
    description: "This is the namespace with list of doctors from 1947",
    created_at: "2025-03-26T15:29:25.003Z",
    updated_at: "2025-03-26T15:29:25.003Z",
    version_count: 1,
    version:
      "0xc79330fd1cea89eda23293d211888bc63804e358b4d4f0e217c20a2753dcdff2",
    registry_count: 67,
    ttl: 600,
    meta: {
      image: demo2,
      displayName: "NPCI",
      description: "NPCI is nation organization registry",
    },
  },
];

const Dashboard = () => {
  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text ">
      <Header />
      <div className="flex justify-center mt-5 w-full">
        <div className="relative mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Search Namespace"
            className="w-full p-3 pl-10 rounded-md bg-primary dark:bg-primary text-text dark:text-text border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
      <div className="p-5 max-w-9/12 mt-5 mx-auto max-h-[60%] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyData.map((item, index) => (
            <Card
              key={index}
              imageUrl={item.meta.image}
              title={item.meta.displayName}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
