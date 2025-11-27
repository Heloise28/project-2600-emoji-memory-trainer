import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { useUser } from './context/UserContext'; // Get the custom hook
import './App.css'
import NavBar from './components/NavBar.jsx'
import LoginBox from './components/LoginBox.jsx'
import Button from './components/Button.jsx'


function App() {
  const { userId, isLoggedIn, logout } = useUser(); // Get the user info
  const [showLoginBox, setShowLoginBox] = useState(false);

  function toggleLoginBox(e) {
    setShowLoginBox(!showLoginBox)
  }


  return (
    <div className="font-nunito bg-[#021f17]">
      <div className="max-w-[1280px] mx-auto relative flex">  
        <aside className="sticky top-0 h-screen
           w-64 bg-emerald-900 text-white p-6 flex-col justify-between shadow-[0px_0px_11px_rgba(0,0,0,0.8)]">
          <h1 className="text-5xl text-[#f9f871] font-bold leading-11 mb-9 p-3 rounded-full bg-emerald-800 text-shadow-lg">
            Emoji<br />
            Memory<br />
            Trainer
          </h1>         
          <div className="">
            {isLoggedIn && (
              <div className="text-lg pl-3 pt-1 pb-3">
                <p className="text-emerald-300 leading-none">Logged in as:</p>
                <p className="font-semibold text-white text-lg**">{userId}</p>
            </div>
            )}
            {!isLoggedIn && (
              <Button
                type="button"
                text="Log in / Sign up"
                onClick={toggleLoginBox}
                color="bg-transparent"
                colorHover="hover:bg-emerald-600"
              />
            )}

            {isLoggedIn && (
              <>
                <Button
                  type="button"
                  text="Switch User"
                  onClick={toggleLoginBox}
                  color="bg-transparent"
                  colorHover="hover:bg-emerald-600"
                />
                <Button
                  type="button"
                  text="Log out"
                  onClick={logout}
                  color="bg-transparent"
                  colorHover="hover:bg-emerald-600"
                />
              </>
            )}
          </div>
        <NavBar />
        </aside>
        <main className="flex-1 pb-30 bg-white">
          {showLoginBox && <LoginBox toggle={toggleLoginBox}/>}
          <Outlet /> 
        </main>
      </div>          
    </div>  
  )
}

export default App


/*
Explain the CSS here:

mx-auto = margin-left: auto; margin-right: auto;
It centers any element as long as it has a defined width:

leading-10: change line height

Important: flex on wrapper div so that side bar and main go side by side
and main has flex-1 so that it takes all the remaining space.
(tailwind doc: Use flex-1 to allow a flex item to grow and shrink as needed, ignoring its initial size:)


*/