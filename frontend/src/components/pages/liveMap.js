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

const TrainMap = () => {
  // Create a reference to the DOM element where the map will be rendered
  const mapRef = useRef();

  // Initialize state for the map and layer
  const [map, setMap] = useState();
  const [layer, setLayer] = useState(new TileLayer({ source: new OSM() }));

  // Create a light mode layer for later use
  const lightModeLayer = new TileLayer({ source: new OSM() });

  useEffect(() => {
    // Create a new vector source for the MBTA stops
    const source = new VectorSource();

    // Create a new vector layer with custom styling for the MBTA stops
    const mbtaLayer = new VectorLayer({
      source: source,
      style: new Style({
        image: new Icon({
          src: 'https://img.icons8.com/ios/452/train.png',
          scale: 0.05,
          crossOrigin: 'anonymous',
        }),
      }),
    });

    // Initialize the map with layers (tile layer from OpenStreetMap and the custom vector layer for MBTA stops)
    const map = new Map({
      target: mapRef.current,
      layers: [layer, mbtaLayer],
      view: new View({
        center: [-7910361.335273651, 5215196.272155075],
        zoom: 15,
        maxZoom: 20,
        minZoom: 10,
      }),
    });
    setMap(map);

    // Fetch MBTA stops data from the MBTA API and add them to the vector source as features
    axios
      .get('https://api-v3.mbta.com/stops?filter[route_type]=2')
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

    // Clean up function to remove the map's target when the component is unmounted
    return () => {
      map.setTarget(null);
    };
  }, [layer]);

  // Function to switch between light and dark mode layers
  function layerSwitch() {
    if (layer.getSource() instanceof OSM) {
      setLayer(
        new TileLayer({
          source: new XYZ({
            url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
            tileSize: 512,
          }),
        })
      );
    } else {
      setLayer(lightModeLayer);
    }
  }

  // Render the map component with a layer switch checkbox
  return (
    <div style={{ height: '874px', width: '1878px' }} className="map">
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