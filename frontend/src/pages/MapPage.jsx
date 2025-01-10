import React from 'react'
import NavBar from '../components/NavBar'
import MapTiler from '../components/MapTiler/MapTiler'

export default function MapPage() {
  return (
    <>
    <NavBar />
    <div>
  Legend: 
  <img src="path/to/yellow-box.png" alt="Yellow color box" /> 10{'>='} 
  <img src="path/to/orange-box.png" alt="Orange color box" /> 20{'>='} 
  <img src="path/to/red-box.png" alt="Red color box" /> 30{'>='} 
    </div>
    <MapTiler />
    </>
  )
}