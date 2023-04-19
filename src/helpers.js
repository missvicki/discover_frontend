function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const logErrors = (error)=>{ 
  if (error.response) {
    console.log("ERROR")
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    if(error.response.status === 401){
      loginWithDuke() //<=== this can cause an infinte loop :thinking:
    }else if((error.response.status === 403)){
      alert("You are not authorized to take this action.")
    }
  }
}

export const loginWithDuke = () => {
  let relay = makeid(20)
  let acs = process.env.REACT_APP_SAML_ACS
  let url = "https://shib.oit.duke.edu/idp/profile/SAML2/Unsolicited/SSO?providerId=https://discover.duke.edu&shire=" + acs + "&target=" + relay 
  window.location.href = url;
  return null;
}