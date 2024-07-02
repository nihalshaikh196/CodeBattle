import { useEffect, useState } from 'react';
import UserNavbar from '../../components/UserNavbar';
import { Link, Navigate } from 'react-router-dom';
import useUserServices from '../../services/user';
import { useProtectedRoute } from '../../contexts/AuthContext';
import Loader from '../../components/loader';
const ProblemList = () => {
  const isAuthorized = useProtectedRoute(['user']);

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchAllProblems } = useUserServices();
  useEffect(() => {
    // Fetch the problems from the backend
    if(!isAuthorized) return(<Navigate to='/unauthorized'></Navigate>);
     const getProblem = async () => {
      try {
        const response = await fetchAllProblems();
        setProblems(response);
        setLoading(false);
      } catch (error) {
        // setError(error);
        console.log(error);
      }
    };
    getProblem();
  }, []);

  return (
    <>
    <UserNavbar/>
    {loading? <Loader /> : '' }
    <div className="p-4 space-y-4">
      {problems.map((problem) => (
        <Link to={`/user/problem/practice/${problem._id}`} key={problem._id} className="block">
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
