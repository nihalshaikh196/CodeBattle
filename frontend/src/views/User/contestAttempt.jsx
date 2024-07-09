import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useContestServices from '../../services/contestServices';
import Loader from '../../components/loader';
import UserNavbar from '../../components/UserNavbar';

const ContestAttempt = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [solvedProblems, setSolvedProblems] = useState([]);
  const { getContestDetails, getUserSolvedProblems } = useContestServices();

  useEffect(() => {
    fetchContestDetails();
    fetchUserSolvedProblems();
  }, []);

  useEffect(() => {
    if (contest) {
      const interval = setInterval(() => {
        const endTime = new Date(contest.endTime).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = endTime - currentTime;

        if (timeDiff <= 0) {
          clearInterval(interval);
          setTimeRemaining('Contest is over');
        } else {
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [contest]);

  const fetchContestDetails = async () => {
    const details = await getContestDetails(contestId);
    setContest(details);
  };

  const fetchUserSolvedProblems = async () => {
    const response = await getUserSolvedProblems(contestId);
    const solvedStatus = response.solvedProblems;
    const solvedProblemIds = Object.keys(solvedStatus).filter(id => solvedStatus[id]);
    setSolvedProblems(solvedProblemIds);
  };

  if (!contest) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-6">{contest.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-purple-600 mb-2">Start Time</p>
                <p className="text-lg text-gray-900">{new Date(contest.startTime).toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-purple-600 mb-2">End Time</p>
                <p className="text-lg text-gray-900">{new Date(contest.endTime).toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-purple-600 mb-2">Time Remaining</p>
                <p className="text-lg font-bold text-red-500">{timeRemaining}</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-600 mb-6">Problems</h2>
              <div className="space-y-4">
                {contest.problems.map((problem, index) => (
                  <Link 
                    key={problem._id} 
                    to={`/user/problem/contest/${contestId}/${problem._id}`} 
                    className={`block p-4 rounded-lg transition duration-300 ease-in-out 
                      ${solvedProblems.includes(problem._id) 
                        ? 'bg-green-100 hover:bg-green-200 border-l-4 border-green-500' 
                        : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-gray-700">
                        {index + 1}. {problem.title}
                      </span>
                      {solvedProblems.includes(problem._id) && (
                        <span className="flex items-center text-green-500">
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Solved
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestAttempt;