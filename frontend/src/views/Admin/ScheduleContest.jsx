import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../components/adminNavbar';
import useUserServices from '../../services/user';
import useAdminServices from '../../services/adminServices';
import PopupDialog from '../../components/Popup';
function ScheduleContest() {
   const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minStartTime, setMinStartTime] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopUp,setShowPopUp] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');


  const navigate = useNavigate();
  const { fetchAllProblems } = useUserServices();
  const {  scheduleContest } = useAdminServices();

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinStartTime(now.toISOString().slice(0, 16));

    // Fetch problems from the database
    const getProblems = async () => {
      try {
        const fetchedProblems = await fetchAllProblems();
        setProblems(fetchedProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    getProblems();
  }, []);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setEndTime('');
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblems(prev => 
      prev.includes(problem) 
        ? prev.filter(p => p !== problem) 
        : [...prev, problem]
    );
  };

  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async(e) => {
    e.preventDefault();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    

      const problems=selectedProblems.map(p => p._id); // Only send problem IDs
   

    
    // Here you would send the formattedData to your backend

    try {
      const response = await scheduleContest(title,description, startDate, endDate, problems);
      if (response.success) {
        setPopupTitle("Success");
        setPopupMessage("Contest scheduled successfully!");
        setShowPopUp(true);
        // Navigate to the contests page or redirect to the scheduled contest page
      } else {
        alert(response.error);
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
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-6">Schedule New Contest</h1>
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
                  min={startTime} // Set min to startTime
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                  disabled={!startTime} // Disable end time input until start time is selected
                />
              </div>
            </div>

             <div>
              <label htmlFor="problems" className="block text-sm font-medium text-gray-700 mb-2">
                Select Problems (Optional)
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
                      selectedProblems.includes(problem) ? 'bg-purple-100' : ''
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
                Schedule Contest
              </button>
            </div>
          </form>
        </div>
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

export default ScheduleContest;