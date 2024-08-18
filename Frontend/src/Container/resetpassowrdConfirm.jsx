import React, { useLayoutEffect, useState } from "react";
import {CheckAuthenticated, load_user} from '../actions/auth'
import '../App.css'
import Navbar from "../Components/navbar";
import axios from 'axios'

import { useParams } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import { Link, Navigate } from "react-router-dom";
import {connect, useSelector} from 'react-redux'
import { matchPath } from "react-router-dom";
import { reset_passoword_confirm } from "../actions/auth";

const ResetPasswordConfirm = ({ match,reset_passoword_confirm}) => {
    const [requestsent, setrequestsent] = useState(false)
    const {register, handleSubmit, watch, formState} = useForm({
        defaultValues :{
            'new_password':'',
            're_new_password': ''
        },
        mode : 'all'
    })

    const {errors, isValid, isDirty, isSubmitting} = formState
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
    //     new_password: '',
    //     re_new_password : ''
    // })
    // const {new_password, re_new_password} = formData;
    // const Change = e => setFrormData({...formData, [e.target.name] : [e.target.value]})
    const { uid, token } = useParams();
    function SubmitResConfirm (dataval) {
        //e.preventDefault()

        // const uid = match.params.uid 
        // const token = match.params.token
        const uidval = uid
        const tokenval = token
        //console.log('dataval is:',dataval)
        //console.log(formData,'TOKEN:',token,'uid',uid, 'passowrd:', new_password, 'renew:', re_new_password)
        reset_passoword_confirm(uidval, tokenval, dataval.new_password, dataval.re_new_password)
        setrequestsent(true)
    }
    
    // isauthenticated ? redirect to home page
    if (requestsent) {
        console.log('your are authenticated in the login sect')

       return <Navigate to="/login" replace />;
    }

    
    
    
    return(
        <div className=" mb-5 w-full">
              <div className=" top-0 sticky w-full  border-slate-900">
                <Navbar />
            </div>
           <h1 className=" text-3xl mx-auto text-center font-semibold font-mono py-2"> Reset Your Password </h1>

            <form noValidate className=" max-w-[700px] shadow-lg shadow-slate-900 flex flex-col min-h-[200px] justify-around w-[90%] border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle" onSubmit={handleSubmit(SubmitResConfirm)}>
                <input {...register('new_password',{
                    required : 'Password is Required!',
                    minLength : {
                        value:5,
                        message :'Input more characters'
                    }
                })} name="new_password"  className='mx-auto  outline-gray-400  border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900  rounded-sm p-2 w-3/4' placeholder="NEW PASSWORD" type="password"  />
                {errors.new_password && <p className=" my-2outline-1 min-w-fit w-[70%] my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center rounded-sm text-sm sm:text-base" >{errors.new_password?.message}</p>}
                <input {...register('re_new_password',{
                    required  :true,
                    validate: (val =   string) => {
                        if (watch('new_password') != val) {
                        return "Your passwords do no match";
                        }
                    },
                })} name="re_new_password" className='outline-1 outline-gray-400  mx-auto  border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900   rounded-sm p-2 w-3/4'    placeholder="CONFIRM NEW PASSWORD"  type="password" />
                {errors.re_new_password && <p className=" my-2 max-w-[600px] min-w-fit w-[70%]  bg-slate-900 text-red-500 font-semibold mx-auto text-center rounded-sm text-sm sm:text-base" >{errors.re_new_password?.message}</p>}
                <button disabled={!isDirty || !isValid || isSubmitting || disableBtns} type="submit" className=" transition-all duration-500 font-semibold disabled:bg-gray-400 rounded-sm mx-auto p-2 bg-blue-700 hover:bg-transparent hover:text-blue-700 border-[1px] hover:border-blue-700 shadow-md hover:shadow-slate-800 min-w-[100px] ">Reset Password</button>
            </form>

          

        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, {reset_passoword_confirm})(ResetPasswordConfirm);