import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Get the custom hook
import NumberItem from './NumberItem.jsx'



export default function Test() {
  const { savedNumbers, userId, isLoggedIn, loadActiveMappnig, updateActiveMapping, updateUserMapping, mapNumberToEmoji } = useUser(); // Get the user info
  const [emojiArray, setEmojiArray] = useState(() => {
    return (loadEmojiArray());
  });

  function loadEmojiArray() {
    const result = savedNumbers.map((item) => {
      return (mapNumberToEmoji(item.number));
    })
    // console.log(`emoji array: ${result}`);
    return result;
  }

  return (
    <div className="pt-10 pl-10 pr-10 text-xl text-[#2a3355]">
      {isLoggedIn ?
        (savedNumbers.length > 0 ?
          <div>
            {savedNumbers.map((item, index) => (
                <div key={index}>
                  {/* Render the properties of the map item here, e.g.: */}
                  <NumberItem
                    title={item.title}
                    emoji={emojiArray[index]}
                    number={item.number}
                  />
                </div>
              ))}
          </div>
          :
          <p>You haven't saved any number to test yourself with.</p>
        )
        :
        <p>You need to log in first to use this feature.</p>     
      }

    </div>
  )
}