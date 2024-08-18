import React, { useLayoutEffect, useState } from "react";
import {CheckAuthenticated, load_user} from '../actions/auth'
import '../App.css'
import Navbar from "../Components/navbar";
import axios from 'axios'
import {connect, useSelector} from 'react-redux'
import { login } from "../actions/auth";
import {useForm} from 'react-hook-form'
import { Link } from "react-router-dom";
import {  Navigate } from "react-router-dom";
import { reset_password } from "../actions/auth";
import LoginCover from '../assets/images/hm1.jpeg'
import Logo from '../assets/images/hm3.jpeg'
const ResetPassword = ({reset_password, isAuthenticated}) => {
    const {register, handleSubmit,formState,getValues} = useForm({
        defaultValues :{
            'email' : ""
        },
        mode :'all'
    })
    const {errors, isDirty, isValid, isSubmitting} = formState
    const [requestsent, setrequestsent] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)

    useLayoutEffect(() => {
       
        if(HmEvent != 'LOADING'){
          
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
            
        }
    },[HmEvent])
    // const [formData, setFrormData] = useState({
    //     email: ''
    // })
    // const {email} = formData;
    // const Change = e => setFrormData({...formData, [e.target.name] : [e.target.value]})
    
    function SubmitRequest(requestData){
       // e.preventDefault()

        //console.log(email[0])
        reset_password(getValues('email'))
        setrequestsent(true)
    }
    
    // isauthenticated ? redirect to home page
    if (isAuthenticated) {
       // console.log('your are authenticated in the login sect')
        return <Navigate to="/login" replace />;
    }

    
    
    
    return(
        <div className=" mb-5 w-full">
              <div className=" top-0 sticky z-50 w-full  border-slate-900">
                <Navbar />
            </div>

            <div className=" flex flex-col h-screen min-h-screen md:flex-row w-full">
                <div className={` bg-image w-full relative md:w-[50%] h-full sm:min-h-[100%] min-h-[70%]  flex justify-center align-middle`}>
                    <img className=" z-0 w-full h-full "  src={LoginCover} title="cover-image"  alt="" />
                    
                    <blockquote className=" bg-slate-900 text-slate-100 absolute mt-[50%] z-40 h-fit my-auto py-3 px-3 bg-opacity-60 p-1  rounded-sm ">
                    <p className=" text-center font-mono font-semibold px-1 text-base md:text-lg">Communication: Where Meaning Meets Momentum.</p>
                    </blockquote>
                    
                    
                    
                </div>
                <div className=" w-full flex flex-col md:w-[50%] ">
                        <img src={Logo} title="school logo"  className=" shadow-md shadow-slate-500  rounded-full w-fit h-fit max-w-[300px] max-h-[200px] -p-2 relative mx-auto" alt="" />
                        <h1 className=" text-3xl mx-auto text-center font-semibold font-mono py-2"> Request Password Reset</h1>

                        <form noValidate className=" shadow-lg shadow-amber-500 flex flex-col min-h-[200px] justify-around w-[90%] border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle" onSubmit={handleSubmit(SubmitRequest)}>
                            <input {...register('email',{
                                required :'Email is Required',
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Please enter a valid email',
                                },
                            })} name="email" className='mx-auto text-ellipsis outline-1 outline-gray-400  text-center  border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900  rounded-sm p-2 w-3/4'   placeholder="EMAIL" type="email"  />
                            {errors.email && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.email?.message}</p>}
                            <button disabled={!isDirty || !isValid || isSubmitting || disableBtns} type="submit" className=" transition-all duration-500 disabled:bg-gray-400 rounded-sm mx-auto p-2 bg-blue-700 hover:bg-transparent shadow-md hover:shadow-slate-800 hover:text-blue-700 border-[1px] hover:border-blue-700 min-w-[100px] font-bold">Request</button>
                        </form>                        

                        <div className="pl-2 flex flex-col sm:flex-row sm:flex-wrap mt-6 w-full justify-around gap-3">
                            <p className=" font-semibold my-3">Have an account: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/login" > Login</Link></p>
                        </div>
                </div>
                
            </div>
        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, {reset_password})(ResetPassword);