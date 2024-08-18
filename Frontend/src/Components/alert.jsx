import React,{useEffect,useLayoutEffect,useState, useTransition} from "react";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RefreshRequest,CheckAuthenticated,logout } from "../actions/auth";
import { LOGOUT } from "../actions/types";
import {useInterval, useTimeout} from 'react-use'


const Refresher =({isAuthenticated,RefreshRequest,logout}) =>{
    const dispatch = useDispatch()
    const [showAlert, setShowAlert] = useState(false)
    const refreshToken = useSelector((state) => state.auth.refresh);
    const [AlertShown,setAlertShown] = useState(false)
    const [PauseTimmer,SetPauseTimmer] = useState(false) 
    function RunRefresh(props){

        if(props == 'Extend'){
            setShowAlert(false)
            setAlertShown(false)
            SetPauseTimmer(false)
            RefreshRequest(refreshToken)
        }else if (props == 'cancel'){
            setShowAlert(false)
            setAlertShown(false)
            SetPauseTimmer(false)
            dispatch({
                type : LOGOUT
            })
        }
    }  

    function EnableAlert() {
    if(!AlertShown  && isAuthenticated ){
            setShowAlert('true')
            setAlertShown(true)
            SetPauseTimmer(true)
        }else{
            SetPauseTimmer(true)
        }        
        
    }
    // 30 min = 1800,000 ms
    useInterval(EnableAlert, PauseTimmer ? null : 1800000)
     
    
    useEffect(() => {
        if(showAlert != 'true'){
            isAuthenticated ? SetPauseTimmer(false) : ''
        }
      
    },[isAuthenticated])


    
    return (
        <>
            <div className={` rounded-sm max-w-[900px]   ${showAlert ? 'flex flex-col gap-2' : 'hidden'} bg-opacity-90 fixed top-4 left-5 p-4 h-fit z-50 transition-all duration-500 bg-slate-900  mx-auto`}>
                <blockquote className=" text-center text-slate-100 px-1">Your session is about to timeout, Do you want to extend your current session ?</blockquote>
                <div className=" flex flex-row w-full justify-around ">
                    <button onClick={() => RunRefresh('Extend')} className=" bg-amber-600 font-semibold transition-all duration-300 hover:text-gray-900 hover:bg-slate-100 rounded-sm border-[1px] border-transparent hover:border-amber-600  text-slate-950 cursor-pointer hover:border-transparent  text-sm min-w-[80px] px-2 py-1">Extent Session</button>
                    <button onClick={() => RunRefresh('cancel')} className=" bg-gray-500 text-slate-50 hover:text-gray-900 hover:bg-slate-100 transition-all duration-300 hover:font-semibold   text-sm rounded-sm cursor-pointer min-w-[60px] px-2 py-1">Logout</button>
                </div>
            </div> 
        </>
    )
}

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
}) 

export default connect(mapStateToProps,{RefreshRequest,logout})(Refresher)