import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



import { Route,BrowserRouter,Routes } from 'react-router-dom'
import SocialMedia from './pages/SocialMedia'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<>Entry</>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path='/Skills' element={<>Skills</>}/>
        
        <Route path='/About' element={<>About</>}/>
        
        <Route path='/Home' element={<>Home</>}/>

        <Route path='/SocialMedia' element={<SocialMedia/>}/>

        <Route path='/Projects' element={<Projects/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
