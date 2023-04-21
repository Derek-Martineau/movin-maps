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
  // Create a reference to the DOM element where the map will be rendered
  const mapRef = useRef();

  // Initialize state for the map and layer
  const [map, setMap] = useState();
  const [layer, setLayer] = useState(new TileLayer({ source: new OSM() }));

  // Create a light mode layer for later use
  const lightModeLayer = new TileLayer({ source: new OSM() });

  useEffect(() => {
    // Create new vector sources for the MBTA stops, train locations, and subway locations
    const trainSource = new VectorSource();
    const subwaySource = new VectorSource();
    const trainLocationsSource = new VectorSource();
    const subwayLocationsSource = new VectorSource();

    // Create new vector layers with styling for commuter stops
    const trainStopLayer = new VectorLayer({
      source: trainSource,
      style: new Style({
        image: new Icon({
          src: '/trainFacility.png',
          scale: 0.02,
        }),
      }),
    });

    // Create new vector layers with styling for subway stops
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

    // Initialize the map with layers (tile layer from OpenStreetMap, custom vector layers for MBTA stops, train locations, and subway locations)
    const map = new Map({
      target: mapRef.current,
      layers: [layer, subwayStopLayer, trainStopLayer, subwayLocationsLayer, trainLocationsLayer],
      view: new View({
        center: [-7910361.335273651, 5215196.272155075],
        zoom: 15,
        maxZoom: 20,
        minZoom: 10,
      }),
    });
    setMap(map);

    // Fetch MBTA stops data from the MBTA API and add them to the vector source as features
    const fetchStops = (routeType, source) => {
      axios
        .get(`https://api-v3.mbta.com/stops?filter[route_type]=${routeType}`)
        .then((response) => {
          response.data.data.forEach((stop) => {
            const coordinates = [
              stop.attributes.longitude,
              stop.attributes.latitude,
            ];
            const point = new Point(coordinates).transform(
              'EPSG:4326',
              'EPSG:3857'
            );
            const feature = new Feature({
              geometry: point,
            });
            source.addFeature(feature);
          });
        })
        .catch((error) => {
          console.error('Error fetching MBTA API:', error);
        });
    };

    // Fetch train and subway stops
    fetchStops(2, trainSource);
    fetchStops(0, subwaySource);
    fetchStops(1, subwaySource);

    const updateTrainLocations = async () => {
      const response = await axios.get('https://api-v3.mbta.com/vehicles?filter[route_type]=2');
      const vehicles = response.data.data;

      trainLocationsSource.clear();

      vehicles.forEach((vehicle) => {
        const coordinates = fromLonLat([parseFloat(vehicle.attributes.longitude), parseFloat(vehicle.attributes.latitude)]);
        const point = new Point(coordinates);
        const feature = new Feature(point);

        trainLocationsSource.addFeature(feature);
      });
    };

    const updateSubwayLocations = async () => {
      const response = await axios.get('https://api-v3.mbta.com/vehicles?filter[route_type]=0,1');
      const vehicles = response.data.data;

      subwayLocationsSource.clear();

      vehicles.forEach((vehicle) => {
        const coordinates = fromLonLat([parseFloat(vehicle.attributes.longitude), parseFloat(vehicle.attributes.latitude)]);
        const point = new Point(coordinates);
        const feature = new Feature(point);

        subwayLocationsSource.addFeature(feature);
      });
    };

    const intervalIdTrain = setInterval(updateTrainLocations, 7000);
    const intervalIdSubway = setInterval(updateSubwayLocations, 7000);
    updateTrainLocations();
    updateSubwayLocations();

    return () => {
      clearInterval(intervalIdTrain);
      clearInterval(intervalIdSubway);
      map.setTarget(null);
    };
  }, [layer]);

  function layerSwitch() {
    if (layer.getSource() instanceof OSM) {
      setLayer(
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            tileSize: 512,
          }),
        })
      );
    } else {
      setLayer(lightModeLayer);
    }
  }

  return (
    <div style={{ height: '100vh', width: '100%' }} className="map">
      <div
        ref={mapRef}
        id="map"
        style={{ width: '100%', height: '100%' }}
      ></div>
      <div
        className="form-check"
        style={{
          position: 'absolute',
          top: '112px',
          left: '10px',
        }}
      >
        <input
          type="checkbox"
          className="form-check-input"
          id="layer-toggle"
          onChange={layerSwitch}
          checked={layer.getSource() instanceof XYZ}
          style={{
            outline: 'none',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        />
        <label
          className="form-check-label"
          htmlFor="layer-toggle"
          style={{
            outline: 'none',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default TrainMap;