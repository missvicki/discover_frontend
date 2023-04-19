import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

class ProjectUniversalSearchCard extends Component {
    constructor(props){
        super()
        this.state = {
            projectIcons: [Discover1, Discover2, Discover3, Discover4, Discover5, 
                Discover6, Discover7, Discover8, Discover9, Discover10],
        }
    }

    displayLogo = (project) => {
    if(project.logo_file_name){
        return <img className="project-logo" src={project.logo_file_name} alt="Project Logo"/>
    }else{
        let icon = this.state.projectIcons[project.id%10];
        return <img className='project-logo' src={icon} alt="default icon"></img>
    }
    }

    availability = (availability) => {
        if(availability){
          return <p className="bottom"><FontAwesomeIcon className="green" icon="circle" /> Open to new collaborators</p>
        }
        return <p className="bottom"><FontAwesomeIcon className="red" icon="circle" /> Not open to new collaborators</p>
    } 

    render = () => {
        return(
            <div className="block link" onClick={this.props.selectProject.bind(this, this.props.project)}>
                {this.displayLogo(this.props.project.attributes)}
                <div className="floatcard fixed-universal project-universal projectedit">
                    <h4 className="card-header-blue link"><abbr className="project-name-universal" title={this.props.project.attributes.name}>{this.props.project.attributes.name}</abbr></h4>
                    <p className="description-universal">{this.props.project.attributes.description}</p>
                    {this.availability(this.props.project.attributes.availability)} 
                </div>
            </div>
        )
    }
}
    
export default ProjectUniversalSearchCard