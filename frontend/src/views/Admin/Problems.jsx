import { useEffect, useState } from 'react';
import AdminNavBar from '../../components/adminNavbar';
import { Link, Navigate } from 'react-router-dom';
import useUserServices from '../../services/user';
import { useProtectedRoute } from '../../contexts/AuthContext';
import Loader from '../../components/loader';
import { motion } from 'framer-motion';

const ProblemList = () => {
  const isAuthorized = useProtectedRoute(['admin']);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const { fetchAllProblems } = useUserServices();

  useEffect(() => {
    if (!isAuthorized) return <Navigate to='/unauthorized' />;
    const getProblem = async () => {
      try {
        const response = await fetchAllProblems();
        setProblems(response);
        setFilteredProblems(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getProblem();
  }, [isAuthorized, fetchAllProblems]);

  useEffect(() => {
    const filtered = problems.filter(problem => 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTags.length === 0 || selectedTags.every(tag => problem.tags.includes(tag)))
    );
    setFilteredProblems(filtered);
  }, [searchTerm, selectedTags, problems]);

  const allTags = [...new Set(problems.flatMap(problem => problem.tags))];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-500 mb-6">Problem List</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tag Filters */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Filter by Tags:</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-purple-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {filteredProblems.map((problem) => (
              <motion.div
                key={problem._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link to={`/admin/editProblem/${problem._id}`} className="block">
                  <div className="p-4 bg-white shadow-sm rounded-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></div>
                        <h3 className="text-lg font-semibold text-gray-800">{problem.title}</h3>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {problem.tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Hard':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default ProblemList;