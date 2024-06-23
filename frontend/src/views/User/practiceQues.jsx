import { useEffect, useState } from 'react';
import UserNavbar from '../../components/UserNavbar';
import { Link } from 'react-router-dom';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    // Fetch the problems from the backend
    fetch('http://localhost:3000/admin/problems')
      .then(response => response.json())
      .then(data => setProblems(data))
      .catch(error => console.error('Error fetching problems:', error));
  }, []);

  return (
    <>
    <UserNavbar/>
    <div className="p-4 space-y-4">
      {problems.map((problem) => (
        <Link to={`/user/problem/${problem._id}`} key={problem._id} className="block">
        <div key={problem._id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{problem.title}</h3>
            <div className="mt-2">
              {problem.tags.map((tag, index) => (
                <span key={index} className="inline-block mr-2 px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className={`text-lg font-bold ${problem.difficulty === 'Easy' ? 'text-green-500' : problem.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
            {problem.difficulty}
          </div>
        </div>
        </Link>
      ))}
    </div></>
  );
};

export default ProblemList;
