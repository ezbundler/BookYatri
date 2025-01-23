import React, { useState } from 'react';
import defaultAvatar from '../images/profile.jpg';
import avatar2 from '../images/profile/profile2.jpg';
import avatar3 from '../images/profile/profile3.jpg';
import avatar4 from '../images/profile/profile4.jpg';
import avatar5 from '../images/profile/profile5.jpg';
import avatar6 from '../images/profile/profile6.jpg';
import avatar7 from '../images/profile/profile7.jpg';
import avatar8 from '../images/profile/profile8.jpg';
import avatar9 from '../images/profile/profile9.jpg';
import avatar10 from '../images/profile/profile10.jpg';
import avatar11 from '../images/profile/profile11.jpg';
import avatar12 from '../images/profile/profile12.jpg';
import avatar13 from '../images/profile/profile13.jpg';
import avatar14 from '../images/profile/profile14.jpg';
import avatar15 from '../images/profile/profile15.jpg';
import avatar16 from '../images/profile/profile16.jpg';
import avatar17 from '../images/profile/profile17.jpg';

// Mapping avatars to keywords
const avatars = [
  { keyword: 'default', src: defaultAvatar },
  { keyword: 'formalGirl1', src: avatar2 },
  { keyword: 'casualMale1', src: avatar3 },
  { keyword: 'formalBoy1', src: avatar4 },
  { keyword: 'wanderer', src: avatar5 },
  { keyword: 'formalBoy2', src: avatar6 },
  { keyword: 'backpacker', src: avatar7 },
  { keyword: 'backpacker2', src: avatar8 },
  { keyword: 'casualGirl1', src: avatar9 },
  { keyword: 'casualGirl2', src: avatar10 },
  { keyword: 'formalMale1', src: avatar11 },
  { keyword: 'formalMale2', src: avatar12 },
  { keyword: 'SmartMale1', src: avatar13 },
  { keyword: 'formalMale3', src: avatar14 },
  { keyword: 'formalMale4', src: avatar15 },
  { keyword: 'formalFemale1', src: avatar16 },
  { keyword: 'formalFemale2', src: avatar17 },
];

export const ProfileSelector = ({ onSelectAvatar }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleAvatarClick = (keyword) => {
    onSelectAvatar(keyword);  // Send the selected keyword to parent component
    setIsOpen(false);         // Close the modal after selection
  };

  return (
    <>
      {isOpen && (
        <div className="flex justify-center items-center w-full">
          <div className="p-6 rounded-lg shadow-lg max-w-4xl w-full bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Select Your Avatar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {avatars.map((avatar) => (
                <img
                  key={avatar.keyword}
                  src={avatar.src}
                  alt={avatar.keyword}
                  className="cursor-pointer rounded-full border-2 border-transparent hover:border-blue-500 transition-all w-20 h-20 md:w-24 md:h-24 object-cover"
                  onClick={() => handleAvatarClick(avatar.keyword)}
                />
              ))}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};
