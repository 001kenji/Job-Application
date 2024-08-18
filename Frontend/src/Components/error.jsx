import React from "react";
import '../App.css'
import { Link } from "react-router-dom";
import wrongcode from '../assets/images/wrongcode.png'
export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false,
       };

    }
    
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      //console.error("Error caught by Error Boundary: ", error, info);
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div className=" flex flex-col md:flex-row bg-slate-100 min-h-screen w-full h-full justify-center align-middle">
              <div className=" md:w-1/2 flex py-3 flex-col bg-transparent justify-center align-middle h-fit min-h-[250px]  gap-4 content-center">
                <img className=" rounded-sm h-fit m-auto min-h-fit w-fit mx-auto" src={wrongcode} />
                <h1 id="BigProppin" className=" text-center w-fit text-xl sm:text-3xl px-1 flex flex-row font-semibold mx-auto text-slate-900  h-fit gap-1">
                  <p className=" text-indigo-600 mx-auto p-0 font-semibold">Oops</p> Something went wrong.</h1>
                  
                  <button onClick={() => window.history.back()} to="/home" className="rounded-md w-fit sm:text-lg mx-auto bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go Back</button>
              </div>
              <div id="woods" className=" min-h-[300px] sm:min-h-[400px] md:w-1/2 w-full">
               
              </div>
            
          </div>
        )

        // You can render any custom fallback UI
        //return this.props.fallback;
      }
  
      return this.props.children;
    }
  }