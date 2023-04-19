import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';



class SamlConsume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      net_id: null,
    };
  }


  getNetid = () => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/saml/currentuser"
    axios.get(url).then(function (response) {
      localStorage.setItem("netid", response.data.net_id)
      localStorage.setItem("full_name", response.data.full_name)
      localStorage.setItem("loggedIn", true)
      localStorage.setItem("admin", response.data.admin)
    })
  }


  retrunToHomePage = () => {
      return <Redirect to="/"/>
  }

  render() {
    this.getNetid();
    return (  
      <div>
        {this.retrunToHomePage()}
      </div>
    );
  }
}

export default SamlConsume;