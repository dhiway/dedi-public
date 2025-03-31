import { useParams } from '@tanstack/react-router';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';

const RegistryDetail = () => {
  const { namespace_id } = useParams({ from: '/registries/$namespace_id' });
  
  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header title='REGISTRIES'/>
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card title='New Registry' description='data of xyz' imageUrl=''/>
        {/* Add more registry details here */}
      </div>
      </div>
    </div>
  );
};

export default RegistryDetail;