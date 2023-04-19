import React, {Component} from 'react';

class CourseCard extends Component {
  constructor(props){
    super()
  }

  displayAcademicCourse = (course, index) => {
      return <li key={index} className="item">{course.name}</li>
  }

  displayRootsCourse = (course, index) => {
      return <li key={index} className="item">{course.name}</li>
  }

  mapAcademicCourses = (courses) => {
    const academic = courses.filter((course) => course.academic);
    if(academic && academic.length>0){
      return <ul className="list">
      {academic.map((course, index) =>this.displayAcademicCourse(course, index))}
    </ul>
    }
    return <p>No courses added</p>
  }

  mapRootsCourses = (courses) => {
    const roots = courses.filter((course) => !course.academic);
    if(roots && roots.length>0){
      return <ul className="list">
      {roots.map((course, index) =>this.displayRootsCourse(course, index))}
    </ul>
    }
    return <p>No courses added</p>
  }


  render = () => {
    return(
      <div>
        <div className="floatcard interest">
          <h4 className="card-header"> Academic Courses </h4>
          {this.mapAcademicCourses(this.props.courses)}
        </div>
        <div className="floatcard interest">
          <h4 className="card-header"> Roots Courses </h4>
          {this.mapRootsCourses(this.props.courses)}
        </div>      
      </div>
      
    )
  }
}
export default CourseCard