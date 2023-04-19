import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class InterestCard extends Component {
  constructor(props){
    super()
  }

  displayHighlights = (interest, index) => {
    if(interest.highlight){
      return <div className="floatcard" key={index}>
          <h4 className="card-header"> 
            {this.displayIcon(interest)}
            
            {interest.name}
          </h4>
          <p className="highlight-description">{interest.description}</p>
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
      return <li key={index} className="item">{interest.name}</li>
    }
  }

  render = () => {
    return(
      <div>
        <div className="block">
          {this.props.highlights.map((highlight, index) =>
            this.displayHighlights(highlight, index)
          )}
        </div>
        <div className="floatcard">
          <h4 className="card-header"> Other Interests </h4>
          <ul className="list">
            {this.props.interests.map((interest, index) =>
              this.displayInterests(interest, index)
            )}
          </ul>
        </div>
        
      </div>
      
    )
  }
}
export default InterestCard