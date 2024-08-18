import React, { useState, Fragment, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import '../CSS/nav.css'
import { GiHamburgerMenu } from "react-icons/gi";
import {RefreshRequest, logout, GetCSRFToken} from '../actions/auth'
import {connect, useSelector} from 'react-redux'
import Notifier from "./notifier";
import Cookies from "js-cookie";
import Refresher from './alert'

const Navbar = ({logout, RefreshRequest, isAuthenticated, GetCSRFToken}) => {
    const Theme = useSelector((state)=> state.auth.Theme)

    const isManager = useSelector((state) => state.auth.isManager)
    const [timechecker, setTimecheker] = useState(new Date() )
   
    const refreshToken = useSelector(state => state.auth.refresh);

    const [shownav, setshownav] = useState(false)
    const [showScroller, setShowScroller] = useState(true)
    const [showMore,SetshowMore] = useState(false)
    const navstyler = {
        height : shownav ? window.innerWidth < 1024 ? 'fit-content' : '50px' : '0px'
      }

      function ShowNav() {
        setshownav((e) => !e)
        //console.log('called')
    }
    useEffect(() => {




      window.innerWidth >=1024 ? setshownav(true) : ''
      })

      window.addEventListener('scroll', function() {
        //console.log('scrolled')
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          setShowScroller(true)
        } else {
          setShowScroller(false)
        }
      })    
   
    
    function LogoutFunc() {
        const access = localStorage.getItem('access')
        const refresh = refreshToken
        logout()
        function LoaderResponse(data){
            //logout()
        }
        const user = {
            'refresh_token' : refresh
        }
    
        var requestOptions = {
            method: 'POST',
            headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `JWT ${access}`,
                        'Accept' : 'application/json'
                    },
            body : JSON.stringify(user),
            redirect: 'follow'
        };
        //const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/jwt/create/`,config, body );
        fetch(`${import.meta.env.VITE_APP_API_URL}/cred/logout/`, requestOptions)
        .then(response => response.text())
        .then(result => LoaderResponse(result))
    } 

    
     
    const [open, setOpen] = useState(false);



    const Gestlink = () => (
            <Fragment>
                <Link to="/login" className=' lg:my-auto'><li >Sign-In</li></Link>                      
        
            </Fragment>
    )
    const Authlink = () => (

        <Fragment>
            <Link onClick={LogoutFunc} to="/login"><li 
             className=' my-auto lg:my-auto md:bg-blue-600 md:py-1 md:px-2 hover:bg-transparent '>Log-Out</li>
            </Link>
            
            <Link to="/home" className=' lg:my-auto'><li >Home</li></Link>
            <Link to="/chat" className=' lg:my-auto'><li >Chat</li></Link>
            <Link to="/jobs" className=' lg:my-auto'><li >Jobs</li></Link>
            <Link to="/house" className=' lg:my-auto'><li >House</li></Link>
        </Fragment>

    )
    //console.log(isAuthenticated,isManager)
    

    useLayoutEffect(() => {
        if(!Cookies.get('Inject')){
             GetCSRFToken()
        }
    },[])
 
   


    return (
     <div className={`  bg-opacity-100 z-[100%] opacity-100 ${Theme}`}>
        <header className=" w-full bg-white transition-all duration-300 dark:bg-slate-800 border-b-[1px] border-slate-800" >
                    
            <div className=" w-full">
                {<Refresher/>}
            </div>

            <div className='dark:bg-slate-800 transition-all duration-300 dark:text-slate-100 relative  bg-slate-100 opacity-100 bg-opacity-100 z-[100%] text-slate-950' id='universal-container-div'>
                <div className="transition-all duration-300 dark:border-b-sky-600 border-b-[1px]" id='navbar-contaner-div'>
                    <div className=" flex flex-row-reverse justify-around" id='top-nav-div'>
                        <div id='top-nav-icon-div'>
                            <GiHamburgerMenu className=' dark:text-orange-500 z-[100%] cursor-pointer hover:text-sky-700 text-slate-900 text-2xl' onClick={ShowNav} />
                        </div>
                        <div id='top-nav-title-div'>
                            <h1 className=' text-3xl font-bold'> <Link to='/'>B-Intel</Link></h1>
                        </div>

                    </div>
                    <hr className=' md:hidden w-[100%] h-[1px]' />
                    <div   className={`   ${ shownav ? ' min-h-fit flex flex-row ' : 'h-0 z-0  '}  transition-[all]  duration-500 ease-in-out `} id='botton-container-div'>
                        <ul className={` font-semibold transition-[height,all] duration-500  relative ${window.innerWidth > 1024 ? 'my-0' : "my-2"}  ${shownav? '  translate-x-0': ' opacity-0 -translate-x-80 z-0 bg-opacity-0  h-0'} transition-all duration-500 flex flex-col lg:flex-row lg:gap-4 lg:flex-wrap     lg:w-[100%] lg:justify-around  gap-1  `}>
                            
                            { !isAuthenticated ? <Gestlink/> : <Authlink />  }
                          
                        </ul>
                        <span className='  bg-blue-600  w-2'></span>
                    </div>
                </div>

            </div>
        </header>
        

        <div className= {` z-[100%] w-full`}>
                <Notifier />
                
        </div>
    </div>
    )
    


};


const mapStateToProps = state => ({
    isAuthenticated : state.auth.isAuthenticated
})
export default connect(mapStateToProps, {RefreshRequest,logout,GetCSRFToken})(Navbar)