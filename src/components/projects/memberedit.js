import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './modal.js';
import axios from 'axios';
import { logErrors } from '../../helpers';
import Icon1 from '../../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../../assets/images/ProfileIcons/Icon4.png';

class MemberEdit extends Component {
  constructor(props) {
    super()
    this.state = props.props;
    this.state.profileIcons = [Icon1, Icon2, Icon3, Icon4];
    this.state.searchValue = "";
    this.state.hideMembers = false;
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal2 = this.showModal2.bind(this);
    this.state.hideMembers = false;
  }

  getUsers = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/index_page/25/1"
      axios.get(url).then(function (response) {
        self.setState({users: response.data.data})
      })
      .catch(function (error) {
        logErrors(error);
      });
  }

  peopleSearch = async(event)  => {
    await this.setState({
      searchValue: event.target.value
    }) 
    if (this.state.searchValue === "") {
      this.getUsers();
    }
    else {

      this.getSearched();
    }
  }

  toggleMembers = () =>{
    this.setState({hideMembers: !this.state.hideMembers})
  }

  getSearched = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/user_search/" + self.state.searchValue
    axios.get(url).then(function (response) {
      self.setState({users: response.data.peopleResults});
    })
    .catch(function (error) {
      logErrors(error);
    });
  } 

  showModal = (owner) => {
    this.setState({ show: true, owner: true, memberdel: false, modalText: "Click on a name to add as a project owner (can edit projects)" });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  showModal2 = () => {
    this.setState({ show: true, owner: false, memberdel: false, modalText: "Click on a name to add as a project member" });
  };

  showModaldel = () => {
    this.setState({ show: true, owner: false, memberdel: true, modalText: "Click on a name to remove from project" });
  };


  showuserImage = (picture, id) => {
    if(picture){
      return <img src={picture} alt="Smiley face" className="people-image-index" />
    }
    else {
      let icon = this.state.profileIcons[id%4];
      return  <img className="people-image-index" src={icon} alt="Default profile icon"></img>
    }
  }

  useravailability = (mem) => {
      if(mem.availability){
        return <p className="bottom"><FontAwesomeIcon className="green" icon="circle" /> Available to join projects.</p>
      }
      return <p className="bottom"><FontAwesomeIcon className="red" icon="circle" /> Not available to join projects.</p>
  }

  membericon = (user) => {
    if (user.icon) {
      return <FontAwesomeIcon className="blue membericonscheck fa-lg" icon={user.icon} />
    }
  }

  mapUsersModal = () => {
    var array = this.state.members.map(function(x) {
      return x[0].attributes.netid;
    });
    let users = this.state.users
    users.forEach((user) => {
      if (array.indexOf(user.attributes.netid) !== -1) {
        user.color = " addedmember"
        user.icon = "check-circle"
      }
    })
    let userRows = users.map((user, index) => 
      <div key={index}>
          <div className={"floatcard project projectedit " + user.color} onClick= {(e) => this.props.changeHandler(user, this.state.owner, this.state.memberdel)}> {this.membericon(user)}
            {this.showuserImage(user.picture, user.attributes.id)}
            <h4 className='card-header-blue link' >
              {user.attributes.full_name}
            </h4>
            <p className="description-modal">{user.attributes.bio}</p>
            {this.useravailability(user.attributes)}

          </div>
      </div>
    )
    if (users.length>0){
      return <div>{userRows}</div>
    } 
    return <div> 
      no users
    </div>
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
      if(mem.attributes.availability){
        return <p className="no-below bottom"><FontAwesomeIcon className="green" icon="circle" /> Available to join projects.</p>
      }
      return <p className="no-below bottom"><FontAwesomeIcon className="red" icon="circle" /> Not available to join projects.</p>
  }

  displayOwner = (mem, index) => {
    if (mem[1]) {
      return <div key={index}>
      <div className="block">   
        {this.showImage(mem[0].picture, mem[0].attributes.id)}
        <div className="floatcard project" ><FontAwesomeIcon className="blue membericons fa-lg" icon="trash-alt" onClick= {(e) => this.props.changeHandler(mem[0], this.state.owner, true)}/>
          <h3 className= "card-header-blue">
              {mem[0].attributes.full_name}
          </h3>
          <p className="description-gray">{mem[0].attributes.bio}</p>
          {this.availability(mem[0])}
        </div>
      </div>
    </div>
    }
  }

  displayMember = (mem, index) => {
    if (!mem[1]) {
      return <div key={index}>
      <div className="block">   
        {this.showImage(mem[0].picture, mem[0].attributes.id)}
        <div className="floatcard project"> <FontAwesomeIcon className="blue membericons fa-lg" icon="trash-alt" onClick= {(e) => this.props.changeHandler(mem[0], this.state.owner, true)}/>
          <h3 className= "card-header-blue">
              {mem[0].attributes.full_name}
          </h3>
          <p className="description-gray">{mem[0].attributes.bio}</p>
          {this.availability(mem[0])}
        </div>
      </div>
    </div>
    }
  }

  members = () => {
    if (!this.state.hideMembers) {
      return <div>
              <div className="floatcard members" id="member">
          <h4 className="card-header"> Project Owners </h4>
          
            {this.state.members.map((member, index) =>
                this.displayOwner(member, index)
            )}
      </div>
      <Modal show={this.state.show} handleClose={this.hideModal} searchValue = {this.state.searchValue} peopleSearch = {this.peopleSearch} modalText={this.state.modalText}>
          {this.mapUsersModal()}
      </Modal>
      <div className="buttons are-small edit-group">
        <button className="button is-success is-light" type="button" onClick={this.showModal}>
          Add Owner
        </button>
      </div>

      <div className="floatcard members">
        <h4 className="card-header"> Project Members </h4>
          {this.state.members.map((member, index) =>
            this.displayMember(member, index)
          )}
      </div>
      <div className="buttons are-small edit-group">
        <button className="button is-success is-light" type="button" onClick={this.showModal2}>
          Add Member
        </button>
      </div>
      </div>
    }
  }

  render(){
    return <div className="is-child is-vertical">
      <h3 className='section-header link' onClick={this.toggleMembers}> Collaborators <FontAwesomeIcon icon="angle-down" className="down"/></h3> 
      {this.members()}
    </div>
  }
}
export default MemberEdit