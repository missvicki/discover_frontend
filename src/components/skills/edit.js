import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class SkillEdit extends Component {
  constructor(props) {
    super()
    this.state = props.props
    this.state.showModal = false;
    this.state.hideSkills = false;
  }

  toggleSkills = () =>{
    this.setState({hideSkills: !this.state.hideSkills})
  }


  displayCheckbox = (allSkill, bucket) => {    
    if(this.state.skillIds.includes(allSkill.id)){
      return <input type="checkbox" defaultChecked value={allSkill} onClick={() => this.modifySkill(allSkill, bucket)}/>
    }
    return <input type="checkbox" value={allSkill} onClick={() => this.modifySkill(allSkill, bucket)}/>
  }

  modifySkill = (allSkill, bucket) => {
    let skillIds = this.state.skillIds
    let delSkillIds = this.state.delSkillIds
    let skills = this.state.buckets[bucket.id-1].skills
    if(!skillIds.includes(allSkill.id)){
      skillIds.push(allSkill.id);
      skills.push(allSkill);
      if(delSkillIds.includes(allSkill.id)){
        delSkillIds.splice(delSkillIds.indexOf(allSkill),1)
      }
    }else{
      skillIds.splice(skillIds.indexOf(allSkill.id),1)
      skills.splice(skills.findIndex(skill => skill.id === allSkill.id),1)
      if(!delSkillIds.includes(allSkill.id)){
        delSkillIds.push(allSkill.id);
      }
    }
    if(skillIds.length > 0){
      this.setState({noProjectSkills: false})
    }else{
      this.setState({noProjectSkills: true})
    }
  }

  mapSkills = (bucket) => {
    if(this.state.showModal){
      return bucket.skills.map((allSkill, index) =>
          <label key={index} className="checkbox item">
            {this.displayCheckbox(allSkill, bucket)}
            {allSkill.name}
          </label>)
    }else {
        return bucket.skills.map((skill, index) => this.displayName(skill, index))
    }
  }

  displayName = (skill, index) => {
    if(!this.state.skillIds.includes(skill.id)){
      this.state.skillIds.push(skill.id);
    }
    return <li className="item" key={index}>{skill.name}</li>
  }

  displayIcon = (icon) => {
      return <span className="icon"> <FontAwesomeIcon onClick={this.toggleEdit}  icon={icon} /></span>  
  }

  displayBucket = (bucket, index) => {
    if(bucket.skills.length>0){
      return <div className='floatcard' key={index}>
        <h4 className='card-header'>
          {this.displayIcon(bucket.logo)}
          {bucket.name}
        </h4>
        <ul className='list'>
          {this.mapSkills(bucket)}
        </ul>
      </div>
    }
  }

  displayEditModal = () => {
    if(!this.state.hideSkills){
      if(this.state.showModal){
        return <div className="modal is-active">
          <div className="modal-background">
            <div className="modal-content">
              <header className="modal-card-head">
                <p className="modal-card-title">Edit Skills</p>
              </header>
              <section className="modal-card-body">
              {this.state.allBuckets.map((bucket, index) => this.displayBucket(bucket, index))}
              </section>
              <footer className="modal-card-foot">
                <button type="button" onClick={this.toggleModal} className="button is-success">Save changes</button>
              </footer>
            </div>
          </div> 
        </div>
      }
      if (this.state.buckets){
        if(this.state.noProjectSkills){
          return <div className='floatcard tile is-child'>
            <h4 className='card-header'>No Skills Added</h4>
          </div>
        }
        return this.state.buckets.map((bucket, index) => this.displayBucket(bucket, index))
      }
    }
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal})
  }

  render = () => {
    return <div className="is-child is-vertical">
      <div className="inline">
        <h3 className='section-header link' onClick={this.toggleSkills}>Skills <FontAwesomeIcon icon="angle-down" className="down"/></h3>
        <p className="button is-yellow-outline is-small space-left" onClick={this.toggleModal}>Edit</p>    
      </div>
      {this.displayEditModal()}
    </div>
  }
}
export default SkillEdit