import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const UserLevelConnectLink = () => {
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [stripeLink, setStripeLink] = useState(null);

  useEffect(() => {
    const fetchUserLevelAndStripeLink = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        // Fetch user level
        const responseUserLevel = await fetch(`${process.env.BACKEND_URL}/api/userslevel`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!responseUserLevel.ok) {
          throw new Error(`HTTP error! status: ${responseUserLevel.status}`);
        }

        const dataUserLevel = await responseUserLevel.json();
        const userLevel = dataUserLevel.level;
        let roleName;


        switch (userLevel) {
          case 1:
            roleName = "Basic User";
            break;
          case 2:
            roleName = "Super User";
            break;
          case 3:
            roleName = "Admin";
            break;
          default:
            roleName = "Unknown Role";
        }

        setRole(roleName);


        const responseStripeLink = await fetch(`${process.env.BACKEND_URL}/api/usersstripelink`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!responseStripeLink.ok) {
          throw new Error(`HTTP error! status: ${responseStripeLink.status}`);
        }

        const dataStripeLink = await responseStripeLink.json();
        setStripeLink(dataStripeLink.stripe_link_integration);

      } catch (err) {
        setError(err.message);
      }
    };
    console.log(stripeLink)
    fetchUserLevelAndStripeLink();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleButtonClick = () => {
    if (stripeLink) {
      window.location.href = stripeLink;
    } else {
      console.log('No Stripe link available');
    }
  };

  return (
    <>
      <div className="user-level">
        <p><strong>YOUR SANDSMILE ROLE:</strong> <span>{role}</span></p>
      </div>
      <div>
        {role === "Super User" && (
          <button className="user-level-button" onClick={handleButtonClick}>
            Payment Details
          </button>
        )}
        {role === "Admin" && (
          <Link to="/admin">
            <button className="user-level-button">
              Go to Admin Page
            </button>
          </Link>
        )}
      </div >
    </>
  );
};