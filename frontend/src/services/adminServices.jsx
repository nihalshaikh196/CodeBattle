import { useAuth } from "../contexts/AuthContext";

const useAdminServices = () => {
const { api, } = useAuth();


const uploadProblem = async (title, description, difficulty, testCases, tags, constraints) => {
  try {
    const response = await api.post('/problem/uploadProblem', { title, description, difficulty, testCases, tags, constraints });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error uploading problem:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to upload problem' };
  }
};

  const updateProblem = async (problemId,title, description, difficulty, testCases, tags, constraints) => {
    try {
      const response = await api.put(`/problem/updateProblem/${problemId}`,  title, description, difficulty, testCases, tags, constraints );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error uploading problem:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to upload problem' };
    }
  };

  const scheduleContest = async (title, description, startTime, endTime, problems) => {
    // console.log(title, description, startTime, endTime, problems);
    try {
      const response = await api.post('/contest/createContest', { title, description, startTime, endTime, problems });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error scheduling contest:', error);
      return { success: false, error: error.response?.data?.error|| 'Failed to schedule contest' };
    }
  };

  const updateContest = async (contestId,title, description, startTime, endTime, problems) => {
    // console.log(title, description, startTime, endTime, problems);
    try {
      const response = await api.put(`/contest/modifyContest/${contestId}`, { title, description, startTime, endTime, problems });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error scheduling contest:', error);
      return { success: false, error: error.response?.data?.error|| 'Failed to schedule contest' };
    }
  };

  const getProblem = async (problemId) => {
      try {
          const response = await api.get(`/problem/${problemId}`);
          // console.log(response.data); // This will log the actual data received from the API
          return response.data; // Return the data from the response
        } catch (error) {
          console.error('Error fetching problems:', error);
          throw error; // Re-throw the error so it can be caught in the frontend
        }
  };


  
  return{uploadProblem,scheduleContest,updateContest,getProblem,updateProblem};
}

export default useAdminServices;