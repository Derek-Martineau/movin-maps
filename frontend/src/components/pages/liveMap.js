import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol'; 
import TileLayer from 'ol/layer/Tile';  
import { OSM } from 'ol/source';  
import 'ol/ol.css';  
import VectorLayer from 'ol/layer/Vector'; 
import VectorSource from 'ol/source/Vector';  
import Point from 'ol/geom/Point';  
import Feature from 'ol/Feature';  
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';  
import axios from 'axios';  
import { fromLonLat } from 'ol/proj';  

// Main component
const TrainMap = () => {
  
  const mapRef = useRef();  // React ref for the map div
  const [map, setMap] = useState();  // State for the map instance
  const [selectedTransit, setSelectedTransit] = useState('');  // State for the selected transit type
  const [selectedRoute, setSelectedRoute] = useState('');  // State for the selected route
  const [routes, setRoutes] = useState([]);  // State for the list of routes

  // Effect hook to fetch routes when the selected transit type changes
  useEffect(() => {
    async function fetchRoutes() {
      try {
        
        if (selectedTransit !== '') {
          const response = await axios.get(
            `https://api-v3.mbta.com/routes?filter[type]=${selectedTransit}`
          );
          setRoutes(response.data.data); 
        } else {
          setRoutes([]);  
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    }

    fetchRoutes();  
  }, [selectedTransit]);

  // Effect hook to initialize the map when the component mounts
  useEffect(() => {
    if (!mapRef.current) return;

  
    const initialMap = new Map({
      target: mapRef.current, 
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [-7910361.335273651, 5215196.272155075], 
        zoom: 15,
        maxZoom: 40,  
        minZoom: 10,  
      }),
    });

    setMap(initialMap);

    return () => {
    
      initialMap.setTarget(null);
    };
  }, []);

  // Effect hook to update the map when the map, selected transit type or selected route changes
  useEffect(() => {
    if (!map) return;

    // Create sources and layers for trains, subways, and buses
    const trainSource = new VectorSource();
    const subwaySource = new VectorSource();
    const trainLocationsSource = new VectorSource();
    const subwayLocationsSource = new VectorSource();
    const busSource = new VectorSource();
    const busLocationsSource = new VectorSource();

    const trainStopLayer = createVectorLayer(trainSource, '/trainFacility.png', 0.02);
    const subwayStopLayer = createVectorLayer(subwaySource, '/subwayStops.png', 0.09);
    const trainLocationsLayer = createVectorLayer(
      trainLocationsSource,
      '/train.png',
      0.025,
      [0.5, 1]
    );
    const subwayLocationsLayer = createVectorLayer(
      subwayLocationsSource,
      '/subway.png',
      0.015,
      [0.5, 1]
    );
    const busStopLayer = createVectorLayer(busSource, '/busStop.png', 0.02);
    const busLocationsLayer = createVectorLayer(
      busLocationsSource,
      '/bus.png',
      0.12,
      [0.5, 1]
    );

    // Update layers based on the selected transit type
    updateLayers(
      selectedTransit,
      map,
      subwayStopLayer,
      subwayLocationsLayer,
      trainStopLayer,
      trainLocationsLayer,
      busStopLayer,
      busLocationsLayer
    );

    // Fetch stops based on the selected transit type and route
    fetchStops(selectedTransit, selectedRoute, subwaySource, trainSource, busSource);

    // Update locations based on the selected transit type and route
    updateLocations(
      selectedTransit,
      selectedRoute,
      subwayLocationsSource,
      trainLocationsSource,
      busLocationsSource
    );

    // Set an interval to update the locations every 5 seconds
    const intervalId = setInterval(() => {
      updateLocations(
        selectedTransit,
        selectedRoute,
        subwayLocationsSource,
        trainLocationsSource,
        busLocationsSource
      );
    }, 5000);

    // Cleanup function to clear the interval and remove the layers when the component unmounts or when the map, selected transit type or selected route changes
    return () => {
      clearInterval(intervalId);
      removeLayers(
        map,
        [
          subwayStopLayer,
          subwayLocationsLayer,
          trainStopLayer,
          trainLocationsLayer,
          busStopLayer,
          busLocationsLayer
        ]
      );
    };
  }, [map, selectedTransit, selectedRoute]); 

  // Render the component
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1
        }}
      >
        <select
          value={selectedTransit}
          onChange={(e) => setSelectedTransit(e.target.value)}
        >
          <option value="">Select Transit</option>
          <option value="0">Subway Light Rail</option>
          <option value="1">Subway Heavy Rail</option>
          <option value="2">Commuter Rail</option>
          <option value="3">Bus</option>
        </select>
        {selectedTransit !== '' && (
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.attributes.long_name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

// Function to create a vector layer
function createVectorLayer(source, iconSrc, scale, anchor) {
  return new VectorLayer({
    source: source,
    style: new Style({
      image: new Icon({
        anchor: anchor || [0.5, 0.5],
        src: iconSrc,
        scale: scale,
      }),
    }),
  });
}

// Function to update the layers on the map based on the selected transit type
function updateLayers(
  selectedTransit,
  map,
  subwayStopLayer,
  subwayLocationsLayer,
  trainStopLayer,
  trainLocationsLayer,
  busStopLayer,
  busLocationsLayer
) {
  if (selectedTransit === '') {
    removeLayers(
      map,
      [
        subwayStopLayer,
        subwayLocationsLayer,
        trainStopLayer,
        trainLocationsLayer,
        busStopLayer,
        busLocationsLayer
      ]
    );
  } else if (selectedTransit === '0') {
    addLayers(map, [subwayStopLayer, subwayLocationsLayer]);
    removeLayers(
      map,
      [
        trainStopLayer,
        trainLocationsLayer,
        busStopLayer,
        busLocationsLayer
      ]
    );
    } else if (selectedTransit === '1') {
      addLayers(map, [subwayStopLayer, subwayLocationsLayer]);
      removeLayers(
        map,
        [
          trainStopLayer,
          trainLocationsLayer,
          busStopLayer,
          busLocationsLayer
        ]
      );
  } else if (selectedTransit === '2') {
    addLayers(map, [trainStopLayer, trainLocationsLayer]);
    removeLayers(
      map,
      [
        subwayStopLayer,
        subwayLocationsLayer,
        busStopLayer,
        busLocationsLayer
      ]
    );
  } else if (selectedTransit === '3') {
    addLayers(map, [busStopLayer, busLocationsLayer]);
    removeLayers(
      map,
      [
        subwayStopLayer,
        subwayLocationsLayer,
        trainStopLayer,
        trainLocationsLayer
      ]
    );
  }
}

// Function to remove layers from the map
function removeLayers(map, layers) {
  layers.forEach((layer) => {
    map.removeLayer(layer);
  });
}

// Function to add layers to the map
function addLayers(map, layers) {
  layers.forEach((layer) => {
    map.addLayer(layer);
  });
}

// Function to fetch stops for the selected transit type and route
async function fetchStops(selectedTransit, selectedRoute, subwaySource, trainSource, busSource) {
  try {
    const response = await axios.get(
      `https://api-v3.mbta.com/stops?filter[route]=${selectedRoute}`
    );
    const stops = response.data.data;
    const features = stops.map((stop) => {
      const coordinates = fromLonLat([
        parseFloat(stop.attributes.longitude),
        parseFloat(stop.attributes.latitude),
      ]);
      return new Feature({
        geometry: new Point(coordinates),
      });
    });
    // Add the features to the appropriate source based on the selected transit type
    if (selectedTransit === '0') {
      subwaySource.clear();
      subwaySource.addFeatures(features);
    } else if (selectedTransit === '1') {
      subwaySource.clear();
      subwaySource.addFeatures(features);
    } else if (selectedTransit === '2') {
      trainSource.clear();
      trainSource.addFeatures(features);
    } else if (selectedTransit === '3') {
      busSource.clear();
      busSource.addFeatures(features);
    }
  } catch (error) {
    console.error('Error fetching stops:', error);
  }
}

// Function to update the locations of the vehicles on the map
async function updateLocations(
  selectedTransit,
  selectedRoute,
  subwayLocationsSource,
  trainLocationsSource,
  busLocationsSource
) {
  try {
    const response = await axios.get(
      `https://api-v3.mbta.com/vehicles?filter[route]=${selectedRoute}`
    );
    const vehicles = response.data.data;
    const features = vehicles.map((vehicle) => {
      const coordinates = fromLonLat([
        parseFloat(vehicle.attributes.longitude),
        parseFloat(vehicle.attributes.latitude),
      ]);
      return new Feature({
        geometry: new Point(coordinates),
      });
    });
    // Update the appropriate source based on the selected transit type
    if (selectedTransit === '0') {
      subwayLocationsSource.clear();
      subwayLocationsSource.addFeatures(features);
    } else if (selectedTransit === '1') {
      subwayLocationsSource.clear();
      subwayLocationsSource.addFeatures(features);
    } else if (selectedTransit === '2') {
      trainLocationsSource.clear();
      trainLocationsSource.addFeatures(features);
    } else if (selectedTransit === '3') {
      busLocationsSource.clear();
      busLocationsSource.addFeatures(features);
    }
  } catch (error) {
    console.error('Error updating vehicle locations:', error);
  }
}

export default TrainMap;