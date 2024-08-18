import {
    ChatListReducer,
    GroupListReducer,
    ChatLogReducer,
    FAIL_EVENT,
    SUCCESS_EVENT
} from './types'
import Cookies from 'js-cookie'

export const UploadFile = (props) => async dispatch => {
    
     function AuthFunc(props) {
         const data = props != '' ? JSON.parse(props) : ''
        //console.log('data :',data,'props:',props)
         if(!data.failed ) {
             const val = JSON.parse(props)
            //console.log(val)
             dispatch({
                 type : FAIL_EVENT,
                 payload : val
             })

         }else {
         
         }
         
         

     }
     

     try{
     
     var myHeaders = new Headers();
     //myHeaders.append("Content-Type", "application/json");
     myHeaders.append('Accept', 'application/json')
     myHeaders.append('Authorization' , `JWT ${localStorage.getItem('access')}`)
     myHeaders.append("x-CSRFToken", `${Cookies.get('Inject')}`);
     myHeaders.append("Cookie", `Inject=${Cookies.get('Inject')}`);

     
     //console.log('fetching test 2')
     var requestOptions = {
         method: 'post',
         headers: myHeaders,
         redirect: 'follow',
         body : props
       };
     //const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/jwt/create/`,config, body );
     fetch(`${import.meta.env.VITE_APP_API_URL}/chat/upload/`, requestOptions)
     .then(response => response.text())
     .then(result => AuthFunc(result))
     .catch(error => {
         console.error('There has been a problem with your fetch operation:', error);
       
     });
          
      }catch(err) {
         console.log(err)
         
      }



 

}