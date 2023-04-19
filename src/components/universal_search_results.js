import React, {Component} from 'react';
import ProjectUniversalSearchCard from "./projects/universal_search_card"
import UserUniversalSearchCard from "./users/universal_search_card"
import ProjectShow from "./projects/show"
import UserShow from "./users/show"
import Header from "./header"
import '../assets/css/index.css';
import '../assets/css/header.css';
import {logErrors} from '../helpers'

const axios = require('axios');

class UniversalSearchResults extends Component{
  constructor(props){
    super()
    this.state={navClass: "topnav", returnHome: false, query: null, searchResults: null, selectedUser: null, selectedProject: null}
  }

  componentDidMount = () => {
   let queryValue = this.getQuery()
   this.globalSearch(queryValue)
  }

  getQuery = () => {
    let url_string = window.location.href; 
    let url = new URL(url_string);
    let query = url.searchParams.get("query")
    return query 
  } 

  drawSearchResults = () => {
    if(!this.state.selectedProject && !this.state.selectedUser){
      if(this.state.searchResults){
        let users = ""
        let projects = ""
        if(this.state.searchResults.users.length > 0){
          users=this.state.searchResults.users.map((user, index) => 
          <div key={index}>
            <UserUniversalSearchCard selectUser={this.selectUser} user={user} />
          </div>
          )
        }
        else{
          users = <div className='floatcard people-universal'>No matches found</div>
        }
        if(this.state.searchResults.projects.length > 0){
          projects = this.state.searchResults.projects.map((project, index) =>
          <div key={index}>
            <ProjectUniversalSearchCard selectProject={this.selectProject} project={project} />
          </div>
          )
        }
        else{
          projects = <div className='floatcard people-universal'>No matches found</div>
        }
        return <div className="display-about">
          <div className="columns is-variable is-8">
            <div className="column is-6">
              <p className="section-sub-header centered">Users</p>
              <div className='universal-cards'>
                {users}
              </div>
            </div>
            <div className="column is-6">
              <p className="section-sub-header centered">Projects</p>
              <div className='universal-cards'>
                {projects}
              </div>
            </div>
          </div>
        </div>
      } 
    }
  }


  globalSearch = (queryValue) => {
    let query = queryValue
    let url = "/global_search/" + query
    let self = this;
    //clear results if empty string 
    if (query.length === 0){
      this.setState({searchResults: false})
      return null
    }
    axios.get(url).then(function (response) {

      self.setState({searchResults: response.data})
    })
    .catch(function (error) {
      logErrors(error);
    }); 
  }
 
  handleKeyPress = (event) => {
    if(event.key === "Enter"){this.globalSearch()}
  }

  //selecting users/projects
  selectUser = (user) => {
    this.setState({selectedUser: user})
  }

  selectProject = (project) => {
    this.setState({selectedProject: project})
  }

  drawProject() {
    if (this.state.selectedProject) {
      return <div className="display">
          <p className="button is-yellow is-small" onClick={this.reload}> Back </p>
          <ProjectShow project={this.state.selectedProject} />
        </div>
    }
  }

  drawUser = () => {
    if(this.state.selectedUser){
      return <div className="display">
        <p className="button is-yellow is-small" onClick={this.reload}> Back </p>
        <UserShow user={this.state.selectedUser} />
      </div>
    }
  }

  reload = () => {
    window.location.reload();
  }

  render = () => {
    return(
      <div className='about-background'>
        <Header/>
        <div className="people container">
          {this.drawSearchResults()} 
          {this.drawProject()}
          {this.drawUser()} 
        </div>
      </div>

    );
  }
}
export default UniversalSearchResults