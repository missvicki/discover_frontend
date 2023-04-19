import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon1 from '../../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../../assets/images/ProfileIcons/Icon4.png';

class UserUniversalSearchCard extends Component {
  constructor(props) {
    super()
    this.state = {
      selectedUser: false,
      profileIcons: [Icon1, Icon2, Icon3, Icon4],
    }
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
      if(mem.availability){
        return <p className="bottom"><FontAwesomeIcon className="green" icon="circle" /> Available to join projects.</p>
      }
      return <p className="bottom"><FontAwesomeIcon className="red" icon="circle" /> Not available to join projects.</p>
  }

  render() {
    let user = this.props.user
    if(user){
      return <div className="link" onClick={this.props.selectUser.bind(this, user)}>
        {this.showImage(user.picture, user.attributes.id)}
        <div className="floatcard fixed-universal people-universal projectedit">
          <h4 className='card-header-blue link'>
            {user.attributes.full_name}
          </h4>
          <p className="description-universal">{user.attributes.bio}</p>
          {this.availability(user.attributes)}
      </div>
    </div>
    } return <div></div>
  }
}
export default UserUniversalSearchCard
