//import Button from 'react-bootstrap/Button';
import '../css/login.css';
import  { Navigate} from 'react-router-dom'
import React, { useState } from 'react';


const apiBaseUrl = "http://localhost:3000";

function AlreadyLoggedIn()
{
  const [logged, setLogged] = useState(0);
  fetch(`${apiBaseUrl}/me`, {withCredentials: true})
  .then(
    res => {
      if(res.status === 200)
        setLogged(true)
      else 
        setLogged(false)
    }
  )
  .catch(err => {
    console.log(err)
  })
  return logged;
}
export function Login() {
  if(AlreadyLoggedIn() ===  true)
    return <Navigate to="/home" replace={true}/>
  else{
     return (
        <div className="justify-content-center fadeInDown">
        <div id="formContent">
            <div className="fadeIn first">
            <img src="https://raw.githubusercontent.com/InigoRomero/42ItTest/main/42Icon.jpeg?token=AK5DQMZPDGPOKG2TZ3CF6XDATK74Y" id="icon" alt="User Icon" />
            </div>
            <div>
                {/* <a href="http://localhost:4200/home">Home</a> */}
            </div>
            <div id="formFooter">
            <a href={`${apiBaseUrl}/login`} className="underlineHover"> Login </a>
            </div>
        </div>
      </div>
    );
  }
}



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export function Login() {
//   const [pageViews, setPageViews] = useState(0);

//   const fetchPageViews = () => {
//     // Define the backend URL
//     const backendUrl = 'http://localhost:3001';

//     // Make a GET request to the backend
//     axios.get(`${backendUrl}/`, { withCredentials: true }).then((response) => {
//       // Update the page views state with the data from the response
//       console.log(response.data)
//       setPageViews(response.data);
//     });
//   };

//   return (
//     <div className="App">
//       <h1>Page Views</h1>
//       <p>{`You visited this page ${pageViews} times`}</p>
//       <button onClick={fetchPageViews}>Fetch Page Views</button>
//     </div>
//   );
// };