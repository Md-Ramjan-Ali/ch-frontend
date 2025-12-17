import React from 'react';
import { Link } from 'react-router-dom';
interface ContinueLearningCardProps {
  title: string;
  goalText: string;
  buttonText: string;
  onButtonClick?: () => void;
  img:any
}

const UserContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  title,
  goalText,
  buttonText,
  onButtonClick,img
}) => {
  return (
<div className="p-8   border border-[#BBD2FF] dark:bg-[linear-gradient(180deg,rgba(202,210,244,0.10)_0%,rgba(102,126,234,0.10)_100%)] rounded-xl shadow-lg flex items-center justify-between mx-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl dark:text-gray-200 font-bold text-[#333] mb-2">
          {title}
        </h2>
        <p className="text-xl text-[#585858] dark:text-gray-100 mb-4">
          {goalText}
        </p>
        <Link to="practice"
          onClick={onButtonClick}
          className="bg-blue-600 cursor-pointer mt-1 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg shadow-md transition duration-200 w-fit"
        >
          {buttonText}
        </Link>
      </div>
       <div className="ml-4">
        <div className=" mr-8  relative">
           <img className='w-25 h-25' src={img} alt="" />
        </div>
      </div>
    </div>
  );
};
export default UserContinueLearningCard;