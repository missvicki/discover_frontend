import React,{Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import {loginWithDuke} from "../helpers";
import DukeLogo from '../assets/images/duke_wordmark_navyblue_012169.svg';
import '../assets/css/header.css';
import UniversalSearch from './universal_search'
import '../assets/css/index.css';
import {logErrors} from '../helpers'
import axios from 'axios';


class Header extends Component{
  constructor(props){
    super()
    this.state={returnHome: false, isActive: false, isCollapsed: false}
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount = () => {
    this.updatePredicate();
    // this.getNetID()
    this.getAdmin()
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate = () => {
    this.setState({ isCollapsed: window.innerWidth < 1024 });
  }

  authStatus = () => {
    // a user is considerd authenticated if he/she has both the accessToken and idToken from oauth set
    if(localStorage.getItem("loggedIn")){
      return <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} to="#" onClick={this.deleteSession}>Logout</Link>
    } else{
       return <Link to="#" className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} onClick={this.createSession}>Login/Register</Link>
    }
  }

  createSession = () => {
    loginWithDuke()
  }


  deleteSession = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("netid")
    localStorage.removeItem("full_name")
    localStorage.removeItem("admin")
    
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/saml/logout"

    window.location.href = url;
  }

  retrunToHomePage = () => {
    if (this.state.returnHome) {
      return <Redirect to="/"/>
    } 
  }

  setIsActive = ()  => {
    this.setState({isActive: !this.state.isActive});
  }

  clearUser = () => {
    this.checkAndDelete();
    if (this.props.clearSelectedUser) { this.props.clearSelectedUser()}
    this.setState({isActive: false});

  }

  clearProject = () => {
    // if (this.props.clearSelectedProject) { this.props.clearSelectedProject()}
    this.checkAndDelete();
    this.setState({isActive: false});
    window.location.href = "/projects"
  }

  myProfile = () => {
    // if (this.props.selectUserFromParam) { this.props.selectUserFromParam(localStorage.getItem('netid'))}
    this.checkAndDelete();
    this.setState({isActive: false});
    window.location.href = this.userProfilePath();
  }

  userProfilePath = () =>{
    return "/people/" + localStorage.getItem('netid')
  }

  getAdmin = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/admincheck"
    axios.get(url).then(function (response) {
      self.setState({admin: response.data.admin})
    })
    .catch(function (error) {
      logErrors(error);
    });
  }

  admin = () =>{
    if(this.state.admin){
      return <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} to="/admin" onClick={this.checkAndDelete}>Admin</Link>
    }
  }

  checkAndDelete = () =>{
    if(this.props.isCreate){
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + this.props.selectedProject.attributes.id 
      axios.delete(url, {
        headers: {
        'content-type': 'multipart/form-data'
        }
      })
    }
  }

  render = () => {
    return(
      <div>
        {this.retrunToHomePage()}
        <div className="banner">
          <img src={DukeLogo} alt="Duke"/>
          <h2 className='header-title '> Discover</h2>
        </div>
        
        <nav className="navbar is-navy-blue" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a href="#!" role="button" className={`navbar-burger white ${this.state.isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="myTopnav" onClick={() => this.setIsActive()}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div id="myTopnav" className={`navbar-menu ${this.state.isActive ? 'is-active' : ''}`}>
            <div className="navbar-start">
              <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} onClick={this.checkAndDelete} to="/">Home</Link>
              <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} onClick={this.checkAndDelete} to="/about" >About</Link>
              <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} onClick={this.clearProject} to="#">Projects</Link>
              <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} onClick={this.clearUser} to="/people">People</Link>
              <Link className={`navbar-item ${this.state.isCollapsed && this.state.isActive ? 'duke-blue' : 'white'}`} onClick={this.myProfile} to="#">My Profile</Link>
              {this.admin()}
              {this.authStatus()}
            </div>
            <div className="navbar-end">
              <UniversalSearch isCollapsed={this.state.isCollapsed} isActive={this.state.isActive}/>
            </div>
          </div>
        </nav>
      </div> 
    );
  }   
}

export default Header;
