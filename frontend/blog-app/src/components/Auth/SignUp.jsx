import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadimage';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector';
import AUTH_IMG from "../../assets/auth-img.jpg";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { updateUser, setOpenAuthForm } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validation
    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    try {
      let profileImageUrl = "";
      
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      // SignUp API call
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if(role === "admin") {
          setOpenAuthForm(false)
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row w-full max-w-6xl mx-auto h-full'>
      {/* Form Section */}
      <div className='w-full md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-1 mb-6'>
          Join us today by entering your details below.
        </p>
        
        <form onSubmit={handleSignUp} className='space-y-4'>
          <ProfilePhotoSelector
            image={profilePic} 
            setImage={setProfilePic} 
          />
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input 
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />
            
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
            
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            /> 
            
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit code"
              type="text"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-xs py-2">
              {error}
            </p>
          )}
          
          <button 
            type='submit' 
            className='btn-primary w-full mt-4'
          >
            SIGN UP
          </button>
          
          <p className='text-[13px] text-slate-800 mt-3 text-center'>
            Already have an account?{" "}
            <button
              type="button"
              className='font-medium text-primary underline cursor-pointer'
              onClick={() => setCurrentPage("login")}
            >
              Login
            </button>
          </p>   
        </form>
      </div>

      {/* Image Section - Fixed size to prevent scrolling */}
      <div className='hidden md:flex md:w-1/2 items-center justify-center bg-gray-100'>
        <img 
          src={AUTH_IMG} 
          alt='Sign Up' 
          className='w-full h-[500px] object-cover rounded-lg'
        />
      </div>
    </div>
  );
};

export default SignUp;