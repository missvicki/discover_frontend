import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CourseEdit extends Component {
  constructor(props){
    super()
    this.state = props.props;
    this.state.hideCourses = false;
  }

  toggleCourses = () =>{
    this.setState({hideCourses: !this.state.hideCourses})
  }

  displayAcademicCourse = (course, index) => {
    return <li key={index}> <input name="courses" id={index} defaultValue={course.name} className="input" type="text" placeholder={course.name} onChange={this.props.changeHandler.bind(index)}></input> </li>
  }

  displayRootsCourse = (course, index) => {
    return <li key={index}> <input name="courses" id={index} defaultValue={course.name} className="input" type="text" placeholder={course.name} onChange={this.props.changeHandler.bind(index)}></input> </li>
  }

  mapAcademicCourses = (courses) => {
    const index = []
    courses.forEach((course, idx) => {
      if (course.academic) {
        index.push(idx); 
      }
    })
    const academic = courses.filter((course) => course.academic);
    
    
    if(academic && academic.length>0){
      return <ul className="list">
      {academic.map((course, idx) => this.displayAcademicCourse(course, index[idx]))}
    </ul>
    }
    return <p>No courses added</p>
  }

  mapRootsCourses = (courses) => {
    const index = []
    courses.forEach((course, idx) => {
      if (!course.academic) {
        index.push(idx); 
      }
    })
    const roots = courses.filter((course) => !course.academic);
    if(roots && roots.length>0){
      return <ul className="list">
      {roots.map((course, idx) =>this.displayRootsCourse(course, index[idx]))}
    </ul>
    }
    return <p>No courses added</p>
  }

  addAcademic = () => {
    const arr = this.state.courses;
    arr.push({name:"", academic: true});
    this.setState({
        courses: arr
    });  
    return <input name="courses" id={this.state.courses.length} className="input" type="text" onChange={this.props.changeHandler.bind(this.state.courses.length)}></input>
  }

  addRoots = () => {
    const arr = this.state.courses;
    arr.push({name:"", academic: false});
    this.setState({
        courses: arr
    });  
    return <input name="courses" id={this.state.courses.length} className="input" type="text" onChange={this.props.changeHandler.bind(this.state.courses.length)}></input>
  }

  mapCourses = () => {

    return(
      <div>
        <div className="floatcard interest" id="interest">
          <h4 className="card-header"> Academic Courses </h4>
          {this.mapAcademicCourses(this.state.courses)}
          <div className="buttons are-small edit-group">
            <div className="button is-success is-light" onClick={this.addAcademic}> <FontAwesomeIcon icon="plus"/> </div>
            <div className="button is-danger is-light" onClick={this.deleteAcademic}> <FontAwesomeIcon icon="minus"/> </div>
          </div>
        </div>
        <div className="floatcard interest">
          <h4 className="card-header"> Roots Courses </h4>
          {this.mapRootsCourses(this.state.courses)}
          <div className="buttons are-small edit-group">
            <div className="button is-success is-light" onClick={this.addRoots}> <FontAwesomeIcon icon="plus"/> </div>
            <div className="button is-danger is-light" onClick={this.deleteRoots}> <FontAwesomeIcon icon="minus"/> </div>
          </div>
        </div>
      </div>
    )
  }


  courses = () =>{
    if(!this.state.hideCourses){
      if(this.state.courses && this.state.courses.length > 0){
        return this.mapCourses()
      }else{
        return <div>
          <div className="floatcard interest">
            <h4 className="card-header"> Academic Courses </h4>
            <ul className="list">
              No courses added
              <div className="button is-success is-light" onClick={this.addAcademic}> <FontAwesomeIcon icon="plus"/> </div>
            </ul>
          </div>
          <div className="floatcard interest">
              <h4 className="card-header"> Roots Courses </h4>
              <ul className="list">
                No courses added
                <div className="button is-success is-light" onClick={this.addRoots}> <FontAwesomeIcon icon="plus"/> </div>
              </ul>
          </div>
        </div>
      }
    }  
  }


  deleteAcademic = () => {
    var index = 0
    this.state.courses.forEach((course, idx) => {
      if (course.academic) {
        index = idx; 
      }
    })
    const arr = this.state.courses;
    const delarr = this.state.delCourses;
    delarr.push(arr[index])
    arr.splice(index, 1);
    this.setState({
      courses: arr
    }); 
    this.setState({
      delCourses: delarr
  });  
    return;  
  }

  deleteRoots = () => {
    var index = 0
    this.state.courses.forEach((course, idx) => {
      if (!course.academic) {
        index = idx; 
      }
    })
    const arr = this.state.courses;
    const delarr = this.state.delCourses;
    delarr.push(arr[index])
    arr.splice(index, 1);
    this.setState({
        courses: arr
    }); 
    this.setState({
      delCourses: delarr
    });  
    return;
  }

  render = () => {
    return <div className="is-child is-vertical">
        <h3 className='section-header link' onClick={this.toggleCourses}>Courses <FontAwesomeIcon icon="angle-down" className="down"/></h3>
        {this.courses(this.state.userAttrs)}
      </div>
  }

  
}
export default CourseEdit