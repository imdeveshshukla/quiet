
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles/App.css'
import Signup from './components/Signup'
import Signin from './components/Signin'


function App() {
  

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
      </Routes>

    </BrowserRouter>
    </>
  )
}

export default App
