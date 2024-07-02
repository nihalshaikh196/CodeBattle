import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useContestServices from '../../services/contestServices';
import Loader from '../../components/loader';
import UserNavbar from '../../components/UserNavbar';

const ContestAttempt = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const { getContestDetails } = useContestServices();

  useEffect(() => {
    fetchContestDetails();
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

  if (!contest) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-4">{contest.title}</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600">Start Time</p>
                <p className="text-base text-gray-900">{new Date(contest.startTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">End Time</p>
                <p className="text-base  text-gray-900">{new Date(contest.endTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Time Remaining</p>
                <p className="text-base text-red-500">{timeRemaining}</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Problems</h2>
              {contest.problems.map((problem, index) => (
                <div key={problem._id} className="mb-4">
                  <Link to={`/user/problem/contest/${contestId}/${problem._id}`} className="text-xl font-semibold text-gray-700">
                    {index + 1}. {problem.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestAttempt;