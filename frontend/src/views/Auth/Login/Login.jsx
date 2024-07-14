import AuthNavbar from "../../../components/authNavbar";
import logo from "../../../assets/svg/logo_noText.svg";
import { Link,useNavigate } from "react-router-dom";
import useAuthServices from '../../../services/auth';
import { useState } from "react";

function Login() {

  const { loginAPI } = useAuthServices();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; 
    }

    try {
      const response = await loginAPI(formData);
      // console.log(response);
      if (response.status==200) {
        setSuccessMessage('Welcome Back!');
        setTimeout(() => {
          setSuccessMessage(null);
         if(response.data.userInfo.userType=="user"){
          navigate('/user/home');
         }else{
          navigate('/admin/home');
         }
        }, 2000);
      } else if (response.status==400) {
        // Handle error response
        setServerError(response.data.message);
        setTimeout(() => {
          setServerError(null);
        }, 2000);
      } else if (response.status==500) {
        setServerError('An error occurred. Please try again.');
         setTimeout(() => {
          setServerError(null);
        }, 2000);
      }
    } catch (error) {

      setServerError('An error occurred. Please try again.');
    }
  };
  return (
    <>
    <AuthNavbar AuthMode={0}/>

    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src={logo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              {successMessage}
            </div>
          )}
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {serverError}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                
                  <Link className="font-semibold text-indigo-600 hover:text-indigo-500"to="/auth/forgotPassword">Forgot password?</Link> 
                
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
         
            <Link className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" to="/auth/register">Sign Up</Link>
        </p>
      </div>
    </div>
  </>
  );
}

export default Login;
