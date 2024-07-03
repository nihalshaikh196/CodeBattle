import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Leaderboard = () => {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/contest/getLeaderBoard/${contestId}`);
        // console.log(response);
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
  <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
    <h2 className="text-2xl font-bold text-center py-4 bg-purple-500 text-white">Leaderboard</h2>
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Solved Problems</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.userId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{entry.user.firstName}</td>
              <td className="border px-4 py-2">{entry.score}</td>
              <td className="border px-4 py-2">{entry.solvedProblems}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Leaderboard;