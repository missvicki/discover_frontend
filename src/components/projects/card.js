import React, {Component} from 'react';
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

class ProjectCard extends Component {
  constructor(props){
    super()
    this.state = {
      projectIcons: [Discover1, Discover2, Discover3, Discover4, Discover5, 
      Discover6, Discover7, Discover8, Discover9, Discover10],
    }
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
    
  displayOwner = (project, picture, index) => {
    return <div key={index}>
      <div className="floatcard project" onClick={() => this.props.selectProject(project.id)} >
      {this.projectPicture(picture, project.id)}
        <h4 className="card-header-blue link"><abbr className="project-name-universal" title={project.name}> {project.name}</abbr></h4>
        <p className="description-gray">{project.description}</p>
      </div>
    </div>
  }

  displayMember = (project, picture, index) => {
    return <div key={index}>
      <div className="floatcard project" onClick={() => this.props.selectProject(project.id)}>
        {this.projectPicture(picture, project.id)}
        <h4 className="card-header-blue link"><abbr className="project-name" title={project.name}> {project.name}</abbr></h4>
        <p className="description-gray">{project.description}</p>
      </div>
    </div>
  }

  mapOwners = (projects) => {
    const owner = projects.filter((project) => project.memberships.filter((membership) => membership.user_id === this.props.user_id)[0].owner)
    if(owner && owner.length>0){
      return (
        owner.map((project, index) =>this.displayOwner(project.attributes, project.picture, index))
      )
    }
    return <p>No projects</p>
  }

  mapMember = (projects) => {
    const member = projects.filter((project) => !project.memberships.filter((membership) => membership.user_id === this.props.user_id)[0].owner)
    if(member && member.length>0){
      return (
        member.map((project, index) =>this.displayMember(project.attributes, project.picture, index))
      )
    }
    return <p>No projects</p>
  }

  render(){
    return(
      <div className='floatcard tile is-child'>
        <h4 className='card-header'>Project Owner</h4>
        <div className="block">
          {this.mapOwners(this.props.projects)}
        </div>
        <h4 className='card-header'>Project Member</h4>
        <div className="block">
          {this.mapMember(this.props.projects)}
        </div>
      </div>
    )
  }
}
export default ProjectCard