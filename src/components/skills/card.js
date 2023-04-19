import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class SkillCard extends Component {
  constructor(props) {
    super()
  }

  mapSkills = (skills) => {
    return skills.map((skill, index) =>
    <li className="item" key={index}>
      {skill.name}
    </li>
    )
  }

  displayIcon = (icon) => {
      return <span className="icon"> <FontAwesomeIcon onClick={this.toggleEdit}  icon={icon} /></span>  
  }

  render = () => {
    let bucket = this.props.skill_bucket
    if(bucket.skills.length>0){
      return <div className='floatcard tile is-child'>
      <h4 className='card-header'>
        {this.displayIcon(bucket.logo)}
        {bucket.name}
      </h4>
      
      <ul className='list'>
        {this.mapSkills(bucket.skills)}
      </ul>
    </div>
    } return <div></div>
  }   
}
export default SkillCard