import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useContestServices from '../../services/contestServices';
import AdminNavBar from '../../components/adminNavbar';
import NoData from "../../assets/svg/NoData.svg";

function Contests() {
  const [contests, setContests] = useState([]);
  const [filter, setFilter] = useState('all');
  const { getFutureContests, getOngoingContests, getPastContests } = useContestServices();

  useEffect(() => {
    fetchContests();
  }, [filter]);

  const fetchContests = async () => {
    let futureContests = [];
    let ongoingContests = [];
    let pastContests = [];

    if (filter === 'all' || filter === 'future') {
      futureContests = await getFutureContests();
    }
    if (filter === 'all' || filter === 'ongoing') {
      ongoingContests = await getOngoingContests();
    }
    if (filter === 'past') {
      pastContests = await getPastContests();
    }

    const allContests = [...ongoingContests, ...futureContests, ...pastContests];
    allContests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    setContests(allContests);
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Contests</h1>
          <div className="flex items-center space-x-4">
            <select
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              className="bg-white border w-48 border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Contests</option>
              <option value="ongoing">Ongoing Contests</option>
              <option value="future">Future Contests</option>
              <option value="past">Past Contests</option>
            </select>
            <Link
              to="/admin/scheduleContest"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              Schedule Contest
            </Link>
          </div>
        </div>
        {contests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <Link to={`/admin/contest/${contest._id}`} key={contest._id} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl text-purple-500 font-semibold mb-2">{contest.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{contest.description}</p>
                <p className="text-xs text-gray-500">Start: {new Date(contest.startTime).toLocaleString()}</p>
                <p className="text-xs text-gray-500">End: {new Date(contest.endTime).toLocaleString()}</p>
                {new Date() >= new Date(contest.startTime) && new Date() <= new Date(contest.endTime) && (
                  <p className='text-sm mt-3 text-green-500'>Ongoing</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <img src={NoData} className="h-60 w-60 text-gray-400" alt="No Data" />
            <p className="mt-4 text-xl font-semibold text-gray-600">No contests to show</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contests;