import { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {


  const { userData } = useContext(AppContext)
  console.log(userData);
  

  return (
    <div className="w-full flex flex-col items-center text-center px-4 sm:px-8 py-10 bg-gray-50">

      <img
        src={assets.header_img}
        alt="Header"
        className="w-40 max-w-md sm:max-w-lg rounded-xl shadow-md mb-6"
      />

      <h1 className="text-3xl sm:text-5xl font-bold mb-2 flex items-center justify-center gap-2">
        Hey {userData ? userData.name : 'Developer'}
        <img src={assets.hand_wave} alt="Wave" className="w-6 sm:w-8 h-auto" />
      </h1>

      <h2 className="text-xl sm:text-2xl font-medium text-blue-600 mb-4">
        Welcome To Our App
      </h2>

      <p className="text-gray-600 max-w-2xl mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat tempora iste non reprehenderit nisi magni aut, nostrum saepe necessitatibus repellendus.
      </p>

      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out">
        Get Started
      </button>

    </div>
  );
};

export default Header;
