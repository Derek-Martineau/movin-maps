import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';

const TrainMap = () => {
  const mapRef = useRef();

  const [map, setMap] = useState();
  const [layer, setLayer] = useState(new TileLayer({ source: new OSM() }));

  const lightModeLayer = new TileLayer({ source: new OSM() });

  const [selectedTransit, setSelectedTransit] = useState("0");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(`https://api-v3.mbta.com/routes?filter[type]=${selectedTransit}`);
        setRoutes(response.data.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, [selectedTransit]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialMap = new Map({
      target: mapRef.current,
      layers: [layer],
      view: new View({
        center: [-7910361.335273651, 5215196.272155075],
        zoom: 15,
        maxZoom: 20,
        minZoom: 10,
      }),
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const trainSource = new VectorSource();
    const subwaySource = new VectorSource();
    const trainLocationsSource = new VectorSource();
    const subwayLocationsSource = new VectorSource();

    const trainStopLayer = new VectorLayer({
      source: trainSource,
      style: new Style({
        image: new Icon({
          src: '/trainFacility.png',
          scale: 0.02,
        }),
      }),
    });

    const subwayStopLayer = new VectorLayer({
      source: subwaySource,
      style: new Style({
        image: new Icon({
          src: '/subwayStops.png',
          scale: 0.09,
        }),
      }),
    });

    const trainLocationsLayer = new VectorLayer({
      source: trainLocationsSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/train.png',
          scale: 0.025,
        }),
      }),
    });

    const subwayLocationsLayer = new VectorLayer({
      source: subwayLocationsSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/subway.png',
          scale: 0.015,
        }),
      }),
    });

    // Clear the sources when switching transit types or routes
    trainSource.clear();
    subwaySource.clear();
    trainLocationsSource.clear();
    subwayLocationsSource.clear();

    const fetchStops = async () => {
      try {
        const stopResponse = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${selectedRoute}`);
        stopResponse.data.data.forEach(stop => {
          const coordinates = fromLonLat([parseFloat(stop.attributes.longitude), parseFloat(stop.attributes.latitude)]);
          const stopPoint = new Point(coordinates);
          const stopFeature = new Feature({
            geometry: stopPoint,
          });

          if (selectedTransit === "0") {
            subwaySource.addFeature(stopFeature);
          } else if (selectedTransit === "2") {
            trainSource.addFeature(stopFeature);
          }
        });
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const locationResponse = await axios.get(`https://api-v3.mbta.com/vehicles?filter[route]=${selectedRoute}`);
        locationResponse.data.data.forEach(vehicle => {
          const coordinates = fromLonLat([parseFloat(vehicle.attributes.longitude), parseFloat(vehicle.attributes.latitude)]);
          const locationPoint = new Point(coordinates);
          const locationFeature = new Feature({
            geometry: locationPoint,
          });

          if (selectedTransit === "0") {
            subwayLocationsSource.addFeature(locationFeature);
          } else if (selectedTransit === "2") {
            trainLocationsSource.addFeature(locationFeature);
          }
        });
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (selectedRoute) {
      fetchStops();
      fetchLocations();
    }

    if (selectedTransit === "0") {
      map.addLayer(subwayStopLayer);
      map.addLayer(subwayLocationsLayer);
      map.removeLayer(trainStopLayer);
      map.removeLayer(trainLocationsLayer);
    } else if (selectedTransit === "2") {
      map.addLayer(trainStopLayer);
      map.addLayer(trainLocationsLayer);
      map.removeLayer(subwayStopLayer);
      map.removeLayer(subwayLocationsLayer);
    }

  }, [map, selectedTransit, selectedRoute]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '100vh', width: '100%' }}></div>
<div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}>
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
</div>
<div style={{ position: 'absolute', top: '1rem', right: '16rem', zIndex: 1 }}>
  <select
    value={selectedTransit}
    onChange={(e) => {
      setSelectedTransit(e.target.value);
      setSelectedRoute("");
    }}
  >
    <option value="0">Subway</option>
    <option value="2">Commuter Rail</option>
  </select>
</div>
    </div>
  );
};

export default TrainMap;