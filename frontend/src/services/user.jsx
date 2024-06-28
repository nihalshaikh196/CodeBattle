import { useAuth } from "../contexts/AuthContext";

const useUserServices = () => {
const { api, } = useAuth();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      // console.log(response);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
    }
  };
   const fetchAllProblems = async () => {
       try {
          const response = await api.get(`/problem/getAll`);
          // console.log(response.data); // This will log the actual data received from the API
          return response.data; // Return the data from the response
        } catch (error) {
          console.error('Error fetching problems:', error);
          throw error; // Re-throw the error so it can be caught in the frontend
        }
  };

   const fetchProblemWithID = async (data) => {
      try {
          const response = await api.get(`/problem/${data.problemId}`);
          // console.log(response.data); // This will log the actual data received from the API
          return response.data; // Return the data from the response
        } catch (error) {
          console.error('Error fetching problems:', error);
          throw error; // Re-throw the error so it can be caught in the frontend
        }
  };

  return{fetchProfile,updateProfile,fetchAllProblems,fetchProblemWithID};
}

export default useUserServices;