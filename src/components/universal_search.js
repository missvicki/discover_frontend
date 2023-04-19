import React, {Component} from 'react';

class UniversalSearch extends Component {
  constructor(props){
    super()
    this.state = {searchResults: false, selectedProject: false, selectedUser: false}
    this.searchRef = React.createRef();
  }

  globalSearch = () => {
    
    this.setState({showModal: !this.state.showModal})

    let query = this.searchRef.current
    if(query && query.value!==""){
      window.location.href = "/universal_search_results?query=" + query.value
      return
    }
    return
  }
 
  handleKeyPress = (event) => {
    if(event.key === "Enter"){this.globalSearch()}
  }

  render = () => {
    return(
      <div className={`${this.props.isActive ? 'navbar-item inline' : 'navbar-item searchbar'}`}>
        <div className="searchtext"> 
        <label className={`${this.props.isCollapsed && this.props.isActive ? '' : 'white universalsearch'}`}> What are you looking for today?  </label>
        </div>
        <div className='field has-addons'>
          <div className="control">
            <input className="input is-small" placeholder="search people or projects" onKeyPress={this.handleKeyPress} ref={this.searchRef} type="text" />
          </div>
          <div className="control">
            <button className="button is-gray is-small" onClick={this.globalSearch}>Search</button>
          </div>
        </div>
      </div>

    );
  }
}

export default UniversalSearch