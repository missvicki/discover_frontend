import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class InterestEdit extends Component {
  constructor(props){
    super()
    this.state = props.props;
    this.state.hideInterests = false;
  }

  toggleInterests = () => {
    this.setState({hideInterests: !this.state.hideInterests});
  }


  displayHighlights = (highlight, index) => {
    if(highlight.highlight){
        return <div className="floatcard" key={highlight.id}>
        {this.displayIcon(highlight)}
        <label className="card-sub-header label"> name </label>
        <input name="highlights-inte" id={index} defaultValue={highlight.name} className="input" type="text" placeholder={highlight.name} onChange={this.props.highlightchangeHandler.bind(this)}></input> 
        <label className="card-sub-header label"> description </label>
        <input name="highlights-desc" id={index} defaultValue={highlight.description} className="input" type="text" placeholder={highlight.description} onChange={this.props.highlightchangeHandler.bind(this)}></input>
        <FontAwesomeIcon className="membericons fa-lg" icon="trash-alt" onClick={this.deleteHighlight.bind(this,highlight)}/>
        </div>
    }
  }

  displayIcon= (interest) => {
    if(interest.icon){
      return <span className="icon"> <FontAwesomeIcon onClick={this.toggleEdit} icon={interest.icon}/></span>

    }
  }

  displayInterests = (interest, index) => {
    if(!interest.highlight){
      return <div className="columns">
        <input className="column input" name="interests-inte" id={index} key={interest.id} defaultValue={interest.name} type="text" placeholder={interest.name} onChange={this.props.changeHandler.bind(index)}></input> 
        <FontAwesomeIcon className="membericons fa-lg" icon="trash-alt" onClick={this.deleteInterest.bind(this,interest)}/>
    </div>
    }
  }

  addHighlight = () => {
    const arr = this.state.highlights;
    arr.push({name:"", description:"", highlight: true});
    this.setState({
        highlights: arr
    });  
  }

  addInterests = () => {
    const arr = this.state.interests;
    arr.push({name:"", description:"", highlight: false});
    this.setState({
        interests: arr
    });  
}

  mapInterests = () => {
    return(
      <div>
        <div className="floatcard interest" id="interest">
          <h4 className="card-header"> Hightlights </h4>
          
            {this.state.highlights.map((highlight, index) =>
                this.displayHighlights(highlight, index)
            )}
          
          <div className="buttons are-small edit-group">
            <div className="button is-success is-light" onClick={this.addHighlight}> <FontAwesomeIcon icon="plus"/> </div>
          </div>
        </div>
        <div className="floatcard interest">
          <h4 className="card-header"> Other Interests </h4>
          {this.state.interests.map((interest, index) =>
              this.displayInterests(interest, index)
            )}
          <div className="buttons are-small edit-group">
            <div className="button is-success is-light" onClick={this.addInterests}> <FontAwesomeIcon icon="plus"/> </div>
          </div>
        </div> 
      </div>
    )
  }


  interests = () =>{
    if(!this.state.hideInterests){
      if((this.state.interests && this.state.interests.length > 0) || (this.state.highlights && this.state.highlights.length > 0)){
        return this.mapInterests()
      }else{
        return <div className='floatcard tile is-child'>
         <p className="card-header edit-group"> No Interests Added </p>
         <span className="edit-group button is-success is-small is-light" onClick={this.addInterests}> <FontAwesomeIcon icon="plus"/> </span>
        </div>
      }
    }  
  }


  deleteHighlight = (highlight) => {
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

  deleteInterest = (interest) => {
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

  render = () => {
    return <div className="is-child is-vertical">
        <h3 className='section-header link' onClick={this.toggleInterests}> Interests <FontAwesomeIcon icon="angle-down" className="down"/></h3>
        {this.interests(this.state.userAttrs)}
        
      </div>
  }
}
export default InterestEdit