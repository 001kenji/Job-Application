import React, { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "../Components/navbar";
import {CheckAuthenticated, load_user} from '../actions/auth'
import { Link, Navigate } from "react-router-dom";
import {connect, useSelector} from 'react-redux'
import { signupAuth } from "../actions/auth";
import {useForm} from 'react-hook-form' 

import LoginCover from '../assets/images/hm1.jpeg'
import Logo from '../assets/images/hm3.jpeg'
function Signup ({signupAuth, isAuthenticated}) {
    const {register, handleSubmit, watch, formState, getValues} = useForm({
        defaultValues :{
            'name' :'',
            'email':'',
            'password':'',
            're_password':""
        },
        mode : 'all'
    })
    const {errors, isDirty, isValid, isSubmitting} = formState
    const [accountcreated, setaccountcreated] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)

    useEffect(() => {       
        if(HmEvent != 'LOADING'){
            
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
           
        }
    },[HmEvent])
    function SubmitSingup (signupData) {
       if(signupData.password === signupData.re_password){
           // console.log('passoword match')
            signupAuth(signupData.name,signupData.email,signupData.password, signupData.re_password);
            setaccountcreated(true)
        }
    }
    if (isAuthenticated) {
      //  console.log('your are authenticated in the login sect')

        return <Navigate to="/" replace />;
    }
    if(accountcreated){
        //return <Navigate to="/login" replace />;
    }
    function MoveToAdmin() {
        window.open(`${import.meta.env.VITE_APP_API_URL}/admin/`,'_blank')
    }

   
    return (
        <div>
            <div className="  top-0 sticky w-full z-50  border-slate-900">
                <Navbar />
            </div>       
            

            <div className=" z-50 flex flex-col  h-screen min-h-[100%] md:flex-row w-full">
                <div className={` bg-image w-full sm:h-screen relative md:w-[50%] md:h-full h-full sm:min-h-[100%] min-h-[80%]  flex justify-center align-middle`}>
                    <img className=" z-0 w-full h-full" src={LoginCover} title="cover-image"  alt="" />
                    
                    <blockquote className=" z-40 absolute mt-[50%] bg-slate-900 text-slate-100 h-fit my-auto py-3 px-3 bg-opacity-60 p-1  rounded-sm ">
                    <p className=" text-center font-mono font-semibold px-1 text-base md:text-lg">Communication: Where Meaning Meets Momentum.</p>
                    </blockquote>
                    
                    
                    
                </div>
                <div className=" w-full flex flex-col md:w-[50%] md:h-full ">
                        <img  src={Logo} title="school logo" className=" hidden shadow-md shadow-slate-500  rounded-full w-fit h-fit max-w-[300px] max-h-[200px] -p-2 relative mx-auto" alt="" />
                        <h1 className=" text-3xl  mx-auto text-center font-semibold font-mono py-2  h-fit p-4 w-fit"> Login page</h1>
                        <small className=" mx-auto w-fit italic font-semibold">Fill the fields bellow to log in</small>
                        <form noValidate className=" max-w-[800px] shadow-lg shadow-amber-500 flex flex-col min-h-fit gap-4 justify-around w-[90%] border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle" onSubmit={handleSubmit(SubmitSingup)}>
                            
                                <input {...register('email',{
                                    required : 'Email is Required!',
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please enter a valid email',
                                    },
                                })} name="email"  className='mx-auto outline-1 outline-gray-400   border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900  rounded-sm p-2 w-3/4'  placeholder="EMAIL" type="email"  />
                                {errors.email && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] min-w-fit rounded-sm italic text-sm sm:text-base" >{errors.email?.message}</p>}
                                
                                <input {...register('name',{
                                    required :'Username is Required!'
                                })} name="name" className='mx-auto outline-1 outline-gray-400   border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900  rounded-sm p-2 w-3/4'  placeholder="USERNAME" type="text"  />
                                {errors.name && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] italic min-w-fit rounded-sm text-sm sm:text-base" >{errors.name?.message}</p>}
                                <input {...register('password',{
                                    required : 'Password is Required!',
                                    minLength : {
                                        value : 5,
                                        message : 'Input more characters'
                                    }
                                })}  name="password" className='outline-1 outline-gray-400  mx-auto  border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900   rounded-sm p-2 w-3/4'   placeholder="PASSWORD" type="password" />
                                {errors.password && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] italic min-w-fit rounded-sm text-sm sm:text-base" >{errors.password?.message}</p>}
                                <input {...register('re_password',{
                                    required : true,
                                    validate: (val =   string) => {
                                        if (watch('password') != val) {
                                        return "Your passwords do no match";
                                        }
                                    },
                                })}  name="re_password" className='outline-1 outline-gray-400  mx-auto  border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900   rounded-sm p-2 w-3/4'  placeholder="CONFIRM PASSWORD" type="password" />
                                {errors.re_password && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center italic w-[60%] min-w-fit rounded-sm text-sm sm:text-base" >{errors.re_password?.message}</p>}
                                <button disabled={!isDirty || !isValid || isSubmitting || disableBtns} type="submit" className=" transition-all duration-500 disabled:bg-gray-400 rounded-sm mx-auto p-2 min-w-[100px] font-bold shadow-md bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent ">Sign Up</button>
                            </form>

                        <div className="pl-2 text-center flex flex-col sm:flex-row sm:flex-wrap mt-6 w-full justify-around gap-3">
                            <div className=" flex flex-col sm:flex-row gap-3 justify-around w-full">
                            <p className=" font-semibold my-3">Login Admin Panel: <span className=" hover:text-amber-600 cursor-pointer text-red-500 font-semibold underline underline-offset-4" onClick={MoveToAdmin} >Login</span></p>
                            </div>
                            <p className=" font-semibold my-3">Have an account: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/login" > Sign In</Link></p>
                        
                        </div>
                </div>
                
            </div>
        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    

export default connect(mapStateToProps, {signupAuth})(Signup)