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
      }
      else{
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

  useEffect(() => { 
 if(contest)handleContestAttempt();
  }, [contest, isRegistered]);

  if (!contest) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-4">{contest.title}</h1>
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
            <button
              disabled={isRegistered || new Date() > new Date(contest.endTime)}
              onClick={handleRegistration}
              className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                  new Date() > new Date(contest.endTime)
                  ? 'bg-gray-500 cursor-not-allowed':
                  isRegistered
                  ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400'            
                  : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-400'
              }`}
            >
              {new Date() > new Date(contest.endTime) ? 'Completed':isRegistered ? 'Registered' : 'Register for Contest'}
            </button>
          </div>
        </div>
      </div>

      <PopupDialog
        isOpen={isOpen}
        closeModal={closeModal}
        popupMessage={popupMessage}
        isSuccess={isRegistered}
      />
    </div>
  );
};

export default ContestDetails;