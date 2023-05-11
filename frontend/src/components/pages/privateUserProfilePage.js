import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Container } from 'react-bootstrap';
import axios from 'axios';


const url = "http://localhost:8081/user/changeUserInfo";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [output, setOutput] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  function clearProfileDetails() {
    var profileDetails = document.getElementById("profile-details");
    profileDetails.innerHTML = "";
  }

  useEffect(() => {
    document.body.style.backgroundColor = 'aliceblue';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const handleClick = (event) => {
    const { name } = event.target;
    setButtonName(name);
    setOutput(""); // add this line
    if (name === "Display") {
      setShowDetails(true);
    } else {
      setShowDetails(false);
      clearProfileDetails();
    }
  };
  const [buttonName, setButtonName] = useState("Display");

  return (
    <Container>
    <h1>Profile Page</h1>
{showDetails && (
  <div id="profile-details" style={{ marginLeft: '100px' }}>
    <p>Username: {user.username}</p>
    <p>Email: {user.email}</p>
  </div>
)}
<Button
  variant="primary"
  onClick={handleClick}
  name={showDetails ? "Hide" : "Display"}
  style={{ 
    backgroundColor: "initial",
    backgroundImage: "linear-gradient(to bottom right, #828282, #7d7d7d, #616161)",
    borderRadius: "3px",
    borderStyle: "none",
    boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
    color: "#fff",
    cursor: "pointer",
    display: "block",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "500",
    height: "100px",
    lineHeight: "60px",
    outline: "0",
    textAlign: "left",
    transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "manipulation",
    verticalAlign: "bottom",
    width: "230px",
    margin: "30px 0",
    marginLeft: "-21.8%"
  }}
>
  {showDetails ? "Hide" : "Display"} User Info
</Button>

      <Button variant="danger" 
      onClick={handleLogout}
      style={{ 
        backgroundColor: "initial",
        backgroundImage: "linear-gradient(to bottom right, #828282, #7d7d7d, #616161)",
        borderRadius: "3px",
        borderStyle: "none",
        boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
        color: "#fff",
        cursor: "pointer",
        display: "block",
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: "500",
        height: "100px",
        lineHeight: "60px",
        outline: "0",
        textAlign: "left",
        transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        verticalAlign: "bottom",
        width: "230px",
        margin: "30px 0",
        marginLeft: "-21.8%"
      }}>
        Logout
      </Button>
    </Container>
  );
};

export default PrivateUserProfile;


