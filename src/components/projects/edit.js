import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import {faUpload, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import MemberEdit from "./memberedit";
import SkillEdit from "../skills/edit";
import {logErrors} from '../../helpers';
import Flash from "../flash";
import axios from 'axios';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
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

class ProjectEdit extends Component {
  constructor(props){
    super()
    //in this case we're using state to manage the form items we want submitted, note we dont want all fields editable so we currate those here
    
    this.changeHandler = this.changeHandler.bind(this)
    props.getUpdatedProject()  
    
    this.state = {
      invalid: true,
      admin: props.admin,
      user: props.user,
      name: null,
      project_picture: null,
      description: null,
      linkedin: null,
      github: null,
      website: null,
      email: null,
      show_contact: null,
      pic_name: null,
      response_code: null,
      response_msg: null,
      response_title: null,
      availability: null,
      projectAttrs: props.projectAttrs,
      members: props.members,
      buckets: props.buckets,
      pic: props.project_picture,
      allBuckets: props.allBuckets,
      noUserSkills: props.noUserSkills,
      noProjectSkills: props.noProjectSkills,
      isCreate: props.isCreate,
      skillIds: [],
      users: [],
      delSkillIds: [],
      hideInfo: false,
      hideName: false,
      min_time: props.projectAttrs.min_time,
      max_time: props.projectAttrs.max_time,
      showCropModal: false,
      croppedImage: null,
      crop: {unit: "%", width: 30, aspect: 1},
      croppedImageUrl: null,
      projectIcons: [Discover1, Discover2, Discover3, Discover4, Discover5, 
        Discover6, Discover7, Discover8, Discover9, Discover10],
    }
  }

  componentDidMount = async () => {
    await this.getUsers()
    if(this.state.isCreate){
      await this.props.getInfo()
    }
    this.validate()
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


  changeHandler = async(event) => {
    const name = event.target.name;
    const value = event.target.value;
    await this.setState({
        [name]: value
    }); 
    this.validate()
  }

  imageHandler = (event) => {
    this.setState({
      showCropModal: true,
      project_picture: event.target.files[0],
      pic: event.target.files[0],
      pic_name: event.target.files[0].name
    });
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        this.setState({project_picture: fileReader.result })
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
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
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
        return "Upload a Project Picture."
    };
  }

  projectPicture = (id) =>{
    if(this.state.pic){
      if (typeof this.state.pic === "object") {
        return 
      }
      else {
        let pic =  {
          backgroundImage: "url(" + this.state.pic + ")",
          backgroundRepeat: "no-repeat"
        }
        return <div className='project-picture ppedit' style={pic}></div>
      }
    }
    else{
      let icon =  {
        backgroundImage: "url(" + this.state.projectIcons[id%10] + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }  
      return <div className='project-picture ppedit' style={icon}></div>
    }
  }

  memberChangeHandler = (user, owner, del) => {
    const arr = this.state.members
    var array = this.state.members.map(function(x) {
      return x[0].attributes.netid;
    });
    if (!del) {
      if (array.indexOf(user.attributes.netid) === -1) {
        arr.push([user, owner])
        this.setState({members: arr})
        user.color = " addedmember"
      }
    }
    else {
      if (array.indexOf(user.attributes.netid) !== -1) {
        arr.splice(array.indexOf(user.attributes.netid), 1)
        this.setState({members: arr})
        user.color = " removedmember"
      }
    }
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
    this.state.skillIds.forEach((skill) => { 
      this.saveSkills(skill);
    });
    this.state.delSkillIds.forEach((skill) => { 
      this.deleteSkills(skill);
    });
    this.saveMembers();
    this.saveProject();
  }

  saveSkills = (skill) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/"+ this.state.projectAttrs.id + "/skills/" + skill
    axios.post(url, {
      headers: {
      'content-type': 'multipart/form-data'
    }
    })
  }

  deleteSkills = (skill) => {
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/"+ this.state.projectAttrs.id + "/skills/" + skill
    axios.delete(url, {
      headers: {
        'content-type': 'multipart/form-data'
      },
    });
  }

  saveMembers = () => {
    var netids = this.state.members.map(function(x) {
      return x[0].attributes.netid;
    });
    var owners = this.state.members.map(function(x) {
      return x[1];
    });
    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + this.state.projectAttrs.id + "/memberedit/" + encodeURI(netids) + "/owners/" + owners 
    axios.post(url, {
      headers: {
      'content-type': 'multipart/form-data'
    }
    })
  }

  toggleInfo = () =>{
    this.setState({hideInfo: !this.state.hideInfo})
  }

  toggleName = () =>{
    this.setState({hideName: !this.state.hideName})
  }


  saveProject = () => {
    let self = this
    if (Number(this.state.max_time) < Number(this.state.min_time)) {
      var tmp = self.state.max_time
      self.state.max_time = self.state.min_time
      self.state.min_time = tmp
    }

    let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + this.state.projectAttrs.id 
    let form_data = new FormData();
    let ignore = ["members", "projectAttrs", "id", "interests", "delCourses", "delSkillIds", "buckets", "allBuckets", "skillIds", "delSkillIds", "pic", "pic_name"]
    for (let [key, value] of Object.entries(this.state)) {
      if (ignore.includes(key)) { continue};
      if(value) {form_data.append(key, value)};
    };
      axios.put(url, form_data, {
        headers: {
        'content-type': 'multipart/form-data'
      }
      
    })
    .then(function (response){
      if(response.data.errors){
        let errorMsg = "A project with this name already exists. Try changing the name or contact the owner of the duplicate project to be added as a collaborator.";
        self.setState({response_title: "Duplicate Project", response_code: 409, response_msg: errorMsg})
        console.log("ERROR on submit");
      }else{
        window.location.reload();
        self.setState({response_title: "Successfully Saved Project", response_code: response.status, response_msg: response.data.message})
      }
    })
    .catch(function (error){  
      let errorMsg = "An unexpected error has ocurred. If this is persists please contact the oit service desk. Please provide them with this timestamp: " + Date.now();
      console.log("ERROR on submit")
      self.setState({response_title: "Unexpected Error", response_code: 500, response_msg: errorMsg})
      logErrors(error)
    });

   
  }

  displayName = (project) => {
    if(!this.state.hideName){
      return <div className="is-child is-vertical">
        <div className='floatcard'>
            <div className="field">
            <label className="label">Name</label>
            {this.projectPicture(project.id)}
            <div className="control">
                <input className="input" name="name" type="text" defaultValue={project.name} placeholder={project.name} onChange={this.changeHandler} required/>
            </div>
            </div>
            <div className="file has-name">
            <label className="file-label">
                <input className="file-input" type="file" name="project_picture" accept="image/png, image/jpeg" onChange={this.imageHandler} />
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
                src={this.state.project_picture}
                crop={this.state.crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
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

  displayInfo = (project) => {
    if(!this.state.hideInfo){
      return <div className="is-child is-vertical">
        
        <div className='floatcard'>
            <label className="label">Description</label>
            <div className="field">
            <div className="control">
                <textarea name="description" defaultValue={project.description} className="textarea is-medium" placeholder={project.description} onChange={this.changeHandler}></textarea>
            </div>
            </div>
        </div>

        <div className='floatcard'>
            <label className="label">Contact Project Owner</label>
            <div className="field">
            <div className="control radio">
                <input className="radio" name="show_contact" type = "radio" value = "true" onChange={this.changeHandler}/> 
                <label> Display "Contact Project Owner" button on project page?</label><br></br>
                <input className="radio" name="show_contact" type = "radio" value = "false" onChange={this.changeHandler}/> 
                <label> Don't display </label><br></br>   
            </div>
            <p></p>
            <div className="field">
            <div className="control">
                Email:
                <input className="input" name="email" type="text" defaultValue={project.email } placeholder = {project.email } onChange={this.changeHandler}/>
            </div>
            </div>
            </div>
        </div>

        <div className='floatcard'>
            <div className="field">
            <label className="label"> LinkedIn <FontAwesomeIcon  icon={faLinkedin} /></label>
            <div className="control">
                <input className="input" name="linkedin" type="text" defaultValue={project.linkedin } placeholder = {project.linkedin } onChange={this.changeHandler}/>
            </div>
            </div>
            <div className="field">
            <label className="label"> Github <FontAwesomeIcon  icon={faGithub} /></label>
            <div className="control">
                <input className="input" name="github" type="text" defaultValue={project.github} placeholder = {project.github} onChange={this.changeHandler}/>
            </div>
            </div>
            <div className="field">
            <label className="label"> Website <FontAwesomeIcon  icon={faGlobe} /></label>
            <div className="control">
                <input className="input" name="website" type="text" defaultValue={project.website} placeholder={project.website} onChange={this.changeHandler}/>
            </div>
            </div>
        </div>


        <div className='floatcard'>
            <label className="label">Availabilty</label>
            <div className="field">
            <div className="control radio">
                <input className="radio" name="availability" type = "radio" value = "true" onChange={this.changeHandler}/> 
                <label> Open to new collaborators </label><br></br>
                <input className="radio" name="availability" type = "radio" value = "false" onChange={this.changeHandler}/> 
                <label> Not open to new collaborators </label><br></br>   
            </div>
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

  projectInfo = () => {
    const project = this.state.projectAttrs
    return <div>
      <h3 className='section-header link' onClick={this.toggleName}>Name and Logo <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
      {this.displayName(project)}
      <h3 className='section-header link' onClick={this.toggleInfo}>Info <FontAwesomeIcon  icon="angle-down" className="down"/></h3>
      {this.displayInfo(project)}
    </div>
  }

  deleteProject = () => {
    if(window.confirm("Are you sure you want to DELETE this project?")){
      let self = this
      let url = process.env.REACT_APP_DISCOVER_API_HOST + "/projects/" + this.state.projectAttrs.id 
      axios.delete(url, {
        headers: {
        'content-type': 'multipart/form-data'
        }
      })
      .then(function (response){
        self.setState({response_title: "Successfully Deleted Project", response_code: response.status, response_msg: response.data.message})
        window.location.reload()
        // self.props.toggleEdit(true);
      })
      .catch(function (error){  
        let errorMsg = "An unexpected error has ocurred. If this is persists please contact the oit service desk. Please provide them with this timestamp: " + Date.now();
        console.log("ERROR on submit")
        self.setState({response_title: "Unexpected Error", response_code: 500, response_msg: errorMsg})
        logErrors(error)
      });
    }
  }

  validate = () =>{
    if(this.state.name != null || this.props.projectAttrs.name != null){
      this.setState({invalid: false})
    } 
  }

  deleteEmpty = () =>{
    if(this.state.projectAttrs.name === null){
      this.deleteProject()
    }
    this.props.toggleEdit()
  }

  render() {
    return <div>
      <p> 
        <a href="/"> <span onClick={this.deleteEmpty}> Discover </span></a> 
          <FontAwesomeIcon  icon="chevron-right" className="caret-right" id="caret-right" /> 
        <a href="/projects"> <span onClick={this.deleteEmpty}> Projects </span></a> 
          <FontAwesomeIcon  icon="chevron-right" className="caret-right" id="caret-right" /> 
        <a href={this.state.projectAttrs.id} > {this.state.projectAttrs.name} </a>
      </p>
      {this.renderFlash()}
      <form>
        <div className='tile is-ancestor columns is-centered'>       
          <div className="tile is-parent is-vertical is-6 is-narrow">
              {this.projectInfo()}
          </div>
          <div className="tile is-parent is-vertical is-6 is-narrow">
            <SkillEdit props={this.state}/>
            <MemberEdit changeHandler={this.memberChangeHandler} props={this.state}/>
          </div>  
        </div>
        <div className="floatcard field is-grouped">
          <div className="control">
            <button type="button" className="button is-link is-light" onClick={this.deleteEmpty}> <FontAwesomeIcon icon={faArrowLeft} /> Back </button>
          </div>
          <div className="control">
            <button type="submit" disabled={this.state.invalid} className="button is-link" onClick={this.submitForm}>Save Project</button>
          </div>

          <div className="control">
            <button type="button" className="button is-danger is-outlined " onClick={this.deleteProject}>Delete Project</button>
          </div>
        </div>
      </form>
      {this.cropModal()}
    </div>
    }
}
export default ProjectEdit