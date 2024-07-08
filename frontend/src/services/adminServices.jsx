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
  
  return{uploadProblem};
}

export default useAdminServices;