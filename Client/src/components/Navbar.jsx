import { assets } from "../assets/assets";
import {useNavigate} from 'react-router-dom'

const Navbar = () => {


  const navigate = useNavigate()

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 shadow-md bg-white">
      <img src={assets.logo} alt="Logo" className="w-24 sm:w-32" />
      
      <button
        onClick={()=>navigate('/login')}
       className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out">
        Login 
        <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Navbar;
