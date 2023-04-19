import React, {Component} from 'react';
import {logErrors} from '../../helpers'
import UserShow from './show'
import Header from '../header'
import axios from 'axios';
import UserCard from './card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class UserIndex extends Component{ 
  constructor(props) {
    super()  
    this.state = {
      users: null, 
      filterSearchResults: null,
      selectedUser: false,
      allBuckets: null, 
      skills: [], 
      orSkills: [], 
      availability: false, 
      hideBucket: {"Design": false, "Physical Development": false, "Web/Mobile Development": false, "Management": false, "Business Development": false, "Programming":false},
      checkBucket: {"Design": false, "Physical Development": false, "Web/Mobile Development": false, "Management": false, "Business Development": false, "Programming":false},
      isTablet: false, 
      currentPage: 1,
      totalPages: 0, 
      pageLimit: 25,
      searchValue: "",
      min_time: 0,
      max_time: 40
    }

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  //component functions
  componentDidMount = () => {
    let netid = this.getNetidParam()
    this.getUsers(netid)
    this.getAllBuckets()
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updatePredicate);
  }

  // set up functions
  getNetidParam = () =>{
    if (this.props.netid) {
      return this.props.netid
    } else{
      return null
    }
  }

  updatePredicate = () => {
    this.setState({ isTablet: window.innerWidth > 980 });
  }

  getUsers = (netid) => {
    var self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/index_page/" + self.state.pageLimit + "/" + self.state.currentPage;
    axios.get(url)
      .then(function (response) {
        self.setState({
          users: response.data.data,
          totalPages: response.data.total_pages
        });
        if(netid){
          self.selectUserFromParam(netid);
        } 
      })
      .catch(function (error) {
        logErrors(error);
      })
  }

  selectUserFromParam = (netid) => {
    var self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/current_user/"+ netid;
    axios.get(url)
      .then(function (response) {
        self.setState({selectedUser: response.data});
      })
      .catch(function(error) {
        logErrors(error);
      })
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

  //RENDER FUNCTIONS
  //clear selection
  clearSelectedUser = () => {
    this.setState({selectedUser: false})
  }

  //individual user page
  drawUser = () => {
    if(this.state.selectedUser){
      return <div>
        <UserShow user={this.state.selectedUser} getUsers={this.getUsers}/>
      </div>
    }
  }


  //display search profiles page
  drawUsers = () => {
    if(this.state.users && !this.state.selectedUser){
      if(this.state.isTablet){
        return <div>
          <h1 className='subtitle-big'> Find People</h1>
          <div className="columns is-variable is-centered"> 
            <div className="column is-12-mobile is-7-tablet is-7-desktop right-space" >
              {this.displayResults()}
            </div>
            <div className="column is-12-mobile is-4-desktop left-space">
            <div className="lower full">
              <p className='section-sub-header centered'>Search People</p>
              {this.searchBar()}
              <div className="lower">
                {this.displayFilterSearch()}
              </div>
            </div>
            
            </div>
          </div>
        </div>
      }
      return <div className="display">
          <p className='section-sub-header centered'>Search People</p>
          {this.searchBar()}
          <div className= "columns is-mobile is-multiline is-variable is-8"> 
            <div className="column is-12">
              {this.displayFilterSearch()}
            </div>
            <div className="column is-12" >
              <h1 className='subtitle-big'> Find People</h1>
              {this.displayResults()}
            </div>
          </div>
        </div>
    }
  }
  
  //create user
  createUser = (netid) => {
    let self = this
    let full_name = localStorage.getItem("full_name")
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/create_user/" + netid + "/full_name/" + full_name
    axios.post(url).then(function (response) {
      self.setState({selectedUser: response.data});
    })
    .catch(function (error) {
      logErrors(error);
    });  
  
  }

  //search bar
  searchBar = () => {
    return <div className='field has-addons'>
      <div className="control is-expanded">
        <input className='search-bar input' placeholder="search people by name or netID" value={this.searchValue} onKeyPress={this.handleKeyPress} onChange={this.peopleSearchOnChange} type="text" />
      </div>
      <div className="control">
        <button className="button is-yellow" onClick={this.submitForm}><FontAwesomeIcon icon="search" /></button>
      </div>
    </div>
  }

  // searchBar helper functions
  handleKeyPress = (event) => {
    if(event.key === "Enter"){
      this.setState({
        searchValue: event.target.value
      })
      this.submitForm()
    }
  }

  peopleSearchOnChange = (event) => {
    this.setState({
      searchValue: event.target.value
    })
  }

  submitForm = () => {
    this.filterSearch();
  }

  filterSearch = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/filter_search/users"
    
    let andSelectedSkills = self.state.skills;
    let orSelectedSkills = self.state.orSkills
    let jsonAndSkills = JSON.stringify(andSelectedSkills);
    let jsonOrSkills = JSON.stringify(orSelectedSkills);
    
    let searchValue = self.state.searchValue;
    let availability = self.state.availability;
    let min_time = self.state.min_time;
    let max_time = self.state.max_time;
    
    // check if clearing filter works
    if(andSelectedSkills.length===0 && orSelectedSkills.length===0 && searchValue === "" && !availability && min_time===0 && max_time===40){
      this.setState({filterSearchResults: null});
      this.getUsers();
    }else{
      axios.get(url, {
        params: {
          page_number: self.state.currentPage,
          page_limit: self.state.pageLimit,
          searchValue: searchValue,
          availability: availability,
          min_time: min_time,
          max_time: max_time,
          andSkills: jsonAndSkills,
          orSkills: jsonOrSkills
        }
      }).then(function (response) {
        self.setState({
          filterSearchResults: response.data.data, 
          totalPages: response.data.total_pages
        });
      }).catch(function (error) {
        logErrors(error);
      });
    }
  }

  //display users
  
  displayResults = () => {
    let filterSearchResults = this.state.filterSearchResults
    if(filterSearchResults){
      return this.mapUsers(filterSearchResults)
    }else{
      return this.mapUsers(this.state.users)
    } 

  }

  displayNoResults = () => {
    return <div className="floatcard"> No matches found </div>
  }

  // display results helper functions
  mapUsers = (currUsers) => {
    let userRows = currUsers.map((user, index) => <div className="column is-12-mobile is-6-tablet"><UserCard user = {user} selectUser = {this.selectUser} key={index}> </UserCard></div>)
    if (currUsers.length>0){
      return <div>              
        <div className="columns is-multiline is-centered-mobile is-variable">{userRows}</div>
        {this.pagination()}
      </div>
    } 
    return this.displayNoResults()
  }

  selectUser = (user) => {
    this.setState({selectedUser: user})
    window.history.replaceState(null, "peopleshow", `/people/${user.attributes.netid}`)
  }

  showImage = (user) => {
    if(user.picture){
      return <img src={user.picture} alt="Smiley face" height="42" width="42" />
    }
    
  }

  mapNeededSkills = (skills) => {
    return skills.map((skill, index) => 
        <li className='item gray-text' key={index}>{skill.name}</li>
      )
  }

  //pagination
  pagination = () => {
    return <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
      <FontAwesomeIcon className="pagination-previous is-yellow" onClick={this.onPrevious} icon="angle-double-left"/>
      <FontAwesomeIcon className="pagination-next is-yellow" onClick={this.onNext} icon="angle-double-right"/>
      <p className="pagination-list info"> Page {this.state.currentPage} of {this.state.totalPages}</p>
    </nav>
  }

  onNext = async () => {
    await this.setState({currentPage: Math.min(this.state.currentPage+1, this.state.totalPages)})
    if(this.state.filterSearchResults){
      this.filterSearch();
    }else{
      this.getUsers();
    }
  }

  onPrevious = async () => {
    await this.setState({currentPage: Math.max(this.state.currentPage-1, 1)});
    if(this.state.filterSearchResults){
      this.filterSearch();
    }else{
      this.getUsers();
    }
  }

  //display filter search
  displayFilterSearch = () => {
    return <div>
      <h4 className='section-sub-header centered'>
        Filter Search
      </h4>
      <div className="floatcard"> 
        <h4 className='card-header-small'>
          <span className="icon-smaller"> <FontAwesomeIcon onClick={this.toggleEdit}  icon={['far', 'dot-circle']}/></span>
          Availabilty
        </h4>
        <label className="checkbox text-small">
          <input type="checkbox" className="box-right" name="avail" onChange={this.changeHandler}/>
          Only people available to join projects
        </label>

        <p></p>
        <h4 className='card-header-small'>
        <span className="icon-smaller"><FontAwesomeIcon className="yellow" icon="clock" /></span>
        Time commitment
        </h4>
        <div className="field">
        <section className="control range-slider small">
          <span className="rangeValues"></span>
          {this.sliderval()}
          {this.sliders()}
        </section>
        </div>
      </div>
      <div className=""> 
        {this.state.allBuckets.map((bucket, index) => this.displayBucket(bucket, index))}
      </div>
    </div>
  }

  sliderval = () => {
    if (Number(this.state.max_time) < Number(this.state.min_time)) {
      return <div>
            <label className="checkbox text-small">{this.state.max_time} to {this.state.min_time} hours per week</label>
      </div>
    }
    else {
      return <div> 
        <label className="checkbox text-small">{this.state.min_time} to {this.state.max_time} hours per week</label>
      </div>
    }

  }
  sliders = () => {
    if (Number(this.state.max_time) < Number(this.state.min_time)) {
      return <div>
            <input className="range" name="min_time" type="range" defaultValue={this.state.max_time} placeholder={this.state.max_time} onChange={this.changeHandler} min="0" max="40" step="1"/>
            <input className="range" name="max_time" type="range" defaultValue={this.state.min_time} placeholder={this.state.min_time} onChange={this.changeHandler} min="0" max="40" step="1"/>
      </div>
    }
    else {
      return <div> 
            <input className="range" name="min_time" type="range" defaultValue={this.state.min_time} placeholder={this.state.min_time} onChange={this.changeHandler} min="0" max="40" step="1"/>
            <input className="range" name="max_time" type="range" defaultValue={this.state.max_time} placeholder={this.state.max_time} onChange={this.changeHandler} min="0" max="40" step="1"/>
      </div>
    }
  }

  changeSync = (event) => {
    if (event.target.checked) {
      const name = event.target.name;
      if (name === "avail") {
        this.setState({
          availability: true
        }); 
      }
      else {
        const value = event.target.value;
        let arr = this.state.skills
        arr.push(value)
        this.setState({
          skills: arr
        }); 
      }
    }
    else {
      const name = event.target.name;
      if (name === "avail") {
        this.setState({
          availability: false
        }); 
      }
      else if (name === "min_time" )  {
        const value = event.target.value;
        this.setState({
          [name]: value
        }); 
      }
      else if (name === "max_time" )  {
        const value = event.target.value;
        this.setState({
          [name]: value
        }); 
      }
      else {
        const value = event.target.value;
        let arr = this.state.skills
        const index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          skills: arr
        }); 
      }
    }

  }

  changeHandler = async(event) => {
    await this.changeSync(event)
    this.filterSearch()
  }

  bucketcheckbox = (index, bucketname) => {
    if (this.state.checkBucket[bucketname]) {
      return <input className="chbx-align" type="checkbox" name={bucketname} id={index} key={index} onChange={this.bucketChangeHandler} checked/>
    }
    else {
      return <input className="chbx-align" type="checkbox" name={bucketname}  id={index} key={index} onChange={this.bucketChangeHandler}/>
    }
  }

  displayBucket = (bucket, index) => {
    if (this.state.hideBucket[bucket.name]) {
      return <div>
        <div className='floatcard skill-card' >
          <div className="inline">
          {this.bucketcheckbox(index, bucket.name)}
             <h4 className='card-header-small link-gray' onClick={this.toggleBucket.bind(this, bucket.name)}>
              {this.displayIcon(bucket.logo)} 
              <span className="name">{bucket.name}</span>
              
            </h4> 
          </div>
          <FontAwesomeIcon  icon="angle-down" className="skill-card-down link-gray"  onClick={this.toggleBucket.bind(this, bucket.name)}/>
          <ul className='list'>
            {this.mapSkills(bucket.skills, index, bucket.name)}
          </ul>
        </div>
      </div>
    }
    else {
      return  <div key={index}>
        <div className='floatcard filter-fixed skill-card' >
          <div className="inline">
              {this.bucketcheckbox(index, bucket.name)}            
              <h4 className='card-header-small' onClick={this.toggleBucket.bind(this, bucket.name)}>
              {this.displayIcon(bucket.logo)} 
              <span className="name">{bucket.name}</span>
            </h4> 
          </div>
          <FontAwesomeIcon  icon="angle-down" className="link-gray skill-card-down" onClick={this.toggleBucket.bind(this, bucket.name)}/>
        </div>
      </div>
    }
  }

  bucketChangeHandler = (event) => {
    const index = event.target.id
    const bucketname = event.target.name
    var bucket = this.state.checkBucket
    if (event.target.checked) {
      bucket[bucketname] = true
      this.setState({
        checkBucket: bucket
      })
      const arr = this.state.orSkills
      this.state.allBuckets[index].skills.forEach((skill) => {
        if (!arr.includes(skill.name)) {
          arr.push(skill.name)
        }
      })
      this.setState({
        orSkills: arr
      })
    }
    else {
      bucket[bucketname] = false
      this.setState({
        checkBucket: bucket
      })
      const arr = this.state.orSkills
      const arr2 = this.state.skills
      this.state.allBuckets[index].skills.forEach((skill) => {
        const idx = arr.indexOf(skill.name);
        if (idx > -1) {
          arr.splice(idx, 1);
        }
        const idx2 = arr2.indexOf(skill.name);
        if (idx2 > -1) {
          arr2.splice(idx2, 1);
        }
      })
      this.setState({
        orSkills: arr,
        skills: arr2
      })
    }
    this.filterSearch();
  }

  toggleBucket = (bucketname) => {
    var bucket = this.state.hideBucket
    bucket[bucketname] = ! bucket[bucketname]
    this.setState({
      hideBucket: bucket
    })
  }

  displayIcon = (icon) => {
    return <span className="icon-smaller"> <FontAwesomeIcon onClick={this.toggleEdit}  icon={icon} /></span>  
  }

  skillsList = (skills, index) => {
    return <ul className='list' key = {index}>
    {this.mapSkills(skills, index)}
    </ul>
  }

  mapSkills = (skills, index, bucketname) => {
    return skills.map((allSkill) =>
    <label className="checkbox item-smaller">
      {this.displayCheckbox(allSkill, index, bucketname)}
      <span className="skill-name">{allSkill.name}</span>
    </label>)
  }

  displayCheckbox = (allSkill, index, bucketname) => { 
    if (this.state.checkBucket[bucketname]) {
      return <input className="box-right" type="checkbox"  name="skills" value={allSkill.name} onChange={this.changeHandler} checked/> 
    }  
    return <input className="box-right" type="checkbox"  name="skills" value={allSkill.name} onChange={this.changeHandler}/> 
  }

  render = () => {
    return(
      <div className = "about-background">
        <Header clearSelectedUser={this.clearSelectedUser} selectUserFromParam={this.selectUserFromParam}/>
          <div className='display container people'>
            {this.drawUser()}
            {this.drawUsers()}
          </div>
      </div>
    );
  }
}

export default UserIndex;