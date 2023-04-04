import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { Style, Icon } from 'ol/style';
import axios from 'axios';

const MapComponent = () => {
  // useRef is used to create a reference to the DOM element where the map will be rendered
  const mapRef = useRef();

  // useEffect is used to perform side effects in function components
  useEffect(() => {
    // Create a new vector source for the MBTA stops
    const source = new VectorSource();

    // Create a new vector layer with custom styling for the MBTA stops
    const layer = new VectorLayer({
      source: source,
      style: new Style({
        image: new Icon({
          //src: 'frontend/src/icons/mbtaStations.png',
          //scale: 0.5,
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          crossOrigin: 'anonymous'
        }),
      }),
    });

    // Initialize the map with a tile layer from OpenStreetMap and the custom vector layer for MBTA stops
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        layer,
      ],
      view: new View({
        center: [-7910361.335273651, 5215196.272155075],
        zoom: 15,
        maxZoom: 20,
        minZoom: 10
      }),
    });

    // Fetch MBTA stops data from the MBTA API and add them to the vector source as features
    axios.get('https://api-v3.mbta.com/stops?filter[route_type]=2')
      .then(response => {
        response.data.data.forEach(stop => {
          const coordinates = [
            stop.attributes.longitude,
            stop.attributes.latitude,
          ];
          const point = new Point(coordinates).transform('EPSG:4326', 'EPSG:3857');
          const feature = new Feature({
            geometry: point,
          });
          source.addFeature(feature);
        });
      })
      .catch(error => {
        console.error('Error fetching MBTA API:', error);
      });

    // Clean up function to remove the map's target when the component is unmounted
    return () => {
      map.setTarget(null);
    };
  }, []);

  // Render a div that will contain the map
  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    ></div>
  );
};

// Export the MapComponent for use in other parts of the application
export default MapComponent;
