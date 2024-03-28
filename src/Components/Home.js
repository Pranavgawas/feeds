import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/Home.css"

function Home() {
  const navigate = useNavigate();

  const handleLogIn = () => {
    navigate(`/login`);
  };

  return (
    <div>
      
      <button className="btn" onClick={handleLogIn}>User Log In</button>

    </div>
  );
}

export default Home;
