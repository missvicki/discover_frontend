 Discover GUI

### Local Development
1. Using docker-compose
  * `docker-compose build` - builds the images. This must be run if we install more npm packages
  * `docker-compose up` - starts the container on port 8080
  * `docker-compose down` - tears down container, run this when done

2. Environment Variables
  * TBD

3. Notes and GOTCHAS for Devs!
  * note that all environment variables **MUST** be prefixed with REACT_APP
  * adding an npm package
    1. start the continaer and run `docker-compose exec app bash`
    2. you now have bash shell inside the container. run `npm install yourPackage --save`
    3. `exit`
    4. you're now outside the container, stop, build, and start the container 
  * axios is handling the base url and token auth globally in the root `index.js`
  ```javascript
    axios.defaults.baseURL = process.env.REACT_APP_DISCOVER_API_HOST 
    axios.defaults.headers.common['Authorization'] = bearerToken();
  ```

### Deployment
* TODO - openshift

sandra comment
