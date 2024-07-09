import { useAuth } from "../contexts/AuthContext";

const useContestServices = () => {
const { api, } = useAuth();

 

    const getFutureContests = async () => {
        try {
          const response = await api.get('/contest/futureContests');
          return response.data;
        } catch (error) {
          console.error('Error fetching future contests:', error);
          throw error;
        }
      };

      const getOngoingContests = async () => {
        try {
          const response = await api.get('/contest/ongoingContests');
          return response.data;
        } catch (error) {
          console.error('Error fetching ongoing contests:', error);
          throw error;
        }
      };

      const getPastContests = async () => {
        try {
          const response = await api.get('/contest/pastContests');
          return response.data;
        } catch (error) {
          console.error('Error fetching past contests:', error);
          throw error;
        }
      };

      const getContestDetails = async (contestId) => {
        try {
          const response = await api.get(`/contest/getContest/${contestId}`);
          // console.log(response);
          return response.data;
        } catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              throw new Error('Contest not found');
            }
            throw new Error(error.response.data.message || 'Failed to fetch contest details');
          } else if (error.request) {
            console.error('Error fetching contest details: No response received', error.request);
            throw new Error('No response received from server');
          } else {
            console.error('Error fetching contest details:', error.message);
            throw new Error('Error setting up the request');
          }
        }
      };
      const registerForContest = async (contestId) => {
        try {
          const response = await api.post(`/contest/register/${contestId}`);
          return {success:true, message:response.data.message};
        } catch (error) {
          if (error.response) {
            if(error.response.status===400){
              return {success:false,message:error.response.data.message}
            }
            throw new Error(error.response.data.message || 'Failed to register for contest');
          } else if (error.request) {

            console.error('Error registering for contest: No response received', error.request);
            throw new Error('No response received from server');
          } else {
            console.error('Error registering for contest:', error.message);
            throw new Error('Error setting up the request');
          }
        }

      };

      const isUserRegistered = async (contestId) => {
      try {
        const response = await api.get(`/contest/checkIfRegistered/${contestId}`);
        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response) {
          console.log (error.response.data.message || 'Failed to register for contest');
        } 
      
      }};

      const getUserSolvedProblems = async (contestId) => {
      try {
        const response = await api.get(`/contest/userSolvedProblems/${contestId}`);
        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response) {
          console.log (error.response.data.message || 'Failed to register for contest');
        } 
      
      }};
      

      return {
        getFutureContests,
        getOngoingContests,
        getPastContests,
        registerForContest,
        getContestDetails,
        isUserRegistered,
        getUserSolvedProblems
      };
}

export default useContestServices;