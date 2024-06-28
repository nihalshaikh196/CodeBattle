import {  useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useUserServices from '../../services/user';
import Loader from '../../components/loader';

const ProfileMenu = () => {
  const { user } = useAuth();
  const { fetchProfile } = useUserServices();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchProfile();
        // console.log(response);
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [user.id]);

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <label className="block text-gray-700">First Name:</label>
        <div className="p-2 border rounded">{profile.firstName}</div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Last Name:</label>
        <div className="p-2 border rounded">{profile.lastName}</div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <div className="p-2 border rounded">{profile.email}</div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">User Type:</label>
        <div className="p-2 border rounded">{profile.userType}</div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Rating:</label>
        <div className="p-2 border rounded">{profile.rating}</div>
      </div>
    </div>
  );
};

export default ProfileMenu;