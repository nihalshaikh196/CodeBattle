import { useAuth } from '../contexts/AuthContext';

 const useAuthServices = () => {
  const { api, setUserData } = useAuth();

   const registerAPI = async (data) => {
  
      try {
        const response = await api.post(`/auth/register`, data);
        return response;
      } catch (error) {
          return error.response;
      }
  };

  const loginAPI = async (data) => {
      try {
        const response = await api.post(`/auth/login`, data);
        setUserData({
          id: response.data.userInfo._id,
          email:response.data.userInfo.email,
          userType: response.data.userInfo.userType,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
        return response;
      } catch (error) {
          return error.response;
      }
  };


  return { registerAPI,loginAPI };
};

export default useAuthServices;
