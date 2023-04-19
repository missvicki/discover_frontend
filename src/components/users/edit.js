import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import CourseEdit from "../courses/edit";
import InterestEdit from "../interests/edit";
import SkillEdit from "../skills/edit";
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import {faUpload, faGlobe } from '@fortawesome/free-solid-svg-icons';
import {logErrors} from '../../helpers';
import Flash from "../flash";
import axios from 'axios';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import Icon1 from '../../assets/images/ProfileIcons/Icon1.png';
import Icon2 from '../../assets/images/ProfileIcons/Icon2.png';
import Icon3 from '../../assets/images/ProfileIcons/Icon3.png';
import Icon4 from '../../assets/images/ProfileIcons/Icon4.png';


class UserEdit extends Component {
  constructor(props){
    super()
    //in this case we're using state to manage the form items we want submitted, note we dont want all fields editable so we currate those here
    
    this.changeHandler = this.changeHandler.bind(this)
    this.courseChangeHandler = this.courseChangeHandler.bind(this)

    props.getUpdatedUser()    
    this.state = {
      full_name: null,
      max_time: props.userAttrs.max_time,
      min_time: props.userAttrs.min_time,
      userAttrs: props.userAttrs,
      courses: props.courses,
      interests: props.interests,
      highlights: props.highlights,
      projects: props.projects,
      delCourses: [],
      delInterests: [],
      delHighlights: [],
      buckets: props.buckets,
      pic: props.profile_picture,
      allBuckets: props.allBuckets,
      skillIds: [],
      delSkillIds: [],
      hideInfo:false,
      hideName:false,
      showCropModal: false,
      crop: {unit: "%", width: 30, aspect: 1},
      profileIcons: [Icon1, Icon2, Icon3, Icon4],
    }
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

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    this.setState({
        [name]: value
    }); 
  }

  imageHandler = (event) => {
    this.setState({
      showCropModal: true,
      profile_picture: event.target.files[0],
      pic: event.target.files[0],
      pic_name: event.target.files[0].name
    });
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        this.setState({profile_picture: fileReader.result })
    }   
    fileReader.readAsDataURL(event.target.files[0])
  }

  onImageLoaded = image => {
    this.imageRef = image
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  }

  onCropComplete = crop => {
    if (this.imageRef && crop.width && crop.height) {
        const croppedImageUrl = this.getCroppedImg(this.imageRef, crop)
        this.setState({ croppedImageUrl })
    }
  }

  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width*scaleX);
    canvas.height = Math.ceil(crop.height*scaleY);
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width*scaleX,
      crop.height*scaleY,
    );

    const reader = new FileReader()
    canvas.toBlob(blob => {
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
            this.dataURLtoFile(reader.result, 'cropped_'+this.state.pic_name)
        }
    }, "image/jpeg" , 1)
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
            
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, {type:mime});
    this.setState({croppedImage: croppedImage }) 
  }

  imageName = () => {
    if(this.state.pic_name){
        return this.state.pic_name
        
    }else{
        return "Upload a Profile Picture."
    };
  }

  profilePicture = (id) =>{
    if(this.state.pic){
      if (typeof this.state.pic === "object") {
        return 
      }
      else {
        let pic =  {
          backgroundImage: "url(" + this.state.pic + ")",
          backgroundRepeat: "no-repeat"
        }
        return <div>
            <div className='profile-picture' style={pic}></div>
          </div>
      }
    }
    else{
      let icon = {
        backgroundImage: "url(" + this.state.profileIcons[id%4] + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }
      return <div>
      <div className='profile-picture' style={icon}></div>
    </div>
    }
  }

  courseChangeHandler = (event) => {
    const index = event.target.id;
    const name = event.target.name;
    const arr = this.state[name];
    const value = event.target.value;
    arr[index].name = value;
    this.setState({
        [name]: arr
    }); 
  }

  deleteInterest2 = (interest) => {
    const delarr = this.state.delInterests;
    delarr.push(interest)
    this.setState({
      delInterests: delarr
    }); 
    this.setState(prevState => ({
      interests: prevState.interests.filter(i => i !== interest)
    }), 
    );
    this.props.deleteInterest(interest);
  }

  deleteHighlight2 = (highlight) => {
    const delarr = this.state.delHighlights;
    delarr.push(highlight)
    this.setState({
      delHighlights: delarr
    }); 
    this.setState(prevState => ({
      highlights: prevState.highlights.filter(i => i !== highlight)
    }), 
    );
    this.props.deleteHighlight(highlight);
  }

  interestChangeHandler = (event) => {
    const index = event.target.id;
    const arr = this.state.interests;
    const value = event.target.value;
    arr[index].name = value;
    this.setState({
      interests: arr
  }); 
  }

  highlightChangeHandler = (event) => {
    const index = event.target.id;
    const n = event.target.name;
    const desc = n.slice(11, 15);
    const arr = this.state.highlights;
    const value = event.target.value;
    if (desc === "inte") {
      arr[index].name = value;
    }
    if (desc === "desc") {
      arr[index].description = value;
    }
    this.setState({
      highlights: arr
    }); 
  }

  projectChangeHandler = (event) => {
    const index = event.target.id;
    const n = event.target.name;
    const name = n.slice(0, 8);
    const desc = n.slice(9, 13);
    const arr = this.state[name];
    const value = event.target.value;
    if (desc === "name") {
      arr[index].attributes.name = value;
    }
    if (desc === "desc") {
      arr[index].attributes.description = value;
    }
    this.setState({
        [name]: arr
    }); 
  }

  clearFlash = () => {
    this.setState({response_title: null, response_code: null, response_msg: null})
  }

  renderFlash = () => {
    if(this.state.response_code && this.state.response_msg){
      return <div>
      <Flash clearFlash={this.clearFlash} title={this.state.response_title} status={this.state.response_code} message={this.state.response_msg} />
    </div>
    }
  }

  submitForm = (event) => {
    event.preventDefault();

    this.state.courses.forEach((course) => {
      this.saveCourse(course);
    });
    this.state.delCourses.forEach((course) => { 
      this.deleteCourse(course);
    });
    this.state.interests.forEach((interest) => {
      this.saveInterest(interest);
    });
    this.state.delInterests.forEach((interest) => { 
      this.deleteInterest(interest);
    });
    this.state.highlights.forEach((highlight) => {
      this.saveHighlight(highlight);
    });
    this.state.delHighlights.forEach((highlight) => { 
      this.deleteHighlight(highlight);
    });
    this.state.skillIds.forEach((skill) => { 
      this.saveSkills(skill);
    });
    this.state.delSkillIds.forEach((skill) => { 
      this.deleteSkills(skill);
    });
    this.saveUser();
  }

  saveSkills = (skill) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/"+ this.state.userAttrs.id + "/skills/" + skill
    axios.post(url, {
      headers: {
      'content-type': 'multipart/form-data'
    }
    })
  }

  deleteSkills = (skill) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/"+ this.state.userAttrs.id + "/skills/" + skill
    axios.delete(url, {
      headers: {
        'content-type': 'multipart/form-data'
      },
    });
  }

  saveCourse = (course) => {
    if (course.name !== ""){
      if(course.id) {
        let url = process.env.REACT_APP_DISCOVER_API_HOST + "/courses/" + course.id 
        let form_data = new FormData();
        for (let [key, value] of Object.entries(course)) {
          if ((key === "userAttrs") || (key === "id")) { continue};
          if(value) {form_data.append(key, value)};
        }
          axios.put(url, form_data, {
            headers: {
            'content-type': 'multipart/form-data'
          }
        })
      }
      else {
        let url = process.env.REACT_APP_DISCOVER_API_HOST + "/courses"
        let form_data = new FormData();
        for (let [key, value] of Object.entries(course)) {
          if ((key === "userAttrs") || (key === "id")) {continue};
          if(value) {form_data.append(key, value)};
        }
        form_data.append("user_id", this.state.userAttrs.id);
          axios.post(url, form_data, {
            headers: {
            'content-type': 'multipart/form-data'
          }
        });
      } 
    }
  }

  deleteCourse = (course) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/courses/" + course.id 
    let form_data = new FormData();
    for (let [key, value] of Object.entries(course)) {
      if ((key === "userAttrs") || (key === "id")) { continue};
      if(value) {form_data.append(key, value)};
    }
      axios.delete(url, form_data, {
        headers: {
        'content-type': 'multipart/form-data'
      }
    })
  }

  saveInterest = (interest) => {
    if (interest.name !== ""){
      if(interest.id) {
        let url = process.env.REACT_APP_DISCOVER_API_HOST + "/interests/" + interest.id 
        let form_data = new FormData();
        for (let [key, value] of Object.entries(interest)) {
          if ((key === "userAttrs") || (key === "id")) { continue};
          if(value) {form_data.append(key, value)};
        }
          axios.put(url, form_data, {
            headers: {
            'content-type': 'multipart/form-data'
          }
        })
      }
      else {
        let url = process.env.REACT_APP_DISCOVER_API_HOST + "/interests"
        let form_data = new FormData();
        for (let [key, value] of Object.entries(interest)) {
          if ((key === "userAttrs") || (key === "id")) {continue};
          if(value) {form_data.append(key, value)};
        } 
        form_data.append("user_id", this.state.userAttrs.id);
          axios.post(url, form_data, {
            headers: {
            'content-type': 'multipart/form-data'
          }
        })
      } 
    }
  }

  deleteInterest = (interest) => {
    if (interest.id){
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/interests/" + interest.id 
      let form_data = new FormData();
      for (let [key, value] of Object.entries(interest)) {
        if ((key === "userAttrs") || (key === "id")) { continue};
        if(value) {form_data.append(key, value)};
      };
        axios.delete(url, form_data, {
          headers: {
          'content-type': 'multipart/form-data'
        }
      })
    }
  }

  saveHighlight = (highlight) => {
    if (highlight.name !== ""){
      if(highlight.id) {
        let url = process.env.REACT_APP_DISCOVER_API_HOST + "/interests/" + highlight.id 
        let form_data = new FormData();
        for (let [key, value] of Object.entries(highlight)) {
          if ((key === "userAttrs") || (key === "id")) { continue};
          if(value) {form_data.append(key, value)};
        }
          axios.put(url, form_data, {
            headers: {
            'content-type': 'multipart/form-data'
          }
        })
      }
      else {
        let url = process.env.REACT_APP_DISCOVER_API_HOST + "/interests"
        let form_data = new FormData();
        for (let [key, value] of Object.entries(highlight)) {
          if ((key === "userAttrs") || (key === "id")) {continue};
          if(value) {form_data.append(key, value)};
        } 
        form_data.append("user_id", this.state.userAttrs.id);
          axios.post(url, form_data, {
            headers: {
            'content-type': 'multipart/form-data'
          }
        })
      } 
    }
  }

  deleteHighlight = (highlight) => {
    if (highlight.id){
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/interests/" + highlight.id 
      let form_data = new FormData();
      for (let [key, value] of Object.entries(highlight)) {
        if ((key === "userAttrs") || (key === "id")) { continue};
        if(value) {form_data.append(key, value)};
      };
        axios.delete(url, form_data, {
          headers: {
          'content-type': 'multipart/form-data'
        }
      })
    }
  }

  saveUser = async() => {
    let self = this
    if (Number(this.state.max_time) < Number(this.state.min_time)) {
      var tmp = self.state.max_time
      self.state.max_time = self.state.min_time
      self.state.min_time = tmp
    }
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/users/" + this.props.user.attributes.id 
    let form_data = new FormData();
    let ignore = ["courses", "userAttrs", "id", "interests", "delCourses", "delInterests", "buckets", "allBuckets", "skillIds", "delSkillIds"]
    for (let [key, value] of Object.entries(this.state)) {
      if (ignore.includes(key)) {continue};
      if(key === "full_name" && value){
        form_data.append(key, value);
      }else if(key !== "full_name"){
        form_data.append(key, value);
      };
    };
    await axios.put(url, form_data, {
      headers: {
      'content-type': 'multipart/form-data'
      }
    })
    .then(function (response){
      self.setState({response_title: "Successfully Saved Profile", response_code: response.status, response_msg: response.data.message})
      self.props.getUpdatedUser();
      self.props.getUpdatedCourses();
      self.props.toggleEdit();
    })
    .catch(function (error){  
      let errorMsg = "An unexpected error has ocurred. If this is persists please contact the oit service desk. Please provide them with this timestamp: " + Date.now();
      console.log("ERROR on submit")
      self.setState({response_title: "Unexpected Error", response_code: 500, response_msg: errorMsg})
      logErrors(error)
    });
    this.getUsers();
  }

  toggleInfo = () =>{
    this.setState({hideInfo: !this.state.hideInfo})
  }

  toggleName = () =>{
      this.setState({hideName: !this.state.hideName})
  }

  displayInfo = (user) => {
      if(!this.state.hideInfo){
        return <div className="is-child is-vertical">
              <div className='floatcard'>
                  <div className="field">
                      <label className="label">Affiliation</label>
                      <div className="control">
                          <input className="input" name="duke_title" type="text" defaultValue={user.duke_title} placeholder={user.duke_title} onChange={this.changeHandler} />
                      </div>
                  </div>
                  <div className="field">
                      <label className="label">Major</label>
                      <div className="control">
                          <input className="input" name="major" type="text" defaultValue={user.major} placeholder={user.major} onChange={this.changeHandler} />
                      </div>
                  </div>
                      <div className="field">
                      <label className="label">Grad Year</label>
                      <div className="control">
                          <input className="input" name="year" type="text" defaultValue={user.year} placeholder={user.year} onChange={this.changeHandler} />
                      </div>
                  </div>
              </div>
          
              <div className='floatcard'>
                  <label className="label">Bio</label>
                  <div className="field">
                  <div className="control">
                      <textarea name="bio" defaultValue={user.bio} className="textarea is-medium" placeholder={user.bio} onChange={this.changeHandler} maxlength="250"></textarea>
                  </div>
                  </div>
              </div>

              <div className='floatcard'>
                  <div className="field">
                  <label className="label"> LinkedIn <FontAwesomeIcon  icon={faLinkedin} /></label>
                  <div className="control">
                      <input className="input" name="linkedin" type="text" defaultValue={user.linkedin } placeholder = {user.linkedin } onChange={this.changeHandler}/>
                  </div>
                  </div>
                  <div className="field">
                  <label className="label"> Github <FontAwesomeIcon  icon={faGithub} /></label>
                  <div className="control">
                      <input className="input" name="github" type="text" defaultValue={user.github} placeholder = {user.github} onChange={this.changeHandler}/>
                  </div>
                  </div>
                  <div className="field">
                  <label className="label"> Website <FontAwesomeIcon  icon={faGlobe} /></label>
                  <div className="control">
                      <input className="input" name="website" type="text" defaultValue={user.website} placeholder={user.website} onChange={this.changeHandler}/>
                  </div>
                  </div>
              </div>


              <div className='floatcard'>
                  <label className="label">Availabilty</label>
                  <div className="field">
                    {this.displayAvailability()}
                  </div>

                  <label className="label"> Time commitment </label>
                  <div className="field">
                    <section className="control range-slider">
                      <span className="rangeValues"></span>
                      {this.sliderval()}
                      {this.sliders()}
                    </section>
                  </div>

              </div>
          </div> 
      }
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

  displayName = (user) => {
      if(!this.state.hideName){
          return <div className="is-child is-vertical">
              <div className='floatcard'>
                  <div className="field">
                  <label className="label">Name</label>
                  <div>
                  <div id="profile-hero" className='floatcard tile is-child'>
                      {this.profilePicture(user.id)}
                  </div>
                  </div>
                  <div className="control">
                      <input className="input" name="full_name" type="text" defaultValue={user.full_name} placeholder={user.full_name} onChange={this.changeHandler}/>
                  </div>
                  </div>
                  <div className="file has-name">
                  <label className="file-label">
                      <input className="file-input" type="file" name="profile_picture" accept="image/png, image/jpeg" onChange={this.imageHandler} />
                      <span className="file-cta">
                      <span className="file-icon"><FontAwesomeIcon   icon={faUpload} /></span>
                      <span className="file-label">Browse...</span>
                      </span>
                      <span className="file-name">{ this.imageName() }</span>
                  </label>
                  </div> 
              </div>
          </div>
      }
  }

  toggleCropModal = () => {
    this.setState({showCropModal: !this.state.showCropModal});
  }

  cropModal = () => {
    if(this.state.showCropModal){
      return <div className="modal is-active">
        <div className="modal-background">
          <div className="modal-content">
            <header className="modal-card-head">
              <p className="modal-card-title">Crop Image</p>
            </header>
            <section className="modal-card-body">
              <ReactCrop
                src={this.state.profile_picture}
                crop={this.state.crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
                circularCrop={true}
                imageStyle={{ display: 'block', margin:'auto auto', width: '100%', height: '100%'}}
                /> 
            </section>
            <footer className="modal-card-foot">
              <button type="button" onClick={this.toggleCropModal} className="button is-success">Save changes</button>
            </footer>
          </div>
        </div> 
      </div>
    }
  }

  displayAvailability = () =>{
    if (this.state.userAttrs.availability){
      return <div className="control radio">               
        <input className="radio" name="availability" type = "radio" value="true" onChange={this.changeHandler} defaultChecked/> 
        <label> Available to join new projects </label><br></br>
        <input className="radio" name="availability" type = "radio" value = "false" onChange={this.changeHandler}/> 
        <label> Not available to join new projects</label><br></br>   
      </div>
    }else{
      return <div className="control radio">               
        <input className="radio" name="availability" type = "radio" value="true" onChange={this.changeHandler} /> 
        <label> Available to join new projects </label><br></br>
        <input className="radio" name="availability" type = "radio" value = "false" onChange={this.changeHandler} defaultChecked/> 
        <label> Not available to join new projects</label><br></br>   
      </div>
    }
  }

  render() {
    let user = this.state.userAttrs;
    return <div>
      <p> <a href="/"> Discover </a> <FontAwesomeIcon  icon="chevron-right" className="caret-right" id="caret-right" /> <a href="/people"> People </a> <FontAwesomeIcon  icon="chevron-right" className="caret-right" id="caret-right" /> <a href={this.state.userAttrs.netid} > {this.state.userAttrs.full_name} </a></p>
      {this.renderFlash()}
      <form>
        <div className='tile is-ancestor columns is-centered'>       
            <div className="tile is-parent is-vertical is-6 is-narrow">
              <h3 className='section-header link' onClick={this.toggleName}>Name and Image <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
              {this.displayName(user)}
              <h3 className='section-header link' onClick={this.toggleInfo}>Info <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
              {this.displayInfo(user)}
              <CourseEdit changeHandler={this.courseChangeHandler} props={this.state}/>
            </div>
            <div className="tile is-parent is-vertical is-6 is-narrow">
              <InterestEdit highlightchangeHandler = {this.highlightChangeHandler} changeHandler={this.interestChangeHandler} deleteInterest= {this.deleteInterest2} deleteHighlight= {this.deleteHighlight2} props={this.state}/>
              <SkillEdit changeHandler={this.skillChangeHandler} props={this.state}/>
            </div>  
        </div>
        <div className="floatcard field is-grouped">
            <div className="control">
              <button type="button" className="button is-link is-light" onClick={this.props.toggleEdit}> <FontAwesomeIcon icon={faArrowLeft}/> Back </button>
            </div>
            <div className="control">
              <button type="submit" className="button is-link" onClick={this.submitForm}>Save Profile</button>
            </div>
        </div>
      </form>
      {this.cropModal()}
    </div>
  }
}
export default UserEdit;
