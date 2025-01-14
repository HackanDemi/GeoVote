import React from 'react'
import NavBar from '../components/NavBar'
import Map from '../components/MapTiler/MapTiler'

export default function HomePage() {
  return (
    <>
    <NavBar />
    <Map />
    <div>HomePage</div>
    </>
  )
}

// Have the home page render the MapTiler component
