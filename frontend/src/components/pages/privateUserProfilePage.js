import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import axios from 'axios';
import Card from 'react-bootstrap/Card';

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({})
  const [routes, setRoutes] = useState([]);
  const [routeNames, setRouteNames] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleLogout = (async) => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo())
  }, []);

  const API_URL = 'https://api-v3.mbta.com/routes';

  useEffect(() => {
    async function fetchRoutes() {
      const response = await axios(API_URL);
      setRoutes(response.data.data);
    }
    fetchRoutes();
  }, []);

  if (!user) return (<div><h4>Log in to view this page.</h4></div>)

  return (
    <div class="container">
      <div class="col-md-12 text-center">
        <h1>{user && user.username}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
          <h1 style={{ color: 'white' }}>Favorite Routes</h1>
          {routes.map(route => (
            <Card
              body
              bg="white"
              text="black"
              outline
              color="black"
              className="mx-1 my-2"
              style={{ width: "30rem" }}
            >
              <Card.Body style={{}}>
                <Card.Title>{route.attributes.long_name}</Card.Title>
                <Card.Text>{route.attributes.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          <h1>Routes</h1>
          {routes.map(route => (
            <div key={route.id}>
              <h3>{route.attributes.long_name}</h3>
              <p>{route.attributes.description}</p>
            </div>
          ))}
        </div>
        <div class="col-md-12 text-center">
          <div className="container">
            {routes.map(route => (
              <Card
                key={route.id}
                name={route.attributes.long_name}
                distance={route.attributes.distance}
                duration={route.attributes.travel_time}
              />
            ))}
          </div>
          <>
            <Button className="me-2" onClick={handleShow}>
              Log Out
            </Button>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
