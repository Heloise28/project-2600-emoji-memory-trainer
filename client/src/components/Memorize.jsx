import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Get the custom hook
import Button from './Button.jsx'
import axios from 'axios';


export default function Memorize() {
  const { activeMapping, userId, isLoggedIn, savedNumbers, loadSavedNumbers, updateSavedNumbers, mapNumberToEmoji } = useUser(); // Get the user info
  const [inputNumber, setInputNumber] = useState('');
  const [outputEmoji, setOutputEmoji] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [hasInputNumber, sethasInputNumber] = useState(false);
  const [loginError, setLoginError] = useState(false);

  function handleSeeEmoji(numString) {
    setOutputEmoji("");
    sethasInputNumber(true);
    // ^: Matches the beginning of the string.
    // \d+: Matches one or more digits (0-9). The + ensures that the string is not empty and contains at least one digit.
    // $: Matches the end of the string.
    let validInput = /^\d+$/.test(numString);
    if (validInput) {
      setOutputEmoji(mapNumberToEmoji(numString));
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      setLoginError(false);
    }
  }, [isLoggedIn]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!isLoggedIn) {
      setLoginError(true);
      return;
    }
    const newNumber = {
          number: inputNumber,
          title: inputTitle
        };

    const newSavedNumbers = [...savedNumbers];
    newSavedNumbers.push(newNumber);
    console.log(`im trying to save these ${newSavedNumbers}`);

  // Here I forgot that updateUserMapping() takes a item in array
  // So here same update function but takes the array
  // Inconsistency
    updateSavedNumbers(newSavedNumbers)
  }

  return (
    <div className="pt-30 pl-10 pr-10 text-xl text-[#2a3355]">
      <h1 className="text-3xl mb-7 font-bold">Practice with this method:</h1>
      <form onSubmit={handleSubmit}>
      <label className="block">
          <p>Enter a number to see its emoji encoding</p>
          <p className="text-base">
            (❌ at the end means ignore the last zero)<br></br>
            (❓ means this two digit is not mapped to an emoji)
          </p>
          <textarea
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            required
            placeholder="Enter up to 100 digits"
            rows="3"
            cols="50"
            maxLength={100} 
            className="
              mb-2
              block
              p-2
              text-[#2a3355]
              bg-white 
              focus:ring-brand 
              focus:border-brand 
              border-gray-300
              border-2 
              rounded-lg 
              shadow-sm
              resize-y 
            "
          />
        </label>
        <div className="mb-2">
          {hasInputNumber && (
            outputEmoji === "" ? 
              <p className="text-red-600">invalid or empty number input</p>
               : 
              <p className="text-5xl bg-slate-100 rounded-2xl p-2 inline-block">{outputEmoji}</p>
          )}
        </div>
        <Button
          type="button"
          text={'See emoji of this number'}
          onClick={() => handleSeeEmoji(inputNumber)}
        />        
        <p className="mt-2">
          Do you want to save this number and test yourself later?
        </p>
        <p>
          Enter a title for this number and then click "Save"
        </p>
        <label>
          <input 
            type="text" 
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            required
            placeholder="Enter a title (max length: 40 characters)"            
            // Only string of numbers, max 40
            size="40"
            maxLength={40}
            className="text-[#2a3355] bg-neutral-200 focus:ring-brand rounded-lg mb-2"
          />
        </label>
        <br></br>
        {loginError && <p className='text-red-600'>You need to log in first.</p>}
        <Button
          type="submit"
          text={'Save'}
        />
      </form>
    </div>
  )
}
