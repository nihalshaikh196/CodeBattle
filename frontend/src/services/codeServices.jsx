import { useAuth } from "../contexts/AuthContext";

const useCodeServices = () => {
const { api, } = useAuth();

 

  const runCode = async (code,language,input) => {
    // console.log(code,language,testCase);
    try {
     
        const response = await api.post('/compiler/run', {code,language,input});
      
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error running code:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to run Code' };
    }
  };

  const submitPractice = async (code, language, problemId) => {
    try {
      const response = await api.post('/compiler/submitPractice', { code, language, problemId });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting code:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to submit code' };
    }
  };

  const submitContest = async (code, language, problemId,contestId) => {
    try {
      const response = await api.post('/compiler/submitContest', { code, language, problemId,contestId });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting code:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to submit code' };
    }
  };
  
  
  return{runCode,submitPractice,submitContest};
}

export default useCodeServices;