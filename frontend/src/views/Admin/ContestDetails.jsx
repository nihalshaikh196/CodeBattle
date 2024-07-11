import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavBar from '../../components/adminNavbar';
import useContestServices from '../../services/contestServices';
import Loader from '../../components/loader';

const ContestDetails = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const { getContestDetails } = useContestServices();

  useEffect(() => {
    fetchContestDetails();
  }, []);

  const fetchContestDetails = async () => {
    const details = await getContestDetails(contestId);
    // console.log(new Date(details.startTime).toLocaleString().slice(0, 16));
    setContest(details);
  };



  const navigateToLeaderboard = () => {
    navigate(`/admin/leaderBoard/${contestId}`);
  };

  const handleEdit = () => {
    navigate(`/admin/editContest/${contestId}`);
  };

  if (!contest) return <Loader />;

  const isContestOver = new Date() > new Date(contest.endTime);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminNavBar/>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-purple-600">{contest.title}</h1>
              <div className="space-x-4">
                <button
                  onClick={handleEdit}
                  className="py-2 px-4 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                  Edit Contest
                </button>
                <button
                  onClick={navigateToLeaderboard}
                  className={`py-2 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                    isContestOver
                      ? 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-400'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isContestOver}
                >
                  {isContestOver ? 'View Leaderboard' : 'Leaderboard Unavailable'}
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-6">{contest.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600">Start Time</p>
                <p className="text-lg">{new Date(contest.startTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">End Time</p>
                <p className="text-lg">{new Date(contest.endTime).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Problems</h2>
              {contest.problems && contest.problems.length > 0 ? (
                <ul className="space-y-4">
                  {contest.problems.map((problem) => (
                    <li key={problem._id} className="bg-gray-50 p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{problem.title}</h3>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          problem.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="mt-2">
                        {problem.tags && problem.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No problems have been added to this contest yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ContestDetails;