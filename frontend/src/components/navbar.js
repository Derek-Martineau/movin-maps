import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';


// Here, we display our Navbar
export default function Navbar() {
  // We are pulling in the user's info but not using it for now.
  // Warning disabled: 
  // eslint-disable-next-line
  const [user, setUser] = useState({})

  useEffect(() => {
  setUser(getUserInfo())
  }, [])
  
  // if (!user) return null   - for now, let's show the bar even not logged in.
  // we have an issue with getUserInfo() returning null after a few minutes
  // it seems.
  return (
    <ReactNavbar style={{ backgroundColor: "#a9a9a9" }}>
    <Container>
      <Nav className="me-auto">
        <Nav.Link href="/" style={{ color: "white" }}>Start</Nav.Link>
        <Nav.Link href="/home" style={{ color: "white" }}>Home</Nav.Link>
        <Nav.Link href="/privateUserProfile" style={{ color: "white" }}>Profile</Nav.Link>
        <Nav.Link href="/alerts" style={{ color: "white" }}>Alerts</Nav.Link>
        <Nav.Link href="/facilities" style={{ color: "white" }}>Facility</Nav.Link>
        <Nav.Link href="/routes" style={{ color: "white" }}>Routes</Nav.Link>
        <Nav.Link href="/liveMap" style={{ color: "white" }}>Live Map</Nav.Link>
      </Nav>
    </Container>
  </ReactNavbar>
  


  );
}