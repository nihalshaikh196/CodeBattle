import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavBar from '../../components/adminNavbar';
import useUserServices from '../../services/user';
import useAdminServices from '../../services/adminServices';
import useContestServices from '../../services/contestServices';
import PopupDialog from '../../components/Popup';
import Loader from '../../components/loader';
function EditContest() {
 const { contestId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minStartTime, setMinStartTime] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { fetchAllProblems } = useUserServices();
  const { updateContest } = useAdminServices();
  const { getContestDetails } = useContestServices();

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinStartTime(now.toISOString().slice(0, 16));

    // Fetch contest details and problems
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const contestDetails = await getContestDetails(contestId);
        
         const localStartTime = new Date(contestDetails.startTime);
          localStartTime.setMinutes(localStartTime.getMinutes() - localStartTime.getTimezoneOffset());

          const localEndTime = new Date(contestDetails.endTime);
          localEndTime.setMinutes(localEndTime.getMinutes() - localEndTime.getTimezoneOffset());

          setTitle(contestDetails.title);
          setDescription(contestDetails.description);
          setStartTime(localStartTime.toISOString().slice(0, 16));
          setEndTime(localEndTime.toISOString().slice(0, 16));
        setSelectedProblems(contestDetails.problems);

        const fetchedProblems = await fetchAllProblems();
        setProblems(fetchedProblems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    if (new Date(e.target.value) > new Date(endTime)) {
      setEndTime('');
    }
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblems(prev => 
      prev.some(p => p._id === problem._id)
        ? prev.filter(p => p._id !== problem._id)
        : [...prev, problem]
    );
  };

  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const problemIds = selectedProblems.map(p => p._id);

    try {
      const response = await updateContest(contestId, title, description, startDate, endDate, problemIds);
      if (response.success) {
        setPopupTitle("Success");
        setPopupMessage("Contest updated successfully!");
        setShowPopUp(true);
      } else {
        setPopupTitle("Error");
        setPopupMessage(response.error);
        setShowPopUp(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closePopup = () => {
    setShowPopUp(false);
    if (popupTitle === 'Success') {
      navigate('/admin/contests');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavBar/>
      <div className="container mx-auto px-4 py-8">
        {isLoading?(<Loader/>):(<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-6">Edit Contest</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title of Contest
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  min={minStartTime}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  min={startTime}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                  disabled={!startTime}
                />
              </div>
            </div>
            <div>
              <label htmlFor="problems" className="block text-sm font-medium text-gray-700 mb-2">
                Select Problems
              </label>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                {filteredProblems.map((problem) => (
                  <div 
                    key={problem._id} 
                    className={`p-3 border-b cursor-pointer ${
                      selectedProblems.some(p => p._id === problem._id) ? 'bg-purple-100' : ''
                    }`}
                    onClick={() => handleProblemSelect(problem)}
                  >
                    <h3 className="font-semibold">{problem.title}</h3>
                    <p className="text-sm text-gray-600">{problem.difficulty}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Update Contest
              </button>
            </div>
          </form>
        </div>)}
      </div>
      <PopupDialog
        isOpen={showPopUp}
        closeModal={closePopup}
        popupMessage={popupMessage}
        title={popupTitle}
      />
    </div>
  );
}

export default EditContest;