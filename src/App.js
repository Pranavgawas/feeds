import React from 'react'; 
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Feeds from './Components/Feeds';
import Home from './Components/Home';
import MyPost from './Components/MyPost';
import UpdatePost from './Components/UpdatePost';
import AdminPost from './Components/AdminPost';
import OtherPost from './Components/OtherPost';
import Welcome from './Components/Welcome';
import AdminLogin from './Components/AdminLogin';
import SetupAdmin from './Components/SetupAdmin';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Welcome />
        <Routes>
          <Route path ="/" exact element ={<Home />}></Route>
          <Route path ="/login" exact element ={<Login  />}></Route>
          <Route path ="/register" exact element ={<Register />}></Route>
          <Route path ="/feeds" exact element ={<Feeds />}></Route>
          <Route path ="/mypost" exact element ={<MyPost  />}></Route>
          <Route path="/UpdatePost/:postId" element={<UpdatePost />} />
          <Route path ="/adminlogin" exact element ={<AdminLogin />}></Route>
          <Route path ="/adminpost" exact element ={<AdminPost />}></Route>
          <Route path ="/otherpost" exact element ={<OtherPost />}></Route>
          <Route path ="/setup-admin" exact element ={<SetupAdmin />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
