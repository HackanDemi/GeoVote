import NavBar from '../components/NavBar'
import MapTiler from '../components/MapTiler/MapTiler'
import './MapPage.css'

export default function MapPage() {
  return (
    <>
      <NavBar />
      <div className="map-container">
        <div className="overlay">
        <MapTiler />
          
          <div id="map" className="map-below"></div>
          <div className="colors">
            <div className="changeColor changeColor-red" data-color="red"><span className="yellow-text">10 {'>='} Votes</span></div>
            <div className="changeColor changeColor-blue" data-color="blue"><span className="orange-text">20 {'>='} Votes</span></div>
            <div className="changeColor changeColor-green" data-color="green"><span className="red-text">30 {'>='} Votes</span></div>
          </div>
        </div>
      </div>
    </>
  )
}
