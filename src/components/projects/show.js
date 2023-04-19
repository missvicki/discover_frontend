import React, {Component} from 'react';
import axios from 'axios'
import ProjectEdit from './edit'
import Membership from './membership'
import SkillCard from "../skills/card"
import UserShow from '../users/show'
import { logErrors } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithubSquare  } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
import Discover1 from '../../assets/images/ProjectIcons/Discover1.png';
import Discover2 from '../../assets/images/ProjectIcons/Discover2.png';
import Discover3 from '../../assets/images/ProjectIcons/Discover3.png';
import Discover4 from '../../assets/images/ProjectIcons/Discover4.png';
import Discover5 from '../../assets/images/ProjectIcons/Discover5.png';
import Discover6 from '../../assets/images/ProjectIcons/Discover6.png';
import Discover7 from '../../assets/images/ProjectIcons/Discover7.png';
import Discover8 from '../../assets/images/ProjectIcons/Discover8.png';
import Discover9 from '../../assets/images/ProjectIcons/Discover9.png';
import Discover10 from '../../assets/images/ProjectIcons/Discover10.png';

class ProjectShow extends Component{
  constructor(props){
    super()
    this.state = {
      // users: [], 
      user: null, 
      admin: false, 
      owner: false, 
      selectedMember: null, 
      memberships: props.project.memberships, 
      members: [], 
      projectAttrs: props.project.attributes, 
      projectPicture: props.project.picture, 
      showEdit: props.showEdit, 
      isCreate: props.isCreate,
      projectbuckets: [], 
      userbuckets: [], 
      hideInfo:false, 
      hideUserSkills:false, 
      hideProjectSkills:false, 
      hideCollaborators:false,
      projectIcons: [Discover1, Discover2, Discover3, Discover4, Discover5, 
        Discover6, Discover7, Discover8, Discover9, Discover10],
    }
  }

  componentDidMount = () => {
    this.getNetID()
    this.getUserSkills()
    this.getProjectSkills()
    this.getMembers()
    this.getUpdatedProject()
    this.getAllBuckets()
    this.getAdmin()
  }

  getNetID = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/saml/currentuser"
    axios.get(url).then(function (response) {
      self.setState({netid: response.data.net_id})
      self.checkOwnership()
    })
    .catch(function (error) {
      logErrors(error);
    });
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

  checkOwnership = () => {
    
    if (this.state.projectAttrs && this.state.netid){
      
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + self.state.projectAttrs.id + "/netid/" + self.state.netid
      axios.get(url).then(function (response) {
        self.setState({owner: response.data.data, user: response.data.user.full_name})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }


  bio = (project) => {
    if(!this.state.hideInfo && project.description){
      return <div className="floatcard">
        <h4 className='card-header'> Description </h4>
        <p>{project.description}</p>

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

  contact = (project) => {
    if(!this.state.hideInfo && (project.linkedin || project.github || project.website)){
      return <div className="floatcard">
        <h4 className='card-header'>contact</h4>
        <ul className="contact">
          <li onClick={this.redirect_links.bind(this, project.linkedin)}> <FontAwesomeIcon  icon={faLinkedin} className="logo" id="linkedin" /> <Link to="#"> {project.linkedin} </Link> </li>
          <li onClick={this.redirect_links.bind(this, project.github)}> <FontAwesomeIcon  icon={faGithubSquare} className="logo" id="github"/> <Link to="#"> {project.github} </Link> </li>
          <li onClick={this.redirect_links.bind(this, project.website)}>  <FontAwesomeIcon  icon="globe" className="logo" id="website"/> <Link to="#"> {project.website} </Link> </li>
        </ul>
      </div>
    }
  }

  availability = (project) => {
    let commitment = <p></p>
    if (project.min_time && project.max_time) {
      commitment = <p>{project.min_time} to {project.max_time} hours per week</p>
    }
    else if (project.min_time) {
      commitment = <p> At least {project.min_time} hours per week</p>
    } 
    else if (project.max_time) {
      commitment = <p> Up to {project.max_time} hours per week</p>
    }
    else  {
      commitment = <p> No information </p>
    }
    if(!this.state.hideInfo){
      if(project.availability){
        return <div className="floatcard ">
          <h4 className='card-header'>Availability</h4>
          <p><FontAwesomeIcon className="green" icon="circle" /> Open to new collaborators.</p>

          <h4 className='card-header'>Time commitment</h4>
          {commitment}
        </div>
      }
      return <div className="floatcard ">
        <h4 className='card-header'>Availability</h4>
        <p><FontAwesomeIcon className="red" icon="circle" /> Not open to new collaborators.</p>
      </div>
    }
  }

  displayProject = () => {
    let project = this.state.projectAttrs
    let picture = this.state.projectPicture
    if(project && this.state.showEdit !== true && this.state.selectedMember === null){
      return <div>
        <p> <a href="/"> Discover </a> <FontAwesomeIcon  icon="chevron-right" className="caret-right" id="caret-right" /> <a href="/projects"> Projects </a></p>
        <div className='tile is-ancestor columns is-centered'>
        <div className="tile is-vertical is-parent is-4 is-narrow">
          <div className="tile is-child is-vertical">
            {this.heroBanner(project, picture)}
            <h3 className='section-header link' onClick={this.toggleInfo}>Info <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.contact(project)}
            {this.bio(project)}
            {this.availability(project)}
          </div>
          
        </div>

        <div className="tile is-vertical is-parent columns is-4 is-6-tablet">
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleProjectSkills}>Needed Skills <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.projectskills(project)}


            <h3 className='section-header link' onClick={this.toggleUserSkills}> Current Skills <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.userskills(project)}
          </div>
        </div>

        <div className="tile is-vertical is-parent is-4">
          <div className="tile is-child is-vertical">
            <h3 className='section-header link' onClick={this.toggleCollaborators}> Collaborators <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
            {this.members()}
          </div>
        </div>

        

      </div>
      </div>
    }
  }

  heroBanner = (project) =>{
    return <div>
      {this.projectPicture(project.id)}
      <div className='floatcard projectpage'>
        <h3 className="section-header">{project.name}</h3>
      </div>
      {this.editButton()} 
    </div>
  }

  projectPicture = (id) =>{
    let pic =  {
      backgroundImage: "url(" + this.state.project_picture + ")",
      backgroundRepeat: "no-repeat"
    }

    if(this.state.project_picture){
      return <div>
          <div className='project-picture' style={pic}></div>
        </div>
    }
    else{
      let icon =  {
        backgroundImage: "url(" + this.state.projectIcons[id%10] + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }  
      return <div>
          <div className='project-picture' style={icon}></div>
      </div>
    }
  }

  editButton = () => {
    if (this.state.owner || this.state.admin){
      return <div>
        <button onClick={this.toggleEdit} className="blue-button" id="edit">Edit Project</button>
        <button type="button" className="red-button" onClick={this.deleteProject}>Delete Project</button>
      </div>
    }
    else if (this.state.projectAttrs.show_contact) {
      return <a href={"mailto:" + this.state.projectAttrs.email} className="blue-button" id="edit"> Contact Project Owner</a>
    }
  }

  getInfo = () => {
    this.getUserSkills()
    this.getProjectSkills()
    this.getMembers()
    this.getUpdatedProject()
    this.getAllBuckets()
    this.getNetID()
    this.getAdmin()
  }


  editForm = () => {
    if (this.state.showEdit && (this.state.owner || this.state.admin)) {
      return <ProjectEdit 
        admin = {this.state.admin} 
        user={this.state.user} 
        // users={this.state.users} 
        buckets={this.state.projectbuckets} 
        noProjectSkills={this.state.noProjectSkills}
        noUserSkills={this.state.noUserSkills}
        projectAttrs={this.state.projectAttrs} 
        project_picture={this.state.project_picture} 
        members = {this.state.members} 
        getUpdatedProject={this.getUpdatedProject} 
        allBuckets = {this.state.allBuckets} 
        toggleEdit={this.toggleEdit} 
        getProjects = {this.props.getProjects}
        getUserSkills = {this.getUserSkills}
        getProjectSkills = {this.getProjectSkills}
        isCreate = {this.state.isCreate}
        getInfo = {this.getInfo}
      />
    }
  }

  toggleEdit = (clear) =>{
    this.setState({showEdit: !this.state.showEdit})
    if (clear === true) {
      this.props.clearSelectedProject()
    }
  }

  deleteProject = () => {
    if(window.confirm("Are you sure you want to DELETE this project?")){
      let self = this
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + this.state.projectAttrs.id 
      axios.delete(url, {
        headers: {
        'content-type': 'multipart/form-data'
        }
      })
      .then(function (response){
        self.setState({response_title: "Successfully Deleted Project", response_code: response.status, response_msg: response.data.message})
        window.location.href = "/projects";
      })
      .catch(function (error){  
        let errorMsg = "An unexpected error has ocurred. If this is persists please contact the oit service desk. Please provide them with this timestamp: " + Date.now();
        console.log("ERROR on submit")
        self.setState({response_title: "Unexpected Error", response_code: 500, response_msg: errorMsg})
        logErrors(error)
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


  getUpdatedProject = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + self.state.projectAttrs.id
    axios.get(url)
      .then(function (response) {
        self.setState({ projectAttrs: response.data.data, project_picture: response.data.picture })
      })
      .catch(function (error) {
        logErrors(error);
      });
  }

  getUserSkills = () => {
    if (this.state.projectAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/userskills/" + self.state.projectAttrs.id 
      axios.get(url).then(function (response) {
        self.setState({userbuckets: response.data.data, noUserSkills: response.data.no_skills})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  userskills = () =>{
    if(!this.state.hideUserSkills){
      if(this.state.noUserSkills){
        return <div className='floatcard tile is-child'>
          <h4 className='card-header'>No Skills Added</h4>
        </div>
      }else if(this.state.userbuckets && this.state.userbuckets.length > 0){
        return this.mapUserSkills()
      }
    }
  }

  mapUserSkills = () => {
    return this.state.userbuckets.map((bucket, index) => <SkillCard skill_bucket={bucket} key={index}/>)
  }

  getProjectSkills = () => {
    if (this.state.projectAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/skills/" + self.state.projectAttrs.id 
      axios.get(url).then(function (response) {
        self.setState({projectbuckets: response.data.data, noProjectSkills: response.data.no_skills})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  projectskills = () =>{
    if(!this.state.hideProjectSkills){
      if(this.state.noProjectSkills){
        return <div className='floatcard tile is-child'>
          <h4 className='card-header'>No Skills Added</h4>
        </div>
      }else if(this.state.projectbuckets && this.state.projectbuckets.length > 0){
        return this.mapProjectSkills()
      }
    }
  }

  mapProjectSkills = () => {
    return this.state.projectbuckets.map((bucket, index) => <SkillCard skill_bucket={bucket} key={index}/>)
  }

  getMembers = () => {
    if (this.state.projectAttrs){
      let self = this;
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/members/" + self.state.projectAttrs.id 
      axios.get(url).then(function (response) {
        self.setState({members: response.data.data})
      })
      .catch(function (error) {
        logErrors(error);
      });
    }
  }

  members = () =>{
    if(!this.state.hideCollaborators){
      if(this.state.members && this.state.members.length > 0){
        return this.mapProjectMembers()
      }else{
        return <div className='floatcard tile is-child'>
        <h4 className='card-header'>No Collaborators</h4>
      </div>
      }
    }  
  }

  mapProjectMembers = () => {
    return <Membership members={this.state.members} selectMember = {this.selectMember} />
  }


  toggleInfo = () =>{
    this.setState({hideInfo: !this.state.hideInfo})
  }

  toggleUserSkills = () =>{
    this.setState({hideUserSkills: !this.state.hideUserSkills})
  }

  toggleProjectSkills = () =>{
    this.setState({hideProjectSkills: !this.state.hideProjectSkills})
  }

  toggleCollaborators = () =>{
    this.setState({hideCollaborators: !this.state.hideCollaborators})
  }

  displayMember = () => {
    if (this.state.selectedMember && this.showEdit !== true) {
      return <UserShow user = {this.state.selectedMember}/>
    }
  }

  selectMember = (memberId) => {
    let members = this.state.members
    members.forEach((member) => {
      if(member[0].attributes.id === memberId){
        this.setState({selectedMember: member[0]})
        return null
      }
    });
  }

  redirectto = () => {
    window.location.href = "/projects"
  }


  render = () => {
    return(
      <div>        
        {this.displayProject()}
        {this.editForm()}
        {this.displayMember()}
      </div>
    )
  }
}

export default ProjectShow 