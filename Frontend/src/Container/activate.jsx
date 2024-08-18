import React, { useLayoutEffect, useState } from "react";

import { Navigate } from "react-router-dom";
import {connect, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom';
import { verify } from "../actions/auth";
import Notifier from "../Components/notifier";
const Activate = ({verify}) => {
    const [verified, setverified] = useState(false)
    const { uid, token } = useParams();
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)
   
    const VerifyAccount = e => {
        const uidval = uid
        const tokenval = token
 
        verify(uidval, tokenval)
        setverified(true)
    }

    useLayoutEffect(() => {
       
        if(HmEvent != 'LOADING'){
         
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
          
        }
    },[HmEvent])
    
    // isauthenticated ? redirect to home page
    if (verified) {
        //console.log('your are authenticated in the login sect')

        return <Navigate to="/login" replace />;
    } 

    
    
    
    return(
        <div className=" mb-5 w-full">
           
 
            <div className=" mt-[100px] flex flex-col justify-center align-middle">
            <div className= {` w-fit  `}>
                <Notifier />
            </div>
                <h1 className=" text-3xl  mx-auto text-center font-semibold font-mono py-2  h-fit p-4 w-fit animate-pulse  sm:animate-bounce transition-all duration-700"> Verify Your Account</h1>
                <button disabled={disableBtns} onClick={VerifyAccount} type="button" className=" disabled:bg-gray-500 text-slate-100  disabled:text-black rounded-sm mx-auto p-2 my-2 bg-blue-700 hover:bg-transparent shadow-md hover:shadow-slate-800 border-[1px] hover:border-blue-700 hover:text-blue-700 min-w-[130px] font-bold transition-all duration-500">Verify</button>

            </div>

            

        </div>
    )


};



export default connect(null, {verify})(Activate);