import logo from './logo.svg';
import Guidelines from './Components/Guidelines'
import Form from './Components/Form'
import { Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';


function App() {



  return (
    <div className="App">

      <BrowserRouter>
        <div style={{ display: "flex", flex: "row", margin: "50px" ,justifyContent: "center"}}>

          <div><Link to='/form' className="btn btn-primary btn-lg" style={{margin:"20px"}}>מילוי הטופס</Link></div>
          <div><Link to='/guidelines' className="btn btn-primary btn-lg" style={{margin:"20px"}}>הנחיות</Link></div>

        </div>

        <Routes>
          <Route path='/' element={<Guidelines ></Guidelines>} />
          <Route path='/guidelines' element={<Guidelines ></Guidelines>} />
          <Route path='/form' element={<Form ></Form>} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
