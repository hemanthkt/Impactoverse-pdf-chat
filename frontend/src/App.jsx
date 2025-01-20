import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChatBox from './components/ChatBox'


function App() {

  return (
    <>
      <Navbar/>
      <hr />
      <Hero/>
      
      <ChatBox/>
      
       
    </>
  )
}

export default App
