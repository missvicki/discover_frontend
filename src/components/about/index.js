import React, {Component} from 'react'
import { Link} from 'react-router-dom'
import Header from '../header'

class About extends Component {

  userProfilePath = () =>{
    return "/people/" + localStorage.getItem('netid')
  }

 render = () => {
   return(
   <div className='about-background'>
     <Header />
        <div className="display-about">
          <h1 className='subtitle-big'> About Project Discover </h1>
              <div className='floatcard-faq'>   
                  <div>
                    <h4 className='subtitle-blue'> What is Project Discover?  </h4>
                    <p className='answer'> Project Discover is a platform that allows Duke students and faculty to search for different projects and people based on skills, interests, experiences, and other relevant information. </p>
                  </div>
                  <div>
                    <h4 className='subtitle-blue'> What is the goal?  </h4>
                    <p className='answer'> We hope that Project Discover can help connect the right people with each other to create opportunities and transform ideas into realities. </p>
                  </div>
              </div>
          
          <h3 className='subtitle-medium'> Frequently Asked Questions</h3>
          <div className='floatcard-faq'>
            
            <p className='subtitle-blue'> Do I have to create a profile to participate?</p>
            <p className='answer'> When you log in with your Duke credentials, we automatically create a profile for you which you can edit and add skills and other relevant information to. </p>

            <p className='subtitle-blue'> How do I create a project?</p>
            <p className='answer'> Go to the Projects page and click the 'Create a new project' button on the top right corner. It will then bring you to the project edit page where you can fill out important information. Make sure to click 'Update Project' at the bottom when you are done or 'Delete Project' if you change your mind. </p>

            <p className='subtitle-blue'> How do I filter my search for projects/people?</p>
            <p className='answer'> On the Projects or People pages, you can type in the name of a project/person or even their net ID. There is also a filter search bar on the right which allows you to search projects/people by availability and skills. The skills are divided into different sections. Clicking the check box next to the name of the section, for example 'Design', would mean that any project/people with any skill from the Design section will show up. However, if you individually check boxes, it will make sure those projects/people have those specific skills. </p>

            <p className='subtitle-blue'> How do I join multiple projects?</p>
            <p className='answer'> Search for projects on the Project page or through our search bar on the top right. When you find the project you like, click the 'Contact Project Owner' button to email the owner listed. Once you've communicated with the owners of the project, they will add you as a member or co-owner, and the project will appear on your profile. </p>
         
            <p className='subtitle-blue'> How do I add collaborators to my project?</p>
            <p className='answer'> Click 'Edit Project' and on the bottom right Collaborators section, there is the option to add owners and collaborators to the project. When you click on 'Add Owner' or 'Add Member', you are able to search for people to add by their name or net ID. A member is someone who works on the project but does not have the power to edit or delete the project like an owner does.</p>
          </div>

          <h3 className='subtitle-medium what-now'> Okay now what? </h3>
          <div className='floatcard-faq'>
          <p className='answer'> There are a ton of cool projects out there to check out. Feel free to dive into the project search function, or go ahead and create a project and update your profile! </p>
          <div className="centre">
            <Link className="yellow-button button-left" to='/projects'>Search Projects</Link>
            <Link className="yellow-button button-left" to={this.userProfilePath()}>My Profile</Link>
          </div>
        </div>
        </div>
    </div >
   );
 }
}

export default About