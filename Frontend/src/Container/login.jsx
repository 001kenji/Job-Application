import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {CheckAuthenticated, load_user} from '../actions/auth'
import '../App.css'
import Navbar from "../Components/navbar";
import axios from 'axios'
import { Link, Navigate } from "react-router-dom";
import {connect, useSelector} from 'react-redux'
import { login } from "../actions/auth";
import bcrypt from 'bcryptjs'
import {useForm} from 'react-hook-form'
import LoginCover from '../assets/images/hm1.jpeg'
import Logo from '../assets/images/hm3.jpeg'
import { toast, ToastContainer } from 'react-toastify';
const Login = ({login, testFetch,isAuthenticated}) => {
    const {register, formState, handleSubmit, getValues, setValue} = useForm({
        defaultValues :{
            'email': "",
            'password' : ''
         },
         mode :'all'
    })
    const Theme = useSelector((state) => state.auth.Theme)
    const {errors, isValid,isDirty, isSubmitting, isSubmitted} = formState
    const [islogedin,setislogedin] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const LgEvent  = useSelector((state) => state.auth.notifierType)
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        if(LgEvent != 'LOADING'){
          
            setDisableBtns(false)
        }else if(LgEvent == 'LOADING'){
            setDisableBtns(true)
            
        }
    },[LgEvent])
   
    
    function SubmitLogin(userdata){
        //console.log(getValues('email'))
        //login(getValues('email'), hashedpassword)
        
        login(getValues('email'), getValues('password'))
        setislogedin(true) 

        if(isSubmitted){
            setDisableBtns(false)
        }
    }
    
    const RememberMe = (event) => {
       const {value,checked} = event.target 
       setIsChecked(checked);
       return
      if(checked) {
        if ('PasswordCredential' in window) {
            const cred = new PasswordCredential({
              id: getValues('email'),
              password: getValues('password')
            });
    
            navigator.credentials.store(cred)
              .then(() => {
                //console.log('Credentials stored successfully');
                // Redirect or handle successful login
              })
              .catch(error => {
                //console.error('Error storing credentials:', error);
              });
          } else {
            //console.warn('PasswordCredential API not supported');
          }
      }
    }

    // isauthenticated ? redirect to home page
    if (isAuthenticated && localStorage.getItem('access') != 'undefined') {
       // console.log('your are authenticated in the login sect', isAuthenticated)

        return <Navigate to="/chat" replace />;
    }

    function MoveToAdmin() {
        window.open(`${import.meta.env.VITE_APP_API_URL}/admin/`,'_blank')
    }

  
    return(
        <div className=" overflow-visible w-full h-full  min-h-full">
              <div className="  top-0 sticky w-full z-50  border-slate-900">
                <Navbar />
            </div>
            
           
            <div className=" z-40 flex flex-col  h-screen min-h-[100%] md:flex-row w-full">
                <div className={` bg-image w-full sm:h-screen relative md:w-[50%] md:h-full h-full  sm:min-h-[100%] min-h-[80%]  flex justify-center align-middle`}>
                    <img className=" z-0 w-full h-full" src={LoginCover} title="cover-image"  alt="" />
                    
                    <blockquote className=" z-40 absolute mt-[50%] bg-slate-900 text-slate-100 h-fit my-auto py-3 px-3 bg-opacity-60 p-1  rounded-sm ">
                    <p className=" text-center font-mono font-semibold px-1 text-base md:text-lg">Communication: Where Meaning Meets Momentum.</p>
                    </blockquote>
                    
                    
                    
                </div>
                <div className=" w-full flex flex-col md:w-[50%] md:h-full ">
                        <img  src={Logo} title="school logo" className=" shadow-md shadow-slate-500  rounded-full w-fit h-fit max-w-[300px] max-h-[200px] -p-2 relative mx-auto" alt="" />
                        <h1 className=" text-3xl  mx-auto text-center font-semibold font-mono py-2  h-fit p-4 w-fit"> Login page</h1>
                        <small className=" mx-auto w-fit italic font-semibold">Fill the fields bellow to log in</small>
                        <form noValidate className=" max-w-[800px] gap-4 min-h-fit shadow-lg shadow-amber-500 flex flex-col  justify-around w-[90%] border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle" onSubmit={handleSubmit(SubmitLogin)}>
                            
                            <input id='email' {...register('email',{
                                    required : 'Email is Required!',
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please enter a valid email',
                                    },
                                })} name="email"  className='mx-auto outline-1 outline-gray-400   border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900  rounded-sm p-2 w-3/4'  placeholder="EMAIL" type="email"  />
                            {errors.email && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] min-w-fit rounded-sm italic text-sm sm:text-base" >{errors.email?.message}</p>}
                                
                            <input {...register('password',{
                                required : 'Password is required!',
                                minLength : {
                                    value : 5,
                                    message :'Input more characters'
                                }
                            })}  id="password" className='outline-1 outline-gray-400  mx-auto  border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900   rounded-sm p-2 w-3/4'   placeholder="PASSWORD" type="password" />
                            {errors.password && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.password?.message}</p>}
                            <div className="form-control w-fit md:mr-4 ml-auto font-semibold">
                            <label className="label cursor-pointer">
                                <span className="label-text font-semibold mx-3">Remember me</span>
                                <input checked={isChecked} onChange={RememberMe} type="checkbox"  className="checkbox rounded-md checkbox-secondary" />
                            </label>
                            </div>
                            <button id="submit" disabled={!isDirty || !isValid || isSubmitting } type="submit" className=" transition-all duration-500 disabled:bg-gray-300 rounded-sm mx-auto p-2 bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] font-bold hover:text-blue-600">Login</button>
                        </form>

                        <div className="pl-2 text-center flex flex-col sm:flex-row sm:flex-wrap mt-6 w-full justify-around gap-3">
                            <div className=" flex flex-col sm:flex-row gap-3 justify-around w-full">
                            </div>
                            <p className=" font-semibold my-3">Login Admin Panel: <span className=" hover:text-amber-600 cursor-pointer text-red-500 font-semibold underline underline-offset-4" onClick={MoveToAdmin} >Login</span></p>

                            <div className=" flex flex-col sm:flex-row w-full justify-around">
                                <p className=" font-semibold my-3">Forgot password: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/reset_password" > Reset password</Link></p>
                                <p className="font-semibold my-3">Dont have an account: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/signup" >Sign up</Link></p>
                        
                            </div>
                        </div>
                </div>
                
            </div>
           

        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, {login})(Login);