import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Container } from 'react-bootstrap';



const url = "http://localhost:8081/user/changeUserInfo";
// the use effects and use states from displaying info and user logout 
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

    // Set the background color of the body and reset it on component unmount
  useEffect(() => {
    document.body.style.backgroundColor = 'aliceblue';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

   // Function to handle Display/Hide button click
  const handleClick = (event) => {
    const { name } = event.target;
    setButtonName(name);
    setOutput(""); // Reset the output state 
    if (name === "Display") {
      setShowDetails(true);// Show profile details
    } else {
      setShowDetails(false);// Hide profile details
      clearProfileDetails();// Clear profile details from the DOM
    }
  };
  const [buttonName, setButtonName] = useState("Display");// State for button name


  return (
    <Container>
    <h1>Profile Page</h1>
     {/* Conditionally render profile details if showDetails is true */}
{showDetails && (
  <div id="profile-details" style={{ marginLeft: '100px' }}>
    <p>Username: {user.username}</p>
    <p>Email: {user.email}</p>
  </div>
)}
{/* Display/Hide button */}
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
>{/* Button text */}
  {showDetails ? "Hide" : "Display"} User Info
</Button>
{/* Logout button */}
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

