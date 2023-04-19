import React ,{Component} from "react";
import {loginWithDuke} from "../helpers"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from './home';
import SamlConsume from './saml_consume';
import ProjectIndex from "./projects/index"
import UserIndex from "./users/index";
import AboutIndex from "./about/index";
import UniversalSearchResults from "./universal_search_results";
import AdminIndex from "./admin";

class AppRouter extends Component {
  constructor(props){
    super()
  }


  checkAuth = (requestedComponent, route) => {
    if (localStorage.getItem("loggedIn")){
      return requestedComponent 
    }else{
      loginWithDuke();
    }  
  }

  checkAuthProjects = (route) => {
    if (localStorage.getItem("loggedIn")){
      return <ProjectIndex id={route.match.params.id} history= {`/projects/${route.match.params.id}`} />
    }else{
      loginWithDuke();
    }  
  }

  checkAuthUsers = (route) => {
    if (localStorage.getItem("loggedIn")){
      return <UserIndex netid={route.match.params.netid} history= {`/people/${route.match.params.netid}`}/>
    }else{
      loginWithDuke();
    }  
  }

 
  render = () => {
    return (
      <div>
        <Router>
          <div>
            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/admin">
                {this.checkAuth.bind(this, <AdminIndex />)}  
              </Route>

              {/* <Route path="/people">
                {this.checkAuth.bind(this, <UserIndex />)}
              </Route> */}

              <Route path="/projects/:id?" component={ProjectIndex} >
                {this.checkAuthProjects.bind(this)}  
              </Route>

              <Route path="/people/:netid?" component={UserIndex} >
                {this.checkAuthUsers.bind(this)}  
              </Route>
  
              <Route path="/about">
                {this.checkAuth.bind(this, <AboutIndex />)}  
                
              </Route>

              <Route path="/saml_consume">
                  <SamlConsume />
              </Route>

              <Route path="/login_error">
              </Route>
              
              <Route path="/universal_search_results">
                {this.checkAuth.bind(this, <UniversalSearchResults />)}  
              </Route>

              {/* note that due to control flow the root path is at the bottom by design */}
              <Route path="/">
                <Home />
              </Route>

            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default AppRouter;