import React, { Component } from 'react';
import ProjectCard from "../projects/card"
import UserEdit from "./edit"
import ProjectShow from '../projects/show'
import SkillCard from "../skills/card"
import InterestCard from "../interests/card"
import CourseCard from "../courses/card"
import { logErrors } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithubSquare } from '@fortawesome/free-brands-svg-icons'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Icon1 from '../../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../../assets/images/ProfileIcons/Icon4.png';

class UserShow extends Component{

  constructor(props) {
    super()
    this.state = {
      selectedProject: null, 
      allBuckets: null, 
      buckets: null, 
      interests:null, 
      highlights:null, 
      projects: null, 
      showEdit: props.showEdit, 
      userAttrs: props.user.attributes, 
      profilePicture: props.user.picture, 
      hideInfo:false, 
      hideCourses:false, 
      hideSkills:false, 
      hideProjects:false, 
      hideInterests:false, 
      noSkills: false,
      profileIcons: [Icon1, Icon2, Icon3, Icon4],
      isFullHd: false,
    }
  }

  componentDidMount = () => {
    this.getUserProjects()
    this.getUserSkills()
    this.getUserInterests()
    this.getUserCourses()
    this.getUpdatedUser()
    this.getAllBuckets()
    this.getNetID()
    this.updatePredicate()
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate = () => {
    this.setState({
      isFullHd: window.innerWidth > 1408
    });
  }

  deleteInterest = (interest) => {
    this.setState(prevState => ({
      interests: prevState.interests.filter(i => i !== interest)
    }),
    );
  }

  deleteHighlight = (highlight) => {
    this.setState(prevState => ({
      highlights: prevState.highlights.filter(i => i !== highlight)
    }), 
    );
  }


  getNetID = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/saml/currentuser"
    axios.get(url).then(function (response) {
      self.setState({netid: response.data.net_id})
    })
    .catch(function (error) {
      logErrors(error);
    });
  }

  availability = () => {
    if(!this.state.hideInfo){
      if(this.state.userAttrs.availability){
        return <div className="floatcard ">
          <h4 className='card-header'>Availability</h4>
          <p><FontAwesomeIcon className="green" icon="circle" /> Available to work on new projects.</p>

          <h4 className='card-header'>Time availability</h4>
          <p>{this.state.userAttrs.min_time} to {this.state.userAttrs.max_time} hours per week</p>
        </div>
      }
      return <div className="floatcard ">
        <h4 className='card-header'>Availability</h4>
        <p><FontAwesomeIcon className="red" icon="circle" /> Not available to work on new projects.</p>
      </div>
    }
  }

  bio2 = (user) => {
    if(user.bio){
      return <div>
        <h4 className='card-header'>bio</h4>
        <p>{user.bio}</p>
      </div>
    }
  }

  affiliation = (user) => {
    return <div>
      <h5 className='card-header'>affiliation</h5>
      <p>{user.duke_title}</p>
    </div>
  }

  major = (user) => {
    return <div>
      <h5 className='card-header'>major</h5>
      <p>{user.major}</p>
    </div>
  }

  gradyear = (user) => {
    return <div>
        <h5 className='card-header'>graduation year</h5>
        <p>{user.year}</p>
    </div>
  }

  bio = (user) => {
    if(!this.state.hideInfo){
      return <div className="floatcard">
        {this.bio2(user)}
        {this.affiliation(user)}
        {this.major(user)}
        {this.gradyear(user)}
      </div>
    }
  }

  redirect_links = (site) =>{
    let s = site.toString()
    if(s.includes("https://")){
      window.open(s)
    }
    else{
      let url = "https://" + s
      window.open(url)
    }
  }

  contact = (user) => {
    if(!this.state.hideInfo && (user.linkedin || user.github || user.website)){
      return <div className="floatcard">
        <h4 className='card-header'>contact</h4>
        <ul className="contact">
          <li > <FontAwesomeIcon icon="envelope-square" className="logo" id="email"/> <a href={"mailto:" + user.netid+"@duke.edu"}> {user.netid}@duke.edu </a> </li>
          <li onClick={this.redirect_links.bind(this, user.linkedin)}> <FontAwesomeIcon  icon={faLinkedin} className="logo" id="linkedin" /> <Link to="#"> {user.linkedin} </Link> </li>
          <li onClick={this.redirect_links.bind(this, user.github)}> <FontAwesomeIcon  icon={faGithubSquare} className="logo" id="github"/> <Link to="#"> {user.github} </Link> </li>
          <li onClick={this.redirect_links.bind(this, user.website)}>  <FontAwesomeIcon  icon="globe" className="logo" id="website"/> <Link to="#"> {user.website} </Link> </li>
        </ul>
      </div>
    }
  }

  displayUser = () => {
    let user = this.state.userAttrs
    if(user && this.state.showEdit !== true && this.state.selectedProject === null){
      return <div>
        <p> <a href="/"> Discover </a> <FontAwesomeIcon  icon="chevron-right" className="caret-right" id="caret-right" /> <a href="/people"> People </a></p>
      <div className='tile is-ancestor columns is-centered'>
        <div className="tile is-vertical is-parent column is-4-fullhd is-6-tablet is-narrow">
          <div className="tile is-child is-vertical">
            {this.heroBanner(user)}
            <h3 className='section-header link' onClick={this.toggleInfo}>Info <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.bio(user)}
            {this.contact(user)}
            {this.availability()}
          </div>
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleCourses}>Courses <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.courses(user)}
          </div>
        </div>
        {this.displaySkillAndProjectColumns(user)}
        
      </div>
      </div>
    }
  }

  displaySkillAndProjectColumns = (user) => {
    if(this.state.isFullHd){
      return <div className="column is-8-fullhd is-6-tablet columns is-multiline">
        <div className="tile is-vertical is-child column is-6">
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleSkills}>Skills <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.skills(user)}
            <h3 className='section-header link' onClick={this.toggleInterests}>Interests <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.interests(user)}
          </div>
        </div>
        <div className="tile is-vertical is-child column is-6">
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleProjects}>Projects <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.projects(user)}
          </div>
        </div>
      </div>
    }else{
      return <div className="column is-8-fullhd is-6-tablet">
        <div className="tile is-vertical is-child is-12">
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleSkills}>Skills <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.skills(user)}
            <h3 className='section-header link' onClick={this.toggleInterests}>Interests <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.interests(user)}
          </div>
        </div>
        <div className="tile is-vertical is-child is-12">
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleProjects}>Projects <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.projects(user)}
          </div>
        </div>
      </div>
    }
  }


  editButton = () => {
    if (this.state.netid === this.state.userAttrs.netid || localStorage.getItem("netid") === "da129"){
      return <button onClick={this.toggleEdit}  className="blue-button" id="edit">Edit Profile</button>
    }
  }


  editForm = () => {
    if(this.state.showEdit){
      return <UserEdit getUsers={this.props.getUsers} allBuckets={this.state.allBuckets} highlights={this.state.highlights} interests={this.state.interests} buckets={this.state.buckets} userAttrs={this.state.userAttrs} user={this.props.user} getUpdatedUser={this.getUpdatedUser} getUpdatedCourses = {this.getUserCourses} courses = {this.state.courses} getUpdatedProfilePicture = {this.getUpdatedProfilePicture} profile_picture = {this.state.profilePicture} toggleEdit={this.toggleEdit} deleteInterest={this.deleteInterest} deleteHighlight={this.deleteHighlight}/>
    }
  }


  getUserProjects = () => {
    if (this.state.userAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/" + self.state.userAttrs.id +  "/projects"
      axios.get(url).then(function (response) {
        self.setState({projects: response.data})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  getUserSkills = () => {
    if (this.state.userAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/skills/" + self.state.userAttrs.id 
      axios.get(url).then(function (response) {
        self.setState({buckets: response.data.data, noSkills: response.data.no_skills})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  getAllBuckets = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/skills"
    axios.get(url).then(function (response) {
      self.setState({allBuckets: response.data.data})
    })
    .catch(function (error) {
      logErrors(error);
    });
  }

  getUserInterests = () => {
    if (this.state.userAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/interests/" + self.state.userAttrs.id 
      axios.get(url).then(function (response) {
        self.setState({highlights: response.data.highlights, interests: response.data.interests})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  getUserCourses = () => {
    if (this.state.userAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/courses/" + self.state.userAttrs.id 
      axios.get(url).then(function (response) {
        self.setState({courses: response.data})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  getUpdatedUser = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/" + self.state.userAttrs.id
    axios.get(url)
      .then(function(response){
        self.setState({ userAttrs: response.data.data, profilePicture: response.data.picture})
      })
      .catch(function (error){
        logErrors(error);
      });

  }


  heroBanner = (user) =>{
    return <div>
      <div id="profile-hero" className='floatcard tile is-child'>
        {this.profilePicture(user.id)}
        <h3 id='profile-name'>{user.full_name}</h3>
      </div>
      {this.editButton()} 
    </div>
  }

  // note that this will need to create several interests cards based off of the design
  interests = () =>{
    if(!this.state.hideInterests){
      if((this.state.interests && this.state.interests.length > 0) || (this.state.highlights && this.state.highlights.length > 0)){
        return this.mapInterests()
      }else{
        return <div className='floatcard tile is-child'>
         <h4 className='card-header'>No Interests Added</h4>
        </div>
      }
    }  
  }

  courses = () =>{
    if(!this.state.hideCourses){
      if(this.state.courses && this.state.courses.length > 0){
        return this.mapCourses()
      }else{
        return <div>
          <div className="floatcard interest">
            <h4 className="card-header"> Academic Courses </h4>
            <ul className="list">
              No courses added
            </ul>
          </div>
          <div className="floatcard interest">
              <h4 className="card-header"> Roots Courses </h4>
              <ul className="list">
                No courses added
              </ul>
          </div>
        </div>
      }
    }  
  }

  projects = () =>{
    if(!this.state.hideProjects){
      if(this.state.projects && this.state.projects.length > 0){
        return this.mapUserProjects()
      }else{
        return <div className='floatcard tile is-child'>
          <h4 className='card-header'>Project Owner</h4>
          <p>No projects</p>
          <h4 className='card-header'>Project Member</h4>
          <p>No projects</p>
        </div>
      }
    }  
  }

  // note that this will need to create several skill cards based off of the design
  skills = () =>{
    if(!this.state.hideSkills){
      if(this.state.noSkills){
        return <div className='floatcard tile is-child'>
          <h4 className='card-header'>No Skills Added</h4>
        </div>
      }else if(this.state.buckets && this.state.buckets.length > 0){
        return this.mapSkills()
      }
    }
  }

  toggleEdit = () =>{
    if(this.state.showEdit){
      this.setState({showEdit: false})
    }else{
      this.setState({showEdit: true})
    }
  }

  toggleInfo = () =>{
    this.setState({hideInfo: !this.state.hideInfo})
  }

  toggleCourses = () =>{
    this.setState({hideCourses: !this.state.hideCourses})
  }

  toggleSkills = () =>{
    this.setState({hideSkills: !this.state.hideSkills})
  }

  toggleInterests = () =>{
    this.setState({hideInterests: !this.state.hideInterests})
  }

  toggleProjects = () =>{
    this.setState({hideProjects: !this.state.hideProjects})
  }

  mapSkills = () => {
    return this.state.buckets.map((bucket, index) => <SkillCard skill_bucket={bucket} key={index}/>)
  }

  mapUserProjects(){
    return <ProjectCard projects={this.state.projects} user_id={this.state.userAttrs.id} selectProject = {this.selectProject}/>
  }

  mapInterests = () => {
    return <InterestCard highlights = {this.state.highlights} interests={this.state.interests}/>
  }

  mapCourses = () => {
    return <CourseCard courses={this.state.courses} />
  }

  profilePicture = (id) =>{
    let pic =  {
      backgroundImage: "url(" + this.state.profilePicture + ")",
      backgroundRepeat: "no-repeat"
    }

    if(this.state.profilePicture){
      return <div>
          <div className='profile-picture' style={pic}></div>
        </div>
    }
    else{
      let icon = {
        backgroundImage: "url(" + this.state.profileIcons[id%4] + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }
      return  <div>
        <div className='profile-picture' style={icon}></div>
      </div>
    }
  }

  displayProject = () => {
    if (this.state.selectedProject && this.showEdit !== true) {
      return <ProjectShow project={this.state.selectedProject} />
    }
  }

  selectProject = (projectId) => {
    let projects = this.state.projects
    projects.forEach((project) => {
      if(project.attributes.id === projectId){
        this.setState({selectedProject: project})
        return null
      }
    });
  }

  render(){
    return(
      <div>
        {this.displayUser()}
        {this.editForm()}
        {this.displayProject()}
      </div>
    );
  }
}

export default UserShow;
