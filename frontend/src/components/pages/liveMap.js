import React, { useState,  useEffect} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css'
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

/* Init is the map function 
Map variable has view,center,zoom,minZoom,MaxZoom 
view provides a 2d view of the map 
center focuses where the user is looking at
zoom is the magnification of the map
TileLayter are prerendered grid tile images 
that view displays to the user

*/
const TrainMap = () => {
  const[map, setMap] = useState();

  useEffect(() => {
    const map = new Map({
      view: new View({
        center: [-7910361.335273651, 5215196.272155075],
        zoom: 15,
        maxZoom: 20,
        minZoom: 10
      }),
      layers: [
        new TileLayer({
        source: new OSM()

          })
      ],
      target: 'map'
      });
      setMap(map)
      return () => {
        map.setTarget(null);
      };
}, [])
 
useEffect(()=>{
/*
This useeffect will be to place the stations on their own vector layer on 
the map
*/

})

useEffect(() => {
 /*
 this use effect will be used to store the station and vehicle icons 
 new Style({
    image: new Icon({
      source: 'https://upload.wikimedia.org/wikipedia/commons/6/64/MBTA.svg',
      size: [32, 32],
      scale: 0.03     
    })
  })
  */
})
  
 //display the map on the webpage
  return (
    <div style={{height:'1080px', width:'1920px'}}id='map' class='map'></div>
  
  )
}

export default  TrainMap;





