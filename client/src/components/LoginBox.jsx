import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import Button from './Button.jsx'


export default function LoginBox(props) {
  const { login, logout } = useUser(); // Get the login function from context
  const [inputId, setInputId] = useState('');
  const [errorState, setErrorState] = useState({error: false, message: ""});

  const createUser = () => {
    let newId = NaN;
    axios
      .get('https://project-2600-emoji-memory-trainer.onrender.com/api/next_user_id/')
      // .get('http://localhost:5001/api/next_user_id/')
      .then((response) => {
        // Here's different from get default mapping because 
        // default mapping collecttion has a name, but
        // next user id doesn't
        // so I use [0] to set it to the first (and only document)
        newId = response.data[0].nextUserId;

        // Increment next Id
        axios
          .patch('https://project-2600-emoji-memory-trainer.onrender.com/api/next_user_id/update/', {
          // .patch('http://localhost:5001/api/next_user_id/update/', {
            nextUserId: newId + 1
          })
          .then((response) => {
            console.log(`Next Id set to ${newId + 1}`);
          })
          .catch((error) => console.error(error));
        
        // Create and login as new user
        axios
          .put("https://project-2600-emoji-memory-trainer.onrender.com/api/user/create_user/", {
          // .put("http://localhost:5001/api/user/create_user/", {
            userId: newId + ""
          })
          .then((response) => {
            login(newId + ""); // Updates context state and local storage
            props.toggle();
          })
          .catch((error) => console.error(error));

      })
      .catch((error) => console.error(error));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Empty inputId -> I'm creating new
    if (inputId === "") {
      createUser();
    // If I'm not creating new
    } else {
      axios
        .post('https://project-2600-emoji-memory-trainer.onrender.com/api/login/', {userId: inputId})
        // .post('http://localhost:5001/api/login/', {userId: inputId})
        .then((response) => {
          // Seems to not need it
          const res = response.data;
          login(inputId); // Updates context state and local storage
          props.toggle();
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              setInputId("");
              setErrorState({error: true, message: "User not found. Create a new user (ID will be assigned)?"})
            }
          }
          console.error(error);
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div className="absolute inset-0 bg-gray-500/30 backdrop-blur-[1px]"></div>

      <div className="bg-white p-8 rounded-lg shadow-2xl relative z-10 w-96 text-[#2a3355] text-lg">        
        <div className="">
          <form onSubmit={handleSubmit}>
            <h3 className={`text-center ${errorState.error ? 'text-red-600 font-bold text-xl' : 'text-gray-700 text-lg'}`}>
              {errorState.error && errorState.message}
            </h3>
            {!errorState.error &&
              <div className="mb-1">
                <label>
                  Enter your ID here (Must be 8 digit number): 
                  <input
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    placeholder="00000000"
                    required
                    pattern="\d{8}" /* For an 8-digit number string, the regex is \d{8}. */
                    className="text-[#2a3355] bg-neutral-200 focus:ring-brand rounded-lg"
                  />
                </label>
              </div>
            }
            {errorState.error ? 
              <Button
                type="submit"
                text={'Create New User'}
                color="bg-[#5467ab]"
                colorHover="hover:bg-[#6576b3]"
              />
              :
              <Button
                type="submit"
                text={'Log in'}
                color="bg-[#5467ab]"
                colorHover="hover:bg-[#6576b3]"                
              />
            }
          </form>
        </div>
        {!errorState.error &&
          <div className="mb-1">
            <p className="mb-1" >Or create a new user (ID will be assigned)?</p>
            <Button
              type="button"
              text={'Create New User'}
              onClick={createUser}
              color="bg-[#5467ab]"
              colorHover="hover:bg-[#6576b3]"              
            />
          </div>
        }
        <Button
          type="button"
          text={'Cancel'}
          onClick={props.toggle}
          color="bg-[#5467ab]"
          colorHover="hover:bg-[#6576b3]"
        />
      </div>

    </div>
  )
}


/*
Explain the foggy glass effect:

first div:
flex, items-center, justify-center: Centers the content box perfectly.
inset-50: Shorthand for top-0, right-0, bottom-0, left-0. Makes the container cover the entire viewport.

2nd div:
bg-gray-900/50: Sets a semi-transparent dark background (50% opacity).
backdrop-blur-sm: Applies a blur filter to the content behind this
element, obscuring the main page content.

relative z-10: Ensures this box is rendered above the background overlay (which has a lower implicit z-index).
w-96: Sets a defined width (e.g., 24rem/384px) for the box.
*/


/*
Explain the pattern attribute:
This is a HTML5 feature that triggers the native validation 
message if the input value doesn't match the regular expression.
*/