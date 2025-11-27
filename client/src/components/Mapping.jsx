import React, { useState, useEffect } from 'react';
import Pair from "./Pair"
import { useUser } from '../context/UserContext'; // Get the custom hook
import Button from './Button.jsx'
import axios from 'axios';




export default function Mapping() {
  const { activeMapping, userId, isLoggedIn, loadActiveMappnig, updateActiveMapping, updateUserMapping } = useUser(); // Get the user info
  const [isEditing, setIsEditing] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [inputEmoji, setInputEmoji] = useState('');
  const [inputExplanation, setIinputExplanation] = useState('');

  function handleEnterCustomMapping(e) {
    // CRITICAL: Stop the browser from reloading the page
    e.preventDefault();
    const newPair = {
          number: inputNumber,
          emoji: inputEmoji,
          explanation: inputExplanation
        };
    const newActiveMapping = activeMapping.map((item) => {
      if (item.number === inputNumber) {
        return newPair;
      } else {
        return item;
      }
    })
    updateActiveMapping(newActiveMapping);
    updateUserMapping(newPair);
    setInputNumber("");
    setInputEmoji("");
    setIinputExplanation("");
  }

  if (!activeMapping) {
    return (
      <h1>Can't load active mapping data...</h1>
    )
  }

  return (
    <div className="">
      <div className="sticky top-0 right-0 left-0 text-white text-xl pl-15 pr-15 pt-5 mr-10 ml-10 pb-5 z-40 bg-[#435289] shadow-[0px_2px_3px_rgba(0,0,0,0.2)] rounded-2xl">
        {!isLoggedIn ?
          <h1 className="text-2xl">Default number-to-emoji mapping (login to customize)</h1>
          :
          <h1 className="text-2xl">Your custom number-to-emoji mapping (customize below)</h1>
        }
        <div className="mr-30">
          {isLoggedIn &&
            <form onSubmit={handleEnterCustomMapping} className="flex mt-3">
              <div className='mr-20'>
                <label className="pr-10">
                  2-digit number: 
                  <input
                    type="text"
                    size="2"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                    required
                    pattern="\d{2}" /* For an 8-digit number string, the regex is \d{8}. */
                    className="text-black bg-white focus:ring-brand rounded-lg ml-2 mt-2"
                  />              
                </label>
                <label className="pr-10">
                  Emoji: 
                  <input
                    type="text"
                    size="8"
                    value={inputEmoji}
                    onChange={(e) => setInputEmoji(e.target.value)}
                    required
                    className="text-black bg-white focus:ring-brand rounded-lg ml-2 mt-2"
                  />
                </label>
                <br></br>
                <label className="pr-10">
                  Explanation: 
                  <input
                    type="text"
                    value={inputExplanation}
                    size="30"
                    onChange={(e) => setIinputExplanation(e.target.value)}
                    required
                    className="text-black bg-white focus:ring-brand rounded-lg ml-2 mt-2"
                  />              
                </label>
              </div>
              <div>
                <Button 
                  type="submit"
                  text={'Enter'}
                  color="bg-[#5467ab]"
                  colorHover="hover:bg-[#6576b3]"
                />
              </div>                
            </form>
          }
        </div>
      </div>

      {/*Use index as key, smart*/}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-7 pt-8 pl-10 pr-10 text-[#2a3355]">
        {activeMapping.map((item, index) => (
          <div key={index}>
            {/* Render the properties of the map item here, e.g.: */}
            <Pair
              number={item.number}
              emoji={item.emoji}
              explanation={item.explanation}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/*
Understanding Tailwind:
How does the page auto adjust how many boxes to show?

In Tailwind CSS, the square brackets [] 
are used to define Arbitrary Values.
Result: By using grid-cols-[...], you are telling 
Tailwind: "Apply this custom CSS value to the 
grid-template-columns property."

The repeat() function is a native CSS Grid function that 
defines a pattern for repeating column or row tracks.
Syntax: repeat(count | auto-fill | auto-fit, track-list)

12rem (Minimum Size): This sets the smallest size your 
small divs will ever be. This is what dictates the 
responsive breakpoints:If the available space can 
fit three columns of at least 12rems each, 
it will show three columns.If the space shrinks, 
the items shrink down to $12\text{rem}$, and then the 
whole column drops to the next row.
(rem is relative to the root font size of the entire html,
good for responsiveness)

1fr (Maximum Size): This is a fractional unit. 
It means "one part of the available space.
"Since all your columns use 1fr as their 
maximum, once the minimum size of 12 rem is met, 
all columns will equally share the remaining space 
in the row. This makes the grid stretch perfectly 
to fill the row without gaps.
*/
