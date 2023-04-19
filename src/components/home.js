import React, {Component} from 'react';
import Header from './header'
import '../assets/css/index.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {logErrors} from '../helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserCard from './users/card';
import colab from '../assets/images/colab_work.jpg';
import Discover1 from '../assets/images/ProjectIcons/Discover1.png';
import Discover2 from '../assets/images/ProjectIcons/Discover2.png';
import Discover3 from '../assets/images/ProjectIcons/Discover3.png';
import Discover4 from '../assets/images/ProjectIcons/Discover4.png';
import Discover5 from '../assets/images/ProjectIcons/Discover5.png';
import Discover6 from '../assets/images/ProjectIcons/Discover6.png';
import Discover7 from '../assets/images/ProjectIcons/Discover7.png';
import Discover8 from '../assets/images/ProjectIcons/Discover8.png';
import Discover9 from '../assets/images/ProjectIcons/Discover9.png';
import Discover10 from '../assets/images/ProjectIcons/Discover10.png';


class Home extends Component{ 

  constructor(props) {
    super()
    this.state = {
      apiStatus: false,
      projects: null,
      users: null,
      selectedUser: null,
      projectIcons: [Discover1, Discover2, Discover3, Discover4, Discover5, 
        Discover6, Discover7, Discover8, Discover9, Discover10],
    } 

  }

  componentDidMount = () => {
    this.getProjects();
    this.getUsers();
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updatePredicate);
  }
  
  updatePredicate = () => {
    this.setState({
      isTablet: window.innerWidth < 1050,
      isMobile: window.innerWidth < 769,
    });
  }
  
  userProfilePath = () =>{
    return "/people/" + localStorage.getItem('netid')
  }

  getProjects = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/home_page/random";
    axios.get(url)
      .then(function (response) {
        self.setState({
          projects: response.data.data,
        });
      })
      .catch(function (error) {
        logErrors(error);
      })
  }

  getUsers = () => {
    var self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/home_page/random";
    axios.get(url)
      .then(function (response) {
        self.setState({
          users: response.data.data,
        });
        
      })
      .catch(function (error) {
        logErrors(error);
      })
  }

  selectUser = (user) => {
    this.setState({selectedUser: user})
    window.location.href = `/people/${user.attributes.netid}`;
  }

  mapUsers = (currUsers) => {
    let colSize = "is-one-third";
    if(currUsers){
      if(this.state.isMobile){
        currUsers = currUsers.slice(0, 2);
        colSize = "is-one-half";
      }else if(this.state.isTablet){
        currUsers = currUsers.slice(0, 2);
        colSize = "is-one-half";
      }
      let userRows = currUsers.map((user, index) => <div className={"column "+colSize} key={index}><UserCard user = {user} selectUser={this.selectUser} key={index} home={true}> </UserCard></div>)
      return <div className="columns">{userRows}</div>
    }
  }

  selectProject = (project) => {
    this.setState({selectedProject: project})
    window.location.href = `/projects/${project.id}`; 
  }

  mapProjects = (currProjects) => {
    if(currProjects){
      if(this.state.isMobile){
        currProjects = currProjects.slice(0, 2);
      }else if(this.state.isTablet){
        currProjects = currProjects.slice(0, 2);
      }
      return <div className="columns">
        {currProjects.map((project, index) => this.displayProjectCard(project.attributes, index))}
      </div>
    }
  }
  
  displayProjectCard = (project, index) => {
    let colSize = "is-one-third";
    if(this.state.isMobile){
      colSize = "is-one-half";
    }else if(this.state.isTablet){
      colSize = "is-one-half";
    }
    return <div key={index} className={"column "+colSize}>
      <div className="floatcard fixed-home project" onClick={() => this.selectProject(project)} >
        {this.projectPicture(project.picture, project.id)}
        <h4 className="section-header link"><abbr className="project-name-home" title={project.name}> {project.name}</abbr></h4>
        <p className="description-gray">{project.description}</p>
        {this.availability(project.availability)} 
      </div>
    </div>
  }

  projectPicture = (picture, id) =>{
    let pic =  {
      backgroundImage: "url(" + picture + ")",
      backgroundRepeat: "no-repeat"
    }
    if(picture){
      return <div className='project-image' style={pic}></div>
    }
    else{
      let icon = this.state.projectIcons[id%10];
      return <img className='project-image' src={icon} alt="default icon"></img>
    }
  }

  availability = (availability) => {
    if(availability){
      return <p className="bottom"><FontAwesomeIcon className="green" icon="circle" /> Open to new collaborators</p>
    }
    return <p className="bottom"><FontAwesomeIcon className="red" icon="circle" /> Not open to new collaborators</p>
  } 

  displayColabPic = () =>{
    if(!this.state.isMobile){
      return <img className="colab block-height-60 display-about" src={colab} alt="Colab Pic"></img> 
    }else{
      return;
    }
  }
  
  render = () => {
    return(
      <div>
        <Header/>
        <div className="about-background">
          <div className="title-block">
            <div className="title-background"></div>
            <h1 className="title">Welcome to Project Discover!</h1>
            <p className="blue-blurb"> Put your skills to the test and join amazing projects or create your own and fill your team with peers.</p>
          </div>
          {this.displayColabPic()}
          <div className= "display-about container block-height-60">
            <h2 className="section-title-blue">What is Project Discover</h2>
            <br></br>
            <p className="section-p" >
              Ever had an amazing idea, but couldn't bring it to life because you were missing some of the necessary skills to make it happen?
              We've all been there! Realistically speaking, it is unlikely that anyone would have the time and motivation to learn it all,
              and that is why we created Project Discover! Share your project with us and the Discover community and get the help you need, or,
              if ideas aren't so much your thing, join and lend your talent and skills to other's exciting projects!
            </p>
            
            <div className="centre">
            <Link className="yellow-button button-big" to='/about'>Learn More</Link>
            <Link className="yellow-button button-big" to={this.userProfilePath()}>Get Started</Link>
            </div>
            
          </div>
          

          <div className="background-white block-height-100">
            <div className="display-about container">
              <h2 className="section-title-blue">Featured Projects</h2>
              <p>Not convinced yet? Check out these amazing featured projects!</p>
              <div>
                {this.mapProjects(this.state.projects)}
              </div>
              <div className="centre">
                <Link className="yellow-button button-big" to='/projects'>See More</Link>
              </div>
            </div>
          </div>
          
          <div className="display-about container block-height-100">
            <h2 className="section-title-blue">Featured Profile</h2>
            <p>Have a project in mind? These people are available to help!</p>
            {this.mapUsers(this.state.users)}
            <div className="centre">
              <Link className="yellow-button button-big" to='/people'>See More</Link>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Home;