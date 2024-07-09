import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import useContestServices from '../../services/contestServices';
import Loader from '../../components/loader';
import PopupDialog from '../../components/Popup';

const ContestDetails = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { getContestDetails, registerForContest, isUserRegistered } = useContestServices();

  useEffect(() => {
    fetchContestDetails();
    checkRegistrationStatus();
  }, [isRegistered]);

  const fetchContestDetails = async () => {
    const details = await getContestDetails(contestId);
    setContest(details);
  };

  const checkRegistrationStatus = async () => {
    const status = await isUserRegistered(contestId);
    setIsRegistered(status.success);
  };

  const handleRegistration = async () => {
    if (!isRegistered) {
      const status = await registerForContest(contestId);
      setPopupMessage(status.message);
      
      if (status.success) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleContestAttempt = () => {
    if (isRegistered && new Date() >= new Date(contest.startTime) && new Date() <= new Date(contest.endTime)) {
      navigate(`/user/contestAttempt/${contestId}`);
    }
  }; 

  const navigateToLeaderboard = () => {
    navigate(`/user/leaderboard/${contestId}`);
  };

  useEffect(() => { 
    if(contest) handleContestAttempt();
  }, [contest, isRegistered]);

  if (!contest) return <Loader />;

  const isContestOver = new Date() > new Date(contest.endTime);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-6">{contest.title}</h1>
            <p className="text-gray-600 mb-8">{contest.description}</p>
            
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
                <p className="text-sm font-semibold text-purple-600 mb-2">Status</p>
                <p className={`text-lg font-bold ${isContestOver ? 'text-red-500' : 'text-green-500'}`}>
                  {isContestOver ? 'Contest Over' : 'Active'}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                disabled={isRegistered || isContestOver}
                onClick={handleRegistration}
                className={`flex-1 py-3 px-6 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                  isContestOver
                    ? 'bg-gray-500 cursor-not-allowed'
                    : isRegistered
                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400'            
                    : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-400'
                }`}
              >
                {isContestOver ? 'Contest Completed' : isRegistered ? 'Registered' : 'Register for Contest'}
              </button>
              <button
                onClick={navigateToLeaderboard}
                className={`flex-1 py-3 px-6 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
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
        </div>
      </div>

      <PopupDialog
        isOpen={isOpen}
        closeModal={closeModal}
        popupMessage={popupMessage}
        title={isRegistered ? 'Success' : 'Warning'}
      />
    </div>
  );
};

export default ContestDetails;