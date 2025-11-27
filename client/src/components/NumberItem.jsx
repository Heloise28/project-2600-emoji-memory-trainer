import Button from './Button.jsx'
import { useUser } from '../context/UserContext'; // Get the custom hook
import React, { useState, useEffect } from 'react';


export default function NumberItem(props) {
  const { activeMapping, userId, isLoggedIn, updateSavedNumbers, savedNumbers } = useUser(); // Get the user info

  const [showEmoji, setShowEmoji] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [guess, setGuess] = useState("");
  const [guessed, setGuessed] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (guessed) {
      setGuessed(false);
    }
  }, [guess]);


  function handleCheckAnswer() {
    setCorrect(guess === props.number);
    setGuessed(!guessed);
  }

  function handleDelete() {
    const afterDeletion = savedNumbers.filter((item) => {
        return item.number !== props.number;
    });
    updateSavedNumbers(afterDeletion);
  }

  return (
    <div className="p-2 m-3 bg-slate-200 rounded-2xl inline-block">
      <p>Title: <p className="font-bold inline">{props.title}</p></p>
        <label>
          What's this number?
          {showEmoji && 
            <p>
              Hint: {props.emoji}
            </p>
          }
          {showNumber &&
            <p className="">
              Answer: <p className="font-bold inline">{props.number}</p>
            </p>
          }          
          <textarea
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            required
            placeholder="Enter up to 100 digits"
            rows="3"
            cols="54"
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
      {guessed &&
        (correct ? 
          <p className="text-emerald-500 text-2xl font-bold mt-3 mb-3 bg-white inline-block rounded-xl">Correct!</p>
          :
          <p className="text-red-500 text-2xl font-bold mt-3 mb-3 bg-white inline-block rounded-xl">Not Correct!</p>)
      }
      <div className="flex justify-between">
        <Button
          type="button"
          text={guessed ? 'Hide Result' : "Check Answer"}
          onClick={handleCheckAnswer}
        />
        <Button
          type="button"
          text={showEmoji ? 'Hide Emoji' : 'Hint Emoji'}
          onClick={() => setShowEmoji(!showEmoji)}
        />
        <Button
          type="button"
          text={showNumber ? 'Hide Number' : 'Show Number'}
          onClick={() => setShowNumber(!showNumber)}
        />
        <Button
          type="button"
          text={'Delete'}
          onClick={handleDelete}
        />        
      </div>

    </div>
  )
}