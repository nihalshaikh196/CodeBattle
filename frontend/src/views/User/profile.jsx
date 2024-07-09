import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useUserServices from '../../services/user';
import Loader from '../../components/loader';
import UserNavbar from '../../components/UserNavbar';
import PropTypes from 'prop-types';

const ProfileMenu = () => {
  const { user } = useAuth();
  const { fetchProfile } = useUserServices();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchProfile();
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
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-800">Profile</h2>
          <p className="text-purple-600">Your personal information</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="First Name" value={profile.firstName} />
          <ProfileField label="Last Name" value={profile.lastName} />
          <ProfileField label="Email" value={profile.email} />
          <ProfileField label="Rating" value={profile.rating} />
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
    <label className="block text-sm font-medium text-purple-700 mb-1">{label}</label>
    <div className="text-lg font-semibold text-purple-900">{value}</div>
  </div>
);

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default ProfileMenu;