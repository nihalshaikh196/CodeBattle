import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/loader';
import UserNavBar from '../../components/UserNavbar';

const LeaderBoard = () => {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contest/getLeaderBoard/${contestId}`);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [contestId]);

  if (loading) return (
    <>
      <UserNavBar />
      <Loader />
    </>
  );

  if (error) return (
    <>
      <UserNavBar />
      <div className="text-red-500 text-center text-xl mt-10">{error}</div>
    </>
  );

  if (leaderboard.length === 0) {
    return (
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <UserNavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Leaderboard Not Available</h2>
            <p className="text-gray-600 mb-6 text-lg">The leaderboard for this contest is not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserNavBar />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-purple-900 mb-8">Leaderboard</h2>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-purple-500">
              <h3 className="text-lg leading-6 font-medium text-white">Contest Rankings</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <li key={entry.userId} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${index < 3 ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                        <span className="text-2xl font-bold">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{entry.user.firstName}</div>
                        <div className="text-sm text-gray-500">Solved: {entry.solvedProblems}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Score</div>
                      <div className="text-2xl font-bold text-purple-600">{entry.score}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;