import Header from "../../components/Header/Header";
import CardRegistry from "../../components/Card/CardRegistry";

const Registry = () => {
  const registryData = [
    {
      digest:
        "0x107ae91d89697f76f63da2634eccea1f23d371a1be4a5f5db82f26547e977d4c",
      registry_id:
        "registry:cord:bdnsA5RAPs3ch5DRDtHFCUSTVgQkKPeDPuiMh8h8gFTahoHY9",
      registry_name: "doctors_1961.csv",
      description: "doctors_1961.csv",
      created_by: "3yeUwsUtukp6s5UFyB2Fh1mMr2xJQ2YHg5hPEzSS286CV73A",
      schema: {
        "Sl.No": "number",
        "Year of Info": "number",
        "Registration Number": "string",
        "State Medical Councils": "string",
        Name: "string",
        "Father Name": "string",
      },
      created_at: "2025-03-27T05:07:34.405Z",
      updated_at: "2025-03-27T05:07:34.405Z",
      record_count: 1000,
      version_count: 1,
      version:
        "0x08eef9b9ef84b5a841db543565d284a2c511d77f6f5acba97cb89a450d7b7260",
      query_allowed: true,
      is_revoked: false,
      is_archived: false,
      delegates: [],
    },
    {
      digest:
        "0xe139c9ce1e521280415b5675ddb2434f6edb6847ef4dde663a844e803d104e06",
      registry_id:
        "registry:cord:bdnYzhgvaJqzZgr8LYMHPW9u9c3KwokUWEaT8enYNHpqC437e",
      registry_name: "doctors_1962.csv",
      description: "doctors_1962.csv",
      created_by: "3yeUwsUtukp6s5UFyB2Fh1mMr2xJQ2YHg5hPEzSS286CV73A",
      schema: {
        "Sl.No": "number",
        "Year of Info": "number",
        "Registration Number": "number",
        "State Medical Councils": "string",
        Name: "string",
        "Father Name": "string",
      },
      created_at: "2025-03-27T05:07:29.204Z",
      updated_at: "2025-03-27T05:07:29.204Z",
      record_count: 120,
      version_count: 1,
      version:
        "0x6d33213d2742ca860e812b6bfa25309283fdd14c6b73c2fb40ecaf92a0d495cb",
      query_allowed: true,
      is_revoked: false,
      is_archived: false,
      delegates: [],
    },
    {
      digest:
        "0x89935f8cc0f14fb185273e3d57f1eef64dc2c2ee75091e3d9c6aa80f36092c2b",
      registry_id:
        "registry:cord:bdqqLo7StDxse1kDQCyJb28UY3mjRPVYjAwxxmPXAgsCf3az3",
      registry_name: "doctors_1963.csv",
      description: "doctors_1963.csv",
      created_by: "3yeUwsUtukp6s5UFyB2Fh1mMr2xJQ2YHg5hPEzSS286CV73A",
      schema: {
        "Sl.No": "number",
        "Year of Info": "number",
        "Registration Number": "number",
        "State Medical Councils": "string",
        Name: "string",
        "Father Name": "string",
      },
      created_at: "2025-03-27T05:07:24.042Z",
      updated_at: "2025-03-27T05:07:24.042Z",
      record_count: 100,
      version_count: 1,
      version:
        "0x7a36a445bb2922b13d929543f1c45104cf2f070279876173fe0de466508ca894",
      query_allowed: true,
      is_revoked: false,
      is_archived: false,
      delegates: [],
    },
    {
      digest:
        "0xe9ff1f2896422bbf8e77c1d0db17f26fe3544a2aea388c9e7dd94a1a33233ddd",
      registry_id:
        "registry:cord:bdpzWpPdx63chf53KDxP8YBDi2NroRsEUw3iLeL1wao54WWtk",
      registry_name: "doctors_1964.csv",
      description: "doctors_1964.csv",
      created_by: "3yeUwsUtukp6s5UFyB2Fh1mMr2xJQ2YHg5hPEzSS286CV73A",
      schema: {
        "Sl.No": "number",
        "Year of Info": "number",
        "Registration Number": "number",
        "State Medical Councils": "string",
        Name: "string",
        "Father Name": "string",
      },
      created_at: "2025-03-27T05:07:19.314Z",
      updated_at: "2025-03-27T05:07:19.314Z",
      record_count: 10,
      version_count: 1,
      version:
        "0xe5c6fd467982c2f47156985e47c3ba0b04675b20e6e992eaa26567719c8d0cf5",
      query_allowed: true,
      is_revoked: false,
      is_archived: false,
      delegates: [],
    },
    {
      digest:
        "0xc78fad3082eb1c9456398e5ec4e6754754764aad93702f7bae504f4ae163a16a",
      registry_id:
        "registry:cord:bdq7KARLtFhuWj5EQsW7LUf1S78irmmH3AsR4djfbZF7MALG7",
      registry_name: "doctors_1965.csv",
      description: "doctors_1965.csv",
      created_by: "3yeUwsUtukp6s5UFyB2Fh1mMr2xJQ2YHg5hPEzSS286CV73A",
      schema: {
        "Sl.No": "number",
        "Year of Info": "number",
        "Registration Number": "number",
        "State Medical Councils": "string",
        Name: "string",
        "Father Name": "string",
      },
      created_at: "2025-03-27T05:07:12.718Z",
      updated_at: "2025-03-27T05:07:12.718Z",
      record_count: 90,
      version_count: 1,
      version:
        "0xb5ceb35010708d6974ba38d33126e738fb1fb23d30dc234c02a12a1985fae98a",
      query_allowed: true,
      is_revoked: false,
      is_archived: false,
      delegates: [],
    },
  ];
  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header title="REGISTRIES" />
      <div className="flex justify-center mt-5 w-full">
        <div className="relative mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Search Registries"
            className="w-full p-3 pl-10 rounded-md bg-primary dark:bg-primary text-text dark:text-text border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
      <div className="p-5 max-w-9/12 mt-5 mx-auto max-h-[60%] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {registryData.map((item, index) => (
            <CardRegistry
              key={index}
              title={item.registry_name}
              description={item.description}
              record_count={item.record_count}
              updated_at={item.updated_at}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Registry;
