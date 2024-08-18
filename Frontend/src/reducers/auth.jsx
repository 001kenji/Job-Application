import { useEffect } from 'react';
import Notifier from '../Components/notifier'
import {
LOGIN_SUCCESS,
LOGIN_FAIL,
USER_LOADED_SUCCESS,
USER_LOADED_FAIL,
AUTHENTICATED_FAIL,
AUTHENTICATED_SUCCESS,
LOGOUT,
PASSWORD_RESET_CONFIRM_FAIL ,
PASSWORD_RESET_CONFIRM_SUCCESS,
PASSWORD_RESET_FAIL,
PASSWORD_RESET_SUCCESS,
SIGNUP_SUCCESS,
SIGNUP_FAIL,
ACTIVATION_SUCCESS,
ACTIVATION_FAIL,
REFRESH_SUCCESS,
REFRESH_FAIL,
csrf_SUCCESS,
csrf_FAIL,
LOADING_USER,
SUCCESS_EVENT,
FAIL_EVENT,
NOTIFIER_STATUS,
INTERCEPTER,
ToogleTheme,
FindJobsReducer,
MyJobsReducer,
JobHistoryReducer,
MyHousesReducer,
MyHouseListReducer
}from '../actions/types'
 
const date = new Date()
const min = date.getMinutes()
const initialState = {
    access:  localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated:null,
    isManager : false,
    user : null,
    Expire : null,
    notifierType : 'null',
    notifierMessage : 'null',
    nofifierStatus :true,
    Theme : 'light',
    FindJobs : [],
    MyJobs : [],
    JobHistory : [],
};
//console.log(min)
// the function bellow can be imported from any file using any name since we have exported it as default and we have not assigned a name to it

export default function (state = initialState, action) {

  
    const { type, payload} = action;
        // {<Notifier   />}
       
    const currentTime = new Date();
        const minutesToAdd = 1;
        const newTime = new Date(currentTime);
        newTime.setMinutes(currentTime.getMinutes() + minutesToAdd);

        //console.log('fired')
    switch (type) {
        
        case LOGIN_SUCCESS: 
        localStorage.setItem('access', payload.access)
        
        //console.log('written data - access:', localStorage.getItem('access'))
        //console.log('data writen refresh :',payload.refresh)
            return {
                ...state,
                isAuthenticated : true,
                access :payload.access,
                refresh :payload.refresh,
                Expire : newTime.toLocaleTimeString(),
                notifierType : 'SUCCESS',
                notifierMessage : 'LOGIN SUCCESS'
            }
        case REFRESH_SUCCESS:
            localStorage.setItem('access', payload.access)
            return{
                ...state,
                access: payload.access,
                Expire: newTime.toLocaleTimeString(),                
                notifierType : 'SUCCESS',
                notifierMessage : 'SUCCESS'
            }
        case USER_LOADED_SUCCESS:
            //{<home profile={initialState}   />}
            //console.log('data manager:', payload.is_active)
            
            return {
                ...state,
                user: payload,
                isManager : payload.is_staff
            }
        
        case AUTHENTICATED_SUCCESS :
            return {
                ...state,
                isAuthenticated : true
            }
        case AUTHENTICATED_FAIL :
            return {
                ...state,
                isAuthenticated : false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null

            }
        case LOGIN_FAIL:
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: null,
                refresh: null,
                access:null,
                user: null,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'FAIL'
            }
        case ToogleTheme:
            return {
                ...state,
                Theme : payload
            }
        case LOGOUT:
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state,
                isAuthenticated: null,
                refresh: null,
                access:null,
                user: null,
                Expire : null,
                notifierType : 'SUCCESS',
                notifierMessage : 'LOGOUT SUCCESS'

            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,                
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'SIGNUP SUCCESS'
            }
        case LOADING_USER : 
            return {
                ...state,
                notifierType : 'LOADING',
                notifierMessage : payload ? payload : 'Loading ...',
                nofifierStatus : false
            }
        case NOTIFIER_STATUS:
            
            return {
                ...state,
                nofifierStatus : payload
            }
        case REFRESH_FAIL:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'FAIL'
            }
        case SUCCESS_EVENT:
            
            return {
                ...state,
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'SUCCESS'
            }
        case FAIL_EVENT:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'FAIL'
            }
        case SIGNUP_FAIL:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'SIGNUP FAIL'
            }
        case PASSWORD_RESET_CONFIRM_FAIL:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'CONFIRM RESET FAIL'
            }
        case PASSWORD_RESET_CONFIRM_SUCCESS:
            return {
                ...state,
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'CONFIRM RESET SUCCESS'
            }
        case PASSWORD_RESET_FAIL:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'Request fail to change password'
            }
        
        case PASSWORD_RESET_SUCCESS:
            return {
                ...state,
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'Check your email to change password'
            }
        case ACTIVATION_SUCCESS:
            return {
                ...state,
                notifierType : 'SUCCESS',
                notifierMessage : payload ? payload : 'ACTIVATION SUCCESS'
            }
        case ACTIVATION_FAIL:
            return {
                ...state,
                notifierType : 'FAIL',
                notifierMessage : payload ? payload : 'ACTIVATION FAIL'
            }
        case INTERCEPTER:
            return {
                ...state,
                notifierType : state.notifierType == 'LOADING' ? 'LOADING' :'INTERCEPT',
                notifierMessage : state.notifierMessage == 'LOADING' ? 'LOADING' :'null'
            }
        case csrf_SUCCESS:
            return {
                ...state,
                notifierType : state.notifierType == 'LOADING' ? 'LOADING' :'INTERCEPT',
                notifierMessage : state.notifierMessage == 'LOADING' ? 'LOADING' :'null'
            }
        case csrf_FAIL:
            return {
                ...state,
                notifierType : state.notifierType == 'LOADING' ? 'LOADING' :'INTERCEPT',
                notifierMessage : state.notifierMessage == 'LOADING' ? 'LOADING' :'null'
            }
        case FindJobsReducer:
            return {
                ...state,
                FindJobs : payload
            }
        case JobHistoryReducer:
            return {
                ...state,
                JobHistory : payload
            }
        case MyJobsReducer:
            return {
                ...state,
                MyJobs : payload
            }
        
        default:
            return state
    }

   
}