import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TODO List</h2>
      <p className="text-gray-600 mb-8">
        Manage your tasks efficiently with our task management system
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Tasks</h3>
          <p className="text-gray-600">
            Add new tasks with title, description, due date and priority
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Organize</h3>
          <p className="text-gray-600">
            Categorize tasks and set priorities for better organization
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
          <p className="text-gray-600">Mark tasks as complete and view your accomplishments</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
