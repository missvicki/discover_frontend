import React, {Component} from 'react';

class Flash extends Component {
  constructor(props) {
    super()
  }

  setStatus = () => {
    let color = "message ";
    let status = this.props.status;
    if(status === 200 || status === "success"){
      color += "is-primary"
    }else if((status >= 400 && status <= 599 ) || status === "error"){
      color += "is-danger"
    }else if(status === "info"){
      color += "is-info"
    }else if(status === "warning"){
      color += "is-warning"
    }
    return color
  }


  render = () => {
    return(
    <div>
      <article className={this.setStatus()}>
          <div className="message-header">
            <p className="flash-title">{this.props.title}</p>
            <button onClick={this.props.clearFlash} className="delete" aria-label="delete"></button>
          </div>
          <div className="message-body">
            {this.props.message}
          </div>
        </article>
    </div>
    )

  }
}

export default Flash