import React, {Component} from 'react'
import ProjectShow from './show'
import Header from '../header'
import {logErrors} from '../../helpers'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

class ProjectIndex extends Component {
  constructor(props) {
    super()  
    this.state = {
      projects: null, 
      filterSearchResults: null,
      selectedProject: null, 
      allBuckets: [], 
      skills: [], 
      orSkills: [], 
      avail: false, 
      grant: false,
      isCreate: false,
      hideBucket: {"Design": false, "Physical Development": false, "Web/Mobile Development": false, "Management": false, "Business Development": false, "Programming":false},
      checkBucket: {"Design": false, "Physical Development": false, "Web/Mobile Development": false, "Management": false, "Business Development": false, "Programming":false},
      isTablet:false,
      searchValue: "", 
      showEdit: false,
      currentPage: 1,
      numProjects: 0, 
      totalPages: 0, 
      pageLimit: 25,
      min_time: 0,
      max_time: 40,
      projectIcons: [Discover1, Discover2, Discover3, Discover4, Discover5, 
        Discover6, Discover7, Discover8, Discover9, Discover10],
    }

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  //component functions
  componentDidMount = () => {
    let projectId = this.getProjectIdParam()
    this.getProjects(projectId)
    this.getAllBuckets()
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updatePredicate);
  }

  // set up functions
  getProjectIdParam = () =>{
    if (this.props.id) {
        return this.props.id
    } else if (this.props.match) {
      return this.props.match.params.id
    }
    else {
      return null
    }
  }

  updatePredicate = () => {
    this.setState({ isTablet: window.innerWidth > 980 });
  }

  getProjects = (projectId) => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/index_page/" + self.state.pageLimit + "/" + self.state.currentPage;
    axios.get(url)
      .then(function (response) {
        self.setState({
          projects: response.data.data,
          totalPages: response.data.total_pages
        });
        if(projectId){
          self.selectProjectFromParam(projectId);
        } 
      })
      .catch(function (error) {
        logErrors(error);
      })
  }

  selectProjectFromParam = (projectId) => {
    var self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/current_project/"+ projectId;
    axios.get(url)
      .then(function (response) {
        self.setState({selectedProject: response.data});
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
  // clear selection
  clearSelectedProject = () => {
    this.setState({selectedProject: false})
  }

  //individual project page
  drawProject() {
    if (this.state.selectedProject) {
      return <ProjectShow project={this.state.selectedProject} isCreate = {this.state.isCreate} showEdit = {this.state.showEdit} getProjects = {this.getProjects} clearSelectedProject = {this.clearSelectedProject}/>
    }
  }

  //display search project page
  drawProjects = () => {
    if(this.state.projects && !this.state.selectedProject){
      if(this.state.isTablet){
        return <div>
          <h1 className='subtitle-big'>Find Projects</h1>
          <div className='columns is-centered is-variable is-8'>
            <div className='column is-12-mobile is-7-tablet is-7-desktop right-space'>
              {this.displayResults()}
            </div>
            <div className='column is-12-mobile is-3-tablet is-4-desktop left-space'>
              <button className="button is-yellow-outline full" onClick={this.createProject}> <span className="ellipsis"> Create a new project </span></button>
              <div className="lower full">
                <p className='section-sub-header centered'>Search Projects</p>
                {this.searchBar()}
                <div className="lower">
                  <p className='section-sub-header centered'>Filter Projects</p>
                  <div>
                    {this.displayGrant()}
                    {this.displayAvailability()} 
                    {this.displayFilterSearch()} 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      return <div className="display container">
          <div className='columns is-mobile is-multiline is-variable is-8'>
            <div className='column is-12'>
              <p className='section-sub-header centered'>Search Projects</p>
              {this.searchBar()}
              <p className='section-sub-header centered'>Filter Search</p>
              <div className='column is-12'>
                {this.displayGrant()}
                {this.displayAvailability()} 
                {this.displayFilterSearch()} 
              </div>
              <button className="button is-yellow-outline full-100 lower" onClick={this.createProject}>  Create a new project </button>
            </div>
            <h1 className='subtitle-big lower'>Find Projects</h1>
            <div className='column is-12'>
              {this.displayResults()}
            </div>
          </div>
        </div>
      }
  }

  //create project
  createProject = async() => {
    let self = this;
    let netid = localStorage.getItem("netid")
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + netid
    await axios.post(url).then(function (response) {
      self.setState({selectedProject: response.data.data[0], showEdit: true, isCreate: true});      
    })
    .catch(function (error) {
      logErrors(error);
    });  
    this.getProjects()
  }
  
  //search bar
  searchBar = () => {
    return <div className='field has-addons'>
      <div className="control is-expanded">
        <input className='search-bar input' placeholder="search projects" value={this.searchValue} onKeyPress={this.handleKeyPress} onChange={this.projectSearchOnChange} type="text" />
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

  projectSearchOnChange = (event) => {
    this.setState({
      searchValue: event.target.value
    })
  }

  submitForm = () => {
    this.filterSearch();
  }

  filterSearch = () => {
    let self = this;
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/filter_search/projects"
    
    let andSelectedSkills = self.state.skills;
    let orSelectedSkills = self.state.orSkills
    let jsonAndSkills = JSON.stringify(andSelectedSkills);
    let jsonOrSkills = JSON.stringify(orSelectedSkills);
    
    let searchValue = self.state.searchValue;
    let availability = self.state.availability;
    let min_time = self.state.min_time;
    let max_time = self.state.max_time;
    let grant = self.state.grant;
    
    // check if clearing filter works
    if(andSelectedSkills.length===0 && orSelectedSkills.length===0 && searchValue === "" && !availability && !grant && min_time===0 && max_time===40){
      this.setState({filterSearchResults: null});
      this.getProjects();
    }else{
      console.log("grant ", grant);
      axios.get(url, {
        params: {
          page_number: self.state.currentPage,
          page_limit: self.state.pageLimit,
          searchValue: searchValue,
          availability: availability,
          grant: grant,
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

  //display projects
  displayResults = () =>{
    let filterSearchResults = this.state.filterSearchResults
    if(filterSearchResults){
      return this.mapProjects(filterSearchResults)
    }else{
      return this.mapProjects(this.state.projects)
    } 
  }

  displayNoResults = () => {
    return <div className="floatcard"> No matches found </div>
  }

  descriptionDisplay = (description) =>{
    let count = description.length
    if(count > 250){
      let message = description.slice(0, 250) + "...see more"
      return message
    }
    else{
      return description
    }
  }

  mapProjects = (currProjects) => {
    let projectRows = currProjects.map((project,index) => 
    <div key={index}>
      <div className="floatcard card-up fixed-project">
        <div className="columns is-mobile is-variable is-4 ">
          <div onClick={this.selectProject.bind(this, project)} className="column is-7 clickable">
            {this.projectPicture(project)}
            <div>
              <h4 className="card-header-blue link"><abbr className="project-name" title={project.attributes.name}> {project.attributes.name}</abbr></h4>
              <p className="description"> {project.attributes.description}</p>
              {this.availability(project.attributes.availability)} 
            </div>
          </div>
          <div className="column is-5 needed-skills">
            <p className='card-header-p'>needed skills</p>
            <ul className='columns is-multiline is-variable is-2'>{this.mapNeededSkills(project.skills)}</ul>
          </div>
        </div>
      </div>
      <br></br>
    </div>
    );
    if (currProjects.length>0){
      return <div>              
        {projectRows}
        {this.pagination()}
      </div>
    }
    return this.displayNoResults()
  }

  selectProject = (project) => {
    this.setState({selectedProject: project})
    window.history.replaceState(null, "projectindex", `/projects/${project.attributes.id}`)
  }

  projectPicture = (project) =>{
    let pic =  {
      backgroundImage: "url(" + project.picture + ")",
      backgroundRepeat: "no-repeat"
    }

    if(project.picture){
      return <div className='project-image' style={pic}></div>
    }
    else{
      let icon = this.state.projectIcons[project.attributes.id%10];
      return <img className='project-image' src={icon} alt="default icon"></img>
    }
  }

  availability = (availability) => {
    if(availability){
      return <p className="bottom"><FontAwesomeIcon className="green" icon="circle" /> Open to new collaborators</p>
    }
    return <p className="bottom"><FontAwesomeIcon className="red" icon="circle" /> Not open to new collaborators</p>
  } 

  mapNeededSkills = (skills) => {
    return skills.map((skill, index) => 
        <li key={index} className='column is-12-mobile is-12-tablet is-6-desktop gray-text text-small' >{skill.name}</li>
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
      this.getProjects();
    }
  }

  onPrevious = async () => {
    await this.setState({currentPage: Math.max(this.state.currentPage-1, 1)});
    if(this.state.filterSearchResults){
      this.filterSearch();
    }else{
      this.getProjects();
    }
  }

  //display grant project filter
  displayGrant = () =>{
    return <div className='floatcard'>
      <h4 className='card-header-small'>
        <span className="icon-smaller"><FontAwesomeIcon className="yellow" icon={['far', 'dot-circle']}/></span>
        CoLab Grant
      </h4>
      <label className="checkbox text-small">
        <input className="box-right" onChange={this.changeHandler} name="grant" type="checkbox"/>
          Only grant projects
      </label>
    </div>
  }
  
  //display availability filter
  displayAvailability = () =>{
    return <div className='floatcard'>
      <h4 className='card-header-small'>
        <span className="icon-smaller"><FontAwesomeIcon className="yellow" icon={['far', 'dot-circle']}/></span>
        Availability
      </h4>
      <label className="checkbox text-small">
        <input className="box-right" onChange={this.changeHandler} name="avail" type="checkbox"/>
          Only open projects
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
            <input className="range" name="max_time" type="range" defaultValue={this.state.min_time} placeholder={this.state.min_time} onChange={this.changeHandler} min="0" max="40" step="1"/>
            <input className="range" name="min_time" type="range" defaultValue={this.state.max_time} placeholder={this.state.max_time} onChange={this.changeHandler} min="0" max="40" step="1"/>
      </div>
    }
    else {
      return <div> 
            <input className="range min" name="min_time" type="range" defaultValue={this.state.min_time} placeholder={this.state.min_time} onChange={this.changeHandler} min="0" max="40" step="1" />
            <input className="range max" name="max_time" type="range" defaultValue={this.state.max_time} placeholder={this.state.max_time} onChange={this.changeHandler} dual= {true} min="0" max="40" step="1" />
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
      }else if (name === "grant") {
        this.setState({
          grant: true
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
      }else if (name === "grant") {
        this.setState({
          grant: false
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

  displayFilterSearch = () => {
    return <div className=""> 
        {this.state.allBuckets.map((bucket, index) => this.displayBucket(bucket, index))}
      </div>
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
    this.filterSearch()
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

  mapSkills = (skills, index, bucketname) => {
    return skills.map((allSkill) =>
    <label className="checkbox item-smaller">
      {this.displayCheckbox(allSkill, index, bucketname)}
      {allSkill.name}
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
   <div className='about-background'>
     <Header isCreate={this.state.isCreate} selectedProject={this.state.selectedProject} clearSelectedProject={this.clearSelectedProject} selectProjectFromParam={this.selectProjectFromParam}/>
      <div className='display-project container people'>
        {this.drawProjects()}
        {this.drawProject()}
      </div>
    </div>
   );
 }
}

export default ProjectIndex