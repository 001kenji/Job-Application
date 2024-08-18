import React, { Profiler, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "../Components/navbar";
import '../App.css'
import { connect, useDispatch } from "react-redux";
import { CheckAuthenticated, logout, load_user } from "../actions/auth";
import {useSelector} from 'react-redux'
import { Link, Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
//hashing using bcrypt for javascript only and not py
import bcrypt from 'bcryptjs'

// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const Home = (props, {logout, isAuthenticated}) => {
    const dispatch = useDispatch()
    const db = useSelector((state) => state.auth.user)
    const [homeauthorized, setHomeauthorized] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)
    const [getUser,setGetUser] = useState(true)
    const ScrollBtn = useRef()
    //console.log(profile)
    ///console.log(isAuthenticated)
    if (isAuthenticated  && localStorage.getItem('access') == 'undefined') {
       ///console.log('your are not authenticated in the login sect', isAuthenticated)

        return <Navigate to="/login" replace />;
    }

    useLayoutEffect(() => {
        if(HmEvent != 'LOADING'){        
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
           
        }
    },[HmEvent])
   
    useEffect(() => {
        if(getUser){
            props.CheckAuthenticated();
            props.load_user();
            setHomeauthorized(true)
            setGetUser(false) 
        }
           
    },[])


       if(localStorage.getItem('access') == null /*|| db == null*/) {
        //console.log('not found')
        logout;
        return <Navigate to="/login" replace />;
     }
   
   
    return (
         <div className=" relative">
            <div className=" top-0 sticky w-full z-50  border-slate-900">
                <Navbar />
            </div>
            <p className=" text-2xl ml-10 my-4" id="myFont" >Am home page</p>
            
        </div>
    )
   


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps, {CheckAuthenticated, logout,load_user})(Home)
