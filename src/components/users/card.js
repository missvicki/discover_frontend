import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon1 from '../../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../../assets/images/ProfileIcons/Icon4.png';

class UserCard extends Component {
  constructor(props) {
    super()
    this.state = {
      profileIcons: [Icon1, Icon2, Icon3, Icon4],
    }
  }

  showImage = (picture, id) => {
    if(picture){
      return <img src={picture} alt="Smiley face" className="people-image-index" />
    }
    else {
      let icon = this.state.profileIcons[id%4];
      return  <img className="people-image-index" src={icon} alt="Default profile icon"></img>
    }
  }

  availability = (mem) => {
    if(this.state){
      if(mem.availability){
        return <p className="bottom"><FontAwesomeIcon className="green" icon="circle" /> Available to join projects.</p>
      }
      return <p className="bottom"><FontAwesomeIcon className="red" icon="circle" /> Not available to join projects.</p>
   
    }
  }

  render() {
    let user = this.props.user
    let fixed = "fixed";
    let username = "username";
    if(this.props.home){
      fixed = "fixed-home";
      username = "username-home";
    }
    if(user){
      return <div key={this.props.index}>
      <div onClick={this.props.selectUser.bind(this, user)} className={"floatcard people clickable " + fixed}>
        {this.showImage(user.picture, user.attributes.id)}
        <h4 className={'card-header-blue link '+username}>
          <abbr title={user.attributes.full_name}>{user.attributes.full_name}</abbr>
        </h4>
        <p className="description bio">{user.attributes.bio}</p>
        {this.availability(user.attributes)}

      </div>
    </div>
    } return <div></div>
  }
}
export default UserCard