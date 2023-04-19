import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon1 from '../../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../../assets/images/ProfileIcons/Icon4.png';

class Membership extends Component {
  constructor(props){
    super()
    this.state = {profileIcons: [Icon1, Icon2, Icon3, Icon4]};
  }

  showImage = (picture, id) => {
    if(picture){
      return <img src={picture} alt="Smiley face" className="people-image" />
    }
    else {
      let icon = this.state.profileIcons[id%4];
      return <img src={icon} alt="Default profile icon" className="people-image" />
    }
  }

  availability = (mem) => {
    if(!this.state){
      if(mem.attributes.availability){
        return <p className="no-below bottom"><FontAwesomeIcon className="green" icon="circle" /> Available to join projects.</p>
      }
      return <p className="no-below bottom"><FontAwesomeIcon className="red" icon="circle" /> Not available to join projects.</p>
   
    }
  }

  displayOwner = (mem, index) => {
    return <div key={index}>
      <div className="block" >   
        {this.showImage(mem[0].picture, mem[0].attributes.id)}
        <div className="floatcard project"  onClick={() => this.props.selectMember(mem[0].attributes.id)}>
          <h3 className= "card-header-blue" >
              {mem[0].attributes.full_name}
          </h3>
          <p className="description-gray">{mem[0].attributes.bio}</p>
          {this.availability(mem[0])}
        </div>
      </div>
    </div>
  }


  mapOwners = (members) => {
    const owner = members.filter((member) => member[1])
    if(owner && owner.length>0){
      return (
        owner.map((member, index) =>this.displayOwner(member, index))
      )
    }
    return <p>No owners</p>
  }

  mapMembers = (members) => {
    const member = members.filter((member) => !member[1])
    if(member && member.length>0){
      return (
        member.map((member, index) =>this.displayOwner(member, index))
      )
    }
    return <p>No members</p>
  }

  render = () => {
    return(
        <div className='floatcard tile is-child collaborators'>

        <h4 className='card-header'>Project Owners</h4>
        <div className="block">
          {this.mapOwners(this.props.members)}
        </div>

        <h4 className='card-header'>Project Members</h4>
        <div className="block">
          {this.mapMembers(this.props.members)}
        </div>
        </div>
      )
    }
}

export default Membership