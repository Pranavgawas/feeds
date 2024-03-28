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

function App() {

  return (
    <div className="App">
      <Welcome />
      <BrowserRouter>
        <Routes>
          <Route path ="/" exact element ={<Home />}></Route>
          <Route path ="/login" exact element ={<Login />}></Route>
          <Route path ="/register" exact element ={<Register />}></Route>
          <Route path ="/feeds" exact element ={<Feeds />}></Route>
          <Route path ="/mypost" exact element ={<MyPost />}></Route>
          <Route path ="/mypost/updatepost" exact element ={<UpdatePost />}></Route>
          <Route path ="/adminpost" exact element ={<AdminPost />}></Route>
          <Route path ="/otherpost" exact element ={<OtherPost />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
