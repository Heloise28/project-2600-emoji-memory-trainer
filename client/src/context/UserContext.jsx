import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the Context object
const UserContext = createContext(null);
// Custom hook for consuming the context easily
// Instead of having to import both useContext 
// and UserContext in every component that needs 
// the user state, a developer only needs to import 
// and call useUser().
export const useUser = () => useContext(UserContext);

// Create the Provider component
// All components that need access to the user state 
// or functions must be wrapped inside this component.
export const UserProvider = ({ children }) => {
  // Try to initialize state from Local Storage
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!userId);
  const [activeMapping, setActiveMapping] = useState(() => {
    return JSON.parse(localStorage.getItem('activeMapping')) || null;
  });

  const [savedNumbers, setSavedNumbers] = useState(() => {
    return JSON.parse(localStorage.getItem('savedNumbers')) || null;
  });

  useEffect(() => {
    if (!activeMapping) {
      loadActiveMappnig(userId, isLoggedIn);
    }
    if (!savedNumbers) {
      loadSavedNumbers(userId, isLoggedIn);
    }
  }, []);


  // Take a look at how errors are handled in here
  // Get savedNumbers from server and save to state/context, and localstorage
  function loadSavedNumbers(userId, isLoggedIn) {
    if (!isLoggedIn) {
      // If not logged in, initialize to an empty array and update state/local storage
      const emptySavedNumbers = [];
      localStorage.setItem('savedNumbers', JSON.stringify(emptySavedNumbers));
      setSavedNumbers(emptySavedNumbers); 
      console.log("Not logged in. Initialized savedNumbers to empty array.");
      return;
    }

    // If logged in, fetch the specific user's data
    axios
      // .get(`https://project-2600-emoji-memory-trainer.onrender.com/api/user/${userId}`)
      .get(`http://localhost:5001/api/user/${userId}`)
      .then((response) => {
        // The savedNumbers array should be stored under the user object, 
        // similar to customMapping
        const fetchedSavedNumbers = response.data.savedNumbers || []; 
        
        // use || [] in case the server returns null or undefined for savedNumbers
        localStorage.setItem('savedNumbers', JSON.stringify(fetchedSavedNumbers));
        setSavedNumbers(fetchedSavedNumbers);
        console.log("Successfully fetched and set savedNumbers:", fetchedSavedNumbers);
      })
      .catch((error) => {
        console.error("Error fetching savedNumbers for user:", error);
        // Fallback: clear state/local storage if fetch fails
        // Node: this is good!!
        loadSavedNumbers(null, false); 
      });
  }

  // Here I forgot that updateUserMapping() takes a item in array
  // So here same update function but takes the array
  // Inconsistency
  function updateSavedNumbers(newSavedNumbers) {
    if (!userId) {
      console.error("Cannot update saved numbers: User ID is missing.");
      return;
    }

    console.log("Attempting to save new savedNumbers to server...");
    axios
      // .patch(`https://project-2600-emoji-memory-trainer.onrender.com/api/user/update_saved_numbers/${userId}`, {
      .patch(`http://localhost:5001/api/user/update_saved_numbers/${userId}`, {
        savedNumbers: newSavedNumbers
      })
      .then((response) => {
        console.log("Successfully updated savedNumbers on server:", response.data);

        localStorage.setItem('savedNumbers', JSON.stringify(newSavedNumbers));
        setSavedNumbers(newSavedNumbers); 
        
        // Or call the loader to refresh from the server for consistency, but I think it's ok
        // loadSavedNumbers(userId, true); 
      })
      .catch((error) => {
        console.error("Error updating savedNumbers on server:", error);
      });
  }

  // Get user mapping from server and save to state/context, and localstorage
  function loadActiveMappnig(loggedInAs, loggedIn) {
    axios
      // .get('https://project-2600-emoji-memory-trainer.onrender.com/api/default_mapping')
      .get('http://localhost:5001/api/default_mapping')
      .then((response) => {
        const currentDefaultMapping = response.data.mapping;
        // console.log("Successfully fetched and set default mapping:", map);
        let updated = [...currentDefaultMapping];
        if (loggedIn) {
          axios
            // .get(`https://project-2600-emoji-memory-trainer.onrender.com/api/user/${loggedInAs}`)
            .get(`http://localhost:5001/api/user/${loggedInAs}`)
            .then((response) => {
              const custom = response.data.customMapping;
              for (let i = 0; i < custom.length; i++) {
                let index = parseInt(custom[i].number);
                updated[index] = custom[i];
              }
              localStorage.setItem('activeMapping', JSON.stringify(updated));
              setActiveMapping(updated);
              console.log("Successfully updated active mapping:", updated);
            })
            .catch((error) => console.error(error));
        } else {
          localStorage.setItem('activeMapping', JSON.stringify(updated));
          setActiveMapping(updated);
          console.log("Successfully updated default mapping:", updated);
        }
      })
      .catch((error) => console.error(error));
  }

  function updateActiveMapping(newMapping) {
    setActiveMapping(newMapping);
    localStorage.setItem('activeMapping', JSON.stringify(newMapping));
  }

  function updateUserMapping(newPair) {
    axios
      // .get(`https://project-2600-emoji-memory-trainer.onrender.com/api/user/${userId}`)
      .get(`http://localhost:5001/api/user/${userId}`)
      .then((response) => {
        const toBeUpdated = response.data.customMapping;
        let added = false;
        const newNum = parseInt(newPair.number);
        for (let i = 0; i < toBeUpdated.length; i++) {
          let num = parseInt(toBeUpdated[i].number);
          if (num > newNum) {
            toBeUpdated.push(newPair);
            toBeUpdated.sort((a, b) => {
              const numA = +a.number;
              const numB = +b.number;
              return numA - numB;
            });
            added = true;
            break;
          }
          if (num === newNum) {
            toBeUpdated[i] = newPair;
            added = true;
            break;
          }
        }
        if (!added) {
          toBeUpdated.push(newPair);
        }
        axios
          // .patch(`https://project-2600-emoji-memory-trainer.onrender.com/api/user/update_mapping/${userId}`, {
          .patch(`http://localhost:5001/api/user/update_mapping/${userId}`, {
            customMapping: toBeUpdated
          })
          .then ((response) => {
            console.log(`Added ${newPair} successfully!`);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }


  function mapNumberToEmoji(numString) {
    let input = numString;
    let crossMarker = '';

    // Check for odd length and adjust
    if (input.length % 2 !== 0) {
        input = input + '0'; // Append '0' to the last digit (e.g., "123" becomes "1230")
        crossMarker = '❌'; // Mark that the last digit was artificially extended
    }

    let emojiResult = '';

    for (let i = 0; i < input.length; i += 2) {
        const codeString = input.substring(i, i + 2);
        // This is the array index we will use.
        // The second 10 is radix (optional): An integer between 2 
        // and 36 that represents the base of the number in the string. 
        // For example, 10 for decimal, 2 for binary, 8 for octal, 
        // and 16 for hexadecimal.
        const index = parseInt(codeString, 10); 

        if (activeMapping[index] && activeMapping[index].emoji) {
            emojiResult += activeMapping[index].emoji;
        } else {
            // Fallback for missing or invalid index (shouldn't happen if array is guaranteed 00-99)
            emojiResult += '❓'; 
        }
    }
    emojiResult += crossMarker;
    return emojiResult;
  }

  // Function to handle login (save ID to state and local storage)
  const login = (id) => {
    if (id) {
      setUserId(id);
      setIsLoggedIn(true);
      localStorage.setItem('userId', id); // Persist to Local Storage
      loadActiveMappnig(id, true);
      loadSavedNumbers(id, true);
    }
  };

  // Function to handle logout (clear state and local storage)
  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userId'); // Clear Local Storage
    loadActiveMappnig(null, false);
    loadSavedNumbers(null, false);
  };

  // The value object to be passed to consuming components
  const contextValue = {
    userId,
    isLoggedIn,
    activeMapping,
    savedNumbers,
    login,
    logout,
    loadActiveMappnig,
    updateActiveMapping,
    updateUserMapping,
    loadSavedNumbers,
    updateSavedNumbers,
    mapNumberToEmoji
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};




/*
Context Object (UserContext)
The Context Object is necessary because it is the actual 
mechanism provided by React to solve the prop drilling problem.
Sharing Data: It allows the UserProvider to publish its 
value object to the entire component tree below it.

Decoupling: It allows any nested component (the Consumer) 
to subscribe to that value directly, without needing to 
know where the data originated or having props passed 
down through intermediary components.
*/