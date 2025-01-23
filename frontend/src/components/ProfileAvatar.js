import React from 'react';

// Import all avatar images
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

// Import the rest of the avatars...

// Avatar keyword mapping
const avatarMap = {
    default:defaultAvatar,
  formalGirl1: avatar2,
  casualMale1: avatar3,
  formalBoy1: avatar4,
  wanderer: avatar5,
  formalBoy2: avatar6,
  backpacker: avatar7,
  backpacker2: avatar8,
  casualGirl1: avatar9,
  casualGirl2: avatar10,
  formalMale1: avatar11,
  formalMale2: avatar12,
  SmartMale1: avatar13,
  formalMale3: avatar14,
  formalMale4: avatar15,
  formalFemale1: avatar16,
  formalFemale2: avatar17,
  // Add more keyword-image mappings
};

const ProfileAvatar = ({ keyword, height = '100px', width= '100px' }) => {
  // Get the avatar image based on the keyword
  const avatarSrc = avatarMap[keyword] || avatarMap['default']; // Default if no match

  return (
    <div className="profile-avatar flex flex-col items-center justify-center">
      <img
        src={avatarSrc}
        alt="User Avatar"
        className="rounded-full border-2 border-yellow-400 shadow-md"
        style={{ width: width, height: height, objectFit: 'cover' }}
      />
      
    </div>
  );
};

export default ProfileAvatar;
