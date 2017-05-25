import React, { Component } from 'react';
import './App.css';
import Doctors from './Doctors';
import Insurances from './Insurances';
import DoctorDetailsContainer from './DoctorDetailsPage/DoctorDetailsContainer';
import InsuranceDetailsPage from './InsuranceDetailsPage/InsuranceDetailsPage';
import chemedLogo from './Chemed-logo.jpg';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={chemedLogo} alt="chemed logo" className="App-logo"/>
            <h2>Credentialing Manager</h2>
          </div>

          <ul className="link nav nav-pills">
            <li role="presentation" key="doctors">
              <Link to="/Doctors">Doctors</Link>
            </li>
            <li role="presentation">
              <Link to="/Insurances">Insurances</Link>
            </li>
          </ul>

          <Route path="/Doctors" component={Doctors}/>
          <Route path="/Insurances" component={Insurances}/>
          <Route path="/DoctorDetails/:doctorId" component={DoctorDetailsContainer}/>
          <Route path="/InsuranceDetails/:insuranceId" component={InsuranceDetailsPage}/>
        </div>
      </Router>
    );
  }
}

export default App;
