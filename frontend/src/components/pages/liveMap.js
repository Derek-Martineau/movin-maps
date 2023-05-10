// Importing all necessary dependencies
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

// The main component of the application
const TrainMap = () => {
  // Create a reference object to hold the map object
  const mapRef = useRef();

  // State variables to store map, selected transit type, selected route, and routes
  const [map, setMap] = useState();
  const [selectedTransit, setSelectedTransit] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [routes, setRoutes] = useState([]);

  // Effect to fetch routes whenever the selected transit type changes
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

  // Effect to create the map when the component mounts
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

    // Clean up function to avoid memory leaks
    return () => {
      initialMap.setTarget(null);
    };
  }, []);

  // Effect to create layers and fetch stops whenever the map, selected transit or selected route changes
  useEffect(() => {
    if (!map) return;

    // Create sources for each layer
    const trainSource = new VectorSource();
    const subwaySource = new VectorSource();
    const trainLocationsSource = new VectorSource();
    const subwayLocationsSource = new VectorSource();

    // Create layers for each type of feature
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

    // Update layers based on the selected transit type
    updateLayers(
      selectedTransit,
      map,
      subwayStopLayer,
      subwayLocationsLayer,
      trainStopLayer,
      trainLocationsLayer
    );

    // Fetch stops based on the selected transit type and route
    fetchStops(selectedTransit, selectedRoute, subwaySource, trainSource);

    // Update locations of the selected transit and route
    updateLocations(selectedTransit, selectedRoute, subwayLocationsSource, trainLocationsSource);

    // Set interval to update locations every 5 seconds
    const intervalId = setInterval(() => {
      updateLocations(selectedTransit, selectedRoute, subwayLocationsSource, trainLocationsSource);
    }, 5000);

    // Clean up function to clear interval and remove layers to avoid memory leaks
    return () => {
      clearInterval(intervalId);
      removeLayers(map, [subwayStopLayer, subwayLocationsLayer, trainStopLayer, trainLocationsLayer]);
    };
  }, [map, selectedTransit, selectedRoute]);

  // The return function of the TrainMap component
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
          <option value="0">Subway</option>
          <option value="2">Commuter Rail</option>
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

// Function to create vector layer with specific style
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

// Function to update layers based on the selected transit type
function updateLayers(
  selectedTransit,
  map,
  subwayStopLayer,
  subwayLocationsLayer,
  trainStopLayer,
  trainLocationsLayer
) {
  if (selectedTransit === '') {
    removeLayers(map, [subwayStopLayer, subwayLocationsLayer, trainStopLayer, trainLocationsLayer]);
  } else if (selectedTransit === '0') {
    addLayers(map, [subwayStopLayer, subwayLocationsLayer]);
    removeLayers(map, [trainStopLayer, trainLocationsLayer]);
  } else if (selectedTransit === '2') {
    addLayers(map, [trainStopLayer, trainLocationsLayer]);
    removeLayers(map, [subwayStopLayer, subwayLocationsLayer]);
  }
}

// Function to add layers to the map
function addLayers(map, layersToAdd) {
  layersToAdd.forEach((layer) => {
    if (!map.getLayers().getArray().includes(layer)) {
      map.addLayer(layer);
    }
  });
}

// Function to remove layers from the map
function removeLayers(map, layersToRemove) {
  layersToRemove.forEach((layer) => {
    if (map.getLayers().getArray().includes(layer)) {
      map.removeLayer(layer);
    }
  });
}

// Function to fetch stops based on the selected transit type and route
async function fetchStops(selectedTransit, selectedRoute, subwaySource, trainSource) {
  if (selectedTransit === '0') {
    subwaySource.clear();
    await fetchStopsByType('0', subwaySource, selectedRoute);
  }

  if (selectedTransit === '2') {
    trainSource.clear();
    await fetchStopsByType('2', trainSource, selectedRoute);
  }
}

// Function to fetch stops by type
async function fetchStopsByType(routeType, source, routeId) {
  let url = `https://api-v3.mbta.com/stops?filter[route_type]=${routeType}`;
  if (routeId !== '') {
    url += `&filter[route]=${routeId}`;
  }
  try {
    const response = await axios.get(url);
    response.data.data.forEach((stop) => {
      const coordinates = [stop.attributes.longitude, stop.attributes.latitude];
      const point = new Point(fromLonLat(coordinates));
      const feature = new Feature({ geometry: point });
      source.addFeature(feature);
    });
  } catch (error) {
    console.error('Error fetching MBTA API:', error);
  }
}

// Function to update locations of the selected transit and route
async function updateLocations(
  selectedTransit,
  selectedRoute,
  subwayLocationsSource,
  trainLocationsSource
) {
  if (selectedTransit ==='0') {
    subwayLocationsSource.clear();
    await fetchLocationsByType('0', subwayLocationsSource, selectedRoute);
  }

  if (selectedTransit === '2') {
    trainLocationsSource.clear();
    await fetchLocationsByType('2', trainLocationsSource, selectedRoute);
  }
}

// Function to fetch locations by type
async function fetchLocationsByType(routeType, source, routeId) {
  let url = `https://api-v3.mbta.com/vehicles?filter[route_type]=${routeType}`;
  if (routeId !== '') {
    url += `&filter[route]=${routeId}`;
  }
  try {
    const response = await axios.get(url);
    response.data.data.forEach((vehicle) => {
      const coordinates = [vehicle.attributes.longitude, vehicle.attributes.latitude];
      const point = new Point(fromLonLat(coordinates));
      const feature = new Feature({ geometry: point });
      source.addFeature(feature);
    });
  } catch (error) {
    console.error('Error fetching MBTA API:', error);
  }
}

export default TrainMap; 
