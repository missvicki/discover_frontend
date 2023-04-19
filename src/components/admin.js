import React, {Component} from 'react';
import Header from "./header"
import '../assets/css/index.css';
import '../assets/css/header.css';
import {logErrors} from '../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from './projects/modal.js';
import Icon1 from '../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../assets/images/ProfileIcons/Icon4.png';

const axios = require('axios');

class AdminIndex extends Component {
  constructor(props){
    super()
    this.state = {
      searchResults: false, 
      selectedProject: false, 
      selectedUser: false,
      admins: null, 
      searchValue: null, 
      users: null,
      profileIcons: [Icon1, Icon2, Icon3, Icon4],
    }
    this.state.searchValue = ""
    this.state.hideMembers = false;
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.state.hideMembers = false;
    this.searchRef = React.createRef();
  }

  componentDidMount = () =>{
    this.getAdmins()
    this.getUsers()
    this.getNetID()
  }

  getAdmins = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/admin"
      axios.get(url).then(function (response) {
        self.setState({admins: response.data.data})
      })
      .catch(function (error) {
        logErrors(error);
      });
  }

  getUsers = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users"
      axios.get(url).then(function (response) {
        self.setState({users: response.data.data})
      })
      .catch(function (error) {
        logErrors(error);
      });
  }
  
  selectUser = (user) => {
    this.setState({selectedUser: user})
    this.props.history.replace({ pathname: `/people/${user.attributes.netid}`})
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

  memberChangeHandler = (user, del) => {
    const arr = this.state.admins
    var array = this.state.admins.map(function(x) {
      return x.attributes.netid;
    });
    if (!del) {
      if (array.indexOf(user.attributes.netid) === -1) {
        arr.push(user)
        this.setState({admins: arr})
        user.color = " addedmember"
      }
      this.saveAdmins(user.attributes.netid)
    }
    else {
      if (user.attributes.netid === this.state.netid) {
        const confirm = window.confirm("Are you sure you want to remove your admin access? Your authorization will be revoked.")
        if (!confirm) {
          return
        }
      }
      if (array.indexOf(user.attributes.netid) !== -1) {
        arr.splice(array.indexOf(user.attributes.netid), 1)
        this.setState({admins: arr})
        user.color = " removedmember"
      }
      this.removeAdmins(user.attributes.netid)
    }
    
  }
  
  saveAdmins = (user) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/update_admin/" + user
    axios.put(url, {
      headers: {
      'content-type': 'multipart/form-data'
    }
    })
  }

  removeAdmins = (user) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/remove_admin/" + user
    axios.put(url, {
      headers: {
      'content-type': 'multipart/form-data'
    }
    })
  }

  displayNoResults = () => {
    return <div className="floatcard"> No matches found </div>
  }

  displayAdmin = (mem, index) => {
    if (mem) {
      return <div key={index} className="column is-12-tablet is-6-desktop">
        {this.showImage(mem.picture, mem.attributes.id)}
        <div className="floatcard project fixed-universal" ><FontAwesomeIcon className="blue membericons fa-lg" icon="trash-alt" onClick= {(e) => this.memberChangeHandler(mem, true)}/>
          <h3 className= "card-header-blue">
              {mem.attributes.full_name}
          </h3>
          <p className="description-gray">{mem.attributes.bio}</p>
          {this.availability(mem)}
        </div>

    </div>
    }
  }

  mapAdmins = () => {
    let allAdmin = this.state.admins
    if(allAdmin != null){
      let userRows = allAdmin.map((user, index) => this.displayAdmin(user, index))
     
      if (allAdmin.length>0){
        return <div>              
          <div className="columns is-multiline is-variable">{userRows}</div> 
          <Modal show={this.state.show} handleClose={this.hideModal} searchValue = {this.state.searchValue} peopleSearch = {this.peopleSearch} >
                    <p className="label modaltext"> {this.state.modalText}</p>
                    {this.mapUsersModal()} 
          </Modal> 
        </div>
        
      } 
      return this.displayNoResults()  
    }
  }

 
  showModal = (owner) => {
    this.setState({ show: true, owner: true, memberdel: false, modalText: "Click on a name to add as an admin (can edit all projects)" });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

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

  mapUsersModal = () => {
    
    let users = this.state.users
    if(users){
      var array = this.state.admins.map(function(x) {
        return x.attributes.netid;
      });
      users.forEach((user) => {
        if (array.indexOf(user.attributes.netid) !== -1) {
          user.color = " addedmember"
          user.icon = "check-circle"
        }
      })
      
      let userRows = this.state.users.map((user, index) => 
      <div key={index}>
          {this.showImage(user.picture, user.attributes.id)}
          <div className="floatcard project projectedit " onClick= {(e) => this.memberChangeHandler(user, false)}> <FontAwesomeIcon className="blue membericonscheck fa-lg" icon={user.icon} />
            <h4 className='card-header-blue link' >
              {user.attributes.full_name}
            </h4>
            <p className="description-modal">{user.attributes.bio}</p>
            {this.availability(user)} 

          </div>
      </div>
      )
      if (this.state.users.length>0){
        return <div>{userRows}</div>
      } 
      return <div> 
        no users
      </div> 
      }
    
    
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

  render = () => {
    let netid = this.state.netid
    let admin = false
    if (this.state.admins) {
    this.state.admins.forEach(function(x) {
        if (x.attributes.netid === netid) {
          admin  = x.attributes.admin
        }
      });
    }
    if(admin){
     return(
      <div className='about-background'>
        <Header/>
        <div className="display-about container admin-page">
            <h1 className='subtitle-big'>Admin </h1>
            <div className="buttons are-small edit-group">
              <button className="button is-yellow-outline full-30" type="button" onClick={this.showModal}>
                Add Admin
              </button>
            </div>
            <div className='floatcard tile is-child'>
              {this.mapAdmins()}
            </div>
        </div>
      </div>
      );
 
    }
    else{
      return(
        <div className='about-background'>
          <Header/>
          <div className="display container">
            <h1 className='subtitle-big'>You are not authorized </h1>
           </div>
         </div>
        );
    }

  
    
  }
}

export default AdminIndex