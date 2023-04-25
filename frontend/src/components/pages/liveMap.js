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
    


    const layersArray = map.getLayers().getArray();

    if (selectedTransit === "0") {
      if (!layersArray.includes(subwayStopLayer)) {
        map.addLayer(subwayStopLayer);
      }
      if (!layersArray.includes(subwayLocationsLayer)) {
        map.addLayer(subwayLocationsLayer);
      }
      if (layersArray.includes(trainStopLayer)) {
        map.removeLayer(trainStopLayer);
      }
      if (layersArray.includes(trainLocationsLayer)) {
        map.removeLayer(trainLocationsLayer);
      }
    } else if (selectedTransit === "2") {
      if (!layersArray.includes(trainStopLayer)) {
        map.addLayer(trainStopLayer);
      }
      if (!layersArray.includes(trainLocationsLayer)) {
        map.addLayer(trainLocationsLayer);
      }
      if (layersArray.includes(subwayStopLayer)) {
        map.removeLayer(subwayStopLayer);
      }
      if (layersArray.includes(subwayLocationsLayer)) {
        map.removeLayer(subwayLocationsLayer);
      }
    }      

    const fetchStops = (routeType, source, routeId) => {
      let url = `https://api-v3.mbta.com/stops?filter[route_type]=${routeType}`;
      if (routeId !== "") {
        url += `&filter[route]=${routeId}`;
      }
      axios
        .get(url)
        .then((response) => {
          response.data.data.forEach((stop) => {
            const coordinates = [
              stop.attributes.longitude,
              stop.attributes.latitude,
            ];
            const point = new Point(coordinates).transform(
              "EPSG:4326",
              "EPSG:3857"
            );
            const feature = new Feature({
              geometry: point,
            });
            source.addFeature(feature);
          });
        })
        .catch((error) => {
          console.error("Error fetching MBTA API:", error);
        });
    };

    const updateTrainLocations = async () => {
      try {
        let url = 'https://api-v3.mbta.com/vehicles?filter[route_type]=2';
        if (selectedTransit === "2" && selectedRoute !== "") {
          url += `&filter[route]=${selectedRoute}`;
        }
        const response = await axios.get(url);
        const vehicles = response.data.data;

        trainLocationsSource.clear();

        vehicles.forEach((vehicle) => {
          const coordinates = fromLonLat([parseFloat(vehicle.attributes.longitude), parseFloat(vehicle.attributes.latitude)]);
          const point = new Point(coordinates);
          const feature = new Feature(point);

          trainLocationsSource.addFeature(feature);
        });
      } catch (error) {
        console.error('Error fetching train locations:', error);
      }
    };

    const updateSubwayLocations = async () => {
      try {
        let url = 'https://api-v3.mbta.com/vehicles?filter[route_type]=0,1';
        if (selectedTransit === "0" && selectedRoute !== "") {
          url += `&filter[route]=${selectedRoute}`;
        }
        const response = await axios.get(url);
        const vehicles = response.data.data;

        subwayLocationsSource.clear();

        vehicles.forEach((vehicle) => {
          const coordinates = fromLonLat([parseFloat(vehicle.attributes.longitude), parseFloat(vehicle.attributes.latitude)]);
          const point = new Point(coordinates);
          const feature = new Feature(point);

          subwayLocationsSource.addFeature(feature);
        });
      } catch (error) {
        console.error('Error fetching subway locations:', error);
      }
    };

    if (selectedRoute !== "") {
      trainSource.clear();
      subwaySource.clear();
      trainLocationsSource.clear();
      subwayLocationsSource.clear();
    
      fetchStops(2, trainSource, selectedRoute);
      fetchStops(0, subwaySource, selectedRoute);
      fetchStops(1, subwaySource, selectedRoute);
    }

    if (selectedRoute !== "") {
      fetchStops(2, trainSource, selectedRoute);
      fetchStops(0, subwaySource, selectedRoute);
      fetchStops(1, subwaySource, selectedRoute);
    }

    const intervalIdTrain = setInterval(updateTrainLocations, 5000);
    const intervalIdSubway = setInterval(updateSubwayLocations, 5000);

    return () => {
      clearInterval(intervalIdTrain);
      clearInterval(intervalIdSubway);
    };

  }, [map, layer, selectedTransit, selectedRoute]);

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