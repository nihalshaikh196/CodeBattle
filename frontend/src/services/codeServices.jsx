import { useAuth } from "../contexts/AuthContext";

const useCodeServices = () => {
const { api, } = useAuth();

 

  const runCode = async (code,language,testCase) => {
    // console.log(code,language,testCase);
    try {
     
        const response = await api.post('/compiler/run', {code,language,testCase});
      
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error running code:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to run Code' };
    }
  };
  
  return{runCode};
}

export default useCodeServices;