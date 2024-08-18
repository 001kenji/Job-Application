import React,{useState,Suspense,useEffect,useRef, useLayoutEffect} from "react";
import '../App.css'
import { GiMoonClaws } from "react-icons/gi";
import Navbar from "../Components/navbar";
import { RxSun } from "react-icons/rx";
import { LiaSearchengin } from "react-icons/lia";
import { FaLeaf, FaLink } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaCheckDouble, FaListCheck } from "react-icons/fa6";
import { connect, useDispatch, useSelector } from "react-redux";
import { CheckAuthenticated, logout } from "../actions/auth";
import { ChatListReducer, ChatLogReducer, FindJobsReducer, JobHistoryReducer, MyJobsReducer, ToogleTheme } from "../actions/types";
import { Navigate } from "react-router-dom";
import Fallbackimg from '../assets/images/fallback.jpeg'
import { useForm } from "react-hook-form";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdExit, IoMdMore } from "react-icons/io";
import { FaFileArrowDown } from "react-icons/fa6";
import { UploadFile } from "../actions/Chat";
import { IoMdAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import pendingImg from '../assets/images/pending.png'
import ApprovedImg from '../assets/images/approved.jpg'
import { collapseToast, toast, ToastContainer, useToast } from 'react-toastify';
const Jobs =({logout,isAuthenticated,UploadFile}) => {
    const {register,formState,handleSubmit, getValues,setValue,reset} = useForm({
        defaultValues:  {
            'img' : '',
            'JobTitle' : '',
            'JobCategory' : '',
            'JobStatus' : 'Opened',
            'JobLocation' : '',
            'JobRequirements' : '',
            'JobDescription' : '',
            'ApplicyDeadline' : '',
            'moreInfoRequestJob' : ''
        },
        mode : 'all',
    })
    const [FilterData,SetFilterData]  = useState({
        'date' : '',
        'location' : ''
    })
    const ChatlogContainer = useRef(null)
    const [UploadBlogImg,SetUploadBlogImg] = useState(null)
    const [UploadBlogImgName,SetUploadBlogImgName] = useState('fallback.jpeg')
    const [RequestFileUpload,SetRequestFileUpload] = useState(null)
    const [RequestFileUploadName,SetRequestFileUploadName] = useState('fallback.jpeg')
    const today = new Date()
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // January is 0!
    let dd = today.getDate();
    const MoreInfo = useRef(null)
    const [Readmore,SetReadmore] = useState({
        'show' : false,
        'data' : null,
        'request' : false,
        'MoreInfo' : ''
    })
    const [ReadmoreMyJobs,SetReadmoreMyJobs] = useState({
        'show' : false,
        'data' : null,
    })
    const User = useSelector((state) => state.auth.user)
    const Email = User != null  ? User.email  : ''
    const UserId = User != null  ? User.id  : '' 
    // Pad the month and day if necessary
    mm = mm.toString().length === 1 ? `0${mm}` : mm;
    dd = dd.toString().length === 1 ? `0${dd}` : dd;
    const UploaderFile = useRef(null)
    const RequestUploaderFile = useRef(null)
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const {errors, isValid,isDirty, isSubmitting, isSubmitted} = formState
    const dispatch = useDispatch()
    const [ShowSearch,SetShowSearch] = useState(true)
    const Theme = useSelector((state)=> state.auth.Theme)
    const [FindJobsData,SetFindJobsData] = useState( useSelector((state)=> state.auth.FindJobs))
    const [MyJobsData,SetMyJobsData] = useState( useSelector((state)=> state.auth.MyJobs))
    const [JobHistoryData,SetJobHistoryData] = useState( useSelector((state)=> state.auth.JobHistory))

    const [ShowMoreTools,SetShowMoreTools] = useState(false)
    const [FilterFindJobsData,SetFilterFindJobsData] = useState([])
    const [DispChoice,SetDispChoice] = useState('')
    const WsDataStream = useRef(null)
    const [Show,SetShow] = useState({
        UploadedImg : false,
        UploadedVideo : false,
        UploadedFileName : null,
        UploadedAudio : false,
        VoiceNoteDot : false,
        UploadedFile :false,
        ReplyChatDiv : false,
        ReplyChat : 'null',
        ReplyChatName : 'null'
    })
    const [tooltipVal,SettooltipVal]= useState(null)
    const ChatMessageRef = useRef(null)
    const [Generaldata,SetGeneraldata] = useState({
        'searchVal': "",
        'chatMessage' : ''
        })
    const [ShowApprovalCard,SetShowApprovalCard] = useState(false)
    const WsEvent = useRef(null)
    const WsDataStreamOpened = WsDataStream.current != null ? WsDataStream.current.readyState == 1 ? true : false : false
    const [ShowChatDisp,SetShowChatDisp] = useState(false)
    const [ShowChatComponent,SetShowChatComponent] = useState(false)
    const [DisplayMore,SetDisplayMore] = useState(false)
    const [ChatList,SetChatList] = useState(useSelector((state) => state.chatReducer.ChatList))
    const [ChatLog,SetChatLog] = useState(useSelector((state) => state.chatReducer.ChatLog))
    const [RoomName,SetRoomName] = useState('null')
    const [SenderIdVal,SetSenderIdVal] = useState([])
    const [HeaderLogValChats,SetHeaderLogValChats] = useState({
        'group_name' : 'null',
        'Name' : 'Am Name',
        'about' : 'hey there am new in this chat app',
        'createdOn' : 'null',
        'ProfilePic' : 'null',
        'id' : '',
        'Details' : ''
    })
    const [ApprovedRequetData,SetApprovedRequetData] = useState(null)
    const[IsStartChat,SetIsStartChat] = useState(false)
    function ToogleDispChoice(props) {
        SetDispChoice(props)
         props != 'PostJob' ? requestWsStream(props) : ''
    }
    

    // if(localStorage.getItem('access') == null /*|| db == null*/) {
    //     //console.log('not found')
    //     logout;
    //     return <Navigate to="/login" replace />;
    //  }
    // if (isAuthenticated  && localStorage.getItem('access') == 'undefined') {
    //     return <Navigate to="/login" replace />;
    // }

    function SearchFunc () {

    }
    const SetTheme  = (props) => {
        dispatch({
            type : ToogleTheme,
            payload : props
        }
        )
    }
    const SkeletonArray = [1,2,3,4,5,6,7,8,9,10]
    const SkeletonDiv = SkeletonArray.map((items,i) => {
        return (
            <div key={i} className="flex w-80 p-2 rounded-md md:mx-auto md:my-0 my-auto bg-transparent cursor-pointer transition-all duration-300 flex-col gap-4">
                <div className="skeleton transition-all duration-300 bg-slate-300 dark:bg-slate-600 h-52 min-w-52 w-full"></div>
                <div className="skeleton transition-all duration-300 bg-slate-300 dark:bg-slate-600 h-4 w-32 mx-auto"></div>
            </div>
        )
    })

    useLayoutEffect(() => {
        requestWsStream('open')
    },[])
    useEffect(() => {
        RoomName != 'null' ? CreateChatRoom() : ''
        
    },[RoomName])
    useEffect(() => {
        if(ChatlogContainer.current){
            var Log = ChatlogContainer.current
            Log.scrollTo({
                'top' : Log.scrollHeight ,
                'behavior' : 'smooth',
            })
        }
            
    },[ChatLog])
    function CallCreateChatRoom (room,sender,reciever) {
        SetRoomName(room)
        SetSenderIdVal([sender,reciever])
    }
    
    function ReadmoreMyJobsFunc(props){
    
        if(props){
            SetReadmoreMyJobs((e) => {
                return {
                    ...e,
                    'data' : props[0],
                    'show' : true,
                }
            })
        }

    }
    const requestWsStream = (msg = null,body = null) => {    

        if(msg =='open'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'Opening another socket for less ws jam')

            }
            WsDataStream.current =  new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/chatList/`);

        }

        WsDataStream.current.onmessage = function (e) {
          var data = JSON.parse(e.data)
            
            
            if(data.type == 'PostJob'){
                reset()
                document.getElementById('jobImgBlog').src = ''
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
            }else if(data.type == 'FindJobs'){
                var val = data.message
                SetFindJobsData(val)
                dispatch({
                    type : FindJobsReducer,
                    payload : val
                })
            }else if (data.type == 'RequestJob'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                requestWsStream('FindJobs')
            }else if(data.type == 'DeleteJob'){
                //reset()
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                SetReadmore((e) => {
                    return {
                        'show' : false,
                        'data' : null,
                        'request' : false,
                        'MoreInfo' : ''
                    }
                })
                requestWsStream('FindJobs')
            }else if(data.type == 'MyJobs'){
                var val = data.message
                if(val.length == 0){
                    toast('Oops, no jobs found.', {
                        type: 'warning' ,
                        theme: Theme,
                        position: 'top-center'
                    })
                    SetMyJobsData([])
                }else {
                    SetMyJobsData(val)
                    dispatch({
                        type : MyJobsReducer,
                        payload : val
                    })
                    SetReadmoreMyJobs((e) => {
                        return {
                            'show' : false,
                            'data' : null,
                        }
                    })
                }
            }else if (data.type == 'ReadMore'){
                if(data.message.status){
                    toast(data.message.message, {
                        type: data.message.status ,
                        theme: Theme,
                        position: 'top-center'
                    })
                }else{
                    toast('Success', {
                        type: 'success' ,
                        theme: Theme,
                        position: 'top-center'
                    })
                        ReadmoreMyJobsFunc(data.message)
                }
            }else if (data.type == 'WithdrawRequest'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                DispChoice == 'FindJobs' ? requestWsStream('FindJobs') : DispChoice == 'MyJobs' ? requestWsStream('MyJobs'): ''
            }else if(data.type == 'ApproveRequest'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
            }else if (data.type == 'DoneJob'){
                SetMyJobsData([])
                requestWsStream('MyJobs')
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
            }else if(data.type == 'JobHistory'){
                var val = data.message
                if(val.length == 0){
                    SetJobHistoryData([])
                    toast('Oops no job history.', {
                        type:'warning',
                        theme: Theme,
                        position: 'top-center'
                    })
                    
                }else {
                    SetJobHistoryData(val)
                    dispatch({
                        type : JobHistoryReducer,
                        payload : val
                    })
                }
            }else if (data.type == 'DeleteJobHistory'){
                SetJobHistoryData([])

                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                requestWsStream('JobHistory')
            }
            
        };
        WsDataStream.current.onopen = (e) => {
        
            SetDispChoice((e) => e)
        //   toast('Connection Established', {
        //       type: 'success',
        //       theme: Theme,
        //       position: 'top-right',
        //   })
          if(msg == null){            
            dispatch({
                type : ClearLists
            })
                
            }
            WsDataStream.current.send(
                JSON.stringify({
                    'message' : 'FindJobs',
                    'OpenedDate' : FilterData.date,
                    'location' : FilterData.location,
                 })
            )
        }
        WsDataStream.current.onclose = function (e) {
          //console.log('closing due to :',e)
        //   toast('Connection Closed', {
        //       type: 'error',
        //       theme: Theme,
        //       position: 'top-right',
        //   })
        }
        if(WsDataStream.current.readyState === WsDataStream.current.OPEN){            
      
            if(msg == 'PostJob'){
                toast('Posting...', {
                    type: 'info',
                    theme: Theme,
                    position: 'top-right',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'PostJob',
                        'Details' : body,
                        'email' : User != null ? User.email : 'null',
                        'CreatorsID' : UserId,
                        'OpenedDate' : formattedDate,
                        'location' : getValues('JobLocation'),
                        'imageName' : `${import.meta.env.VITE_WS_API}/media/${UploadBlogImgName}` 
                    })
                )
            }else if(msg == 'FindJobs'){
                // toast('Fetching...', {
                //     type: 'info',
                //     theme: Theme,
                //     position: 'top-right',
                // })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'FindJobs',
                        'OpenedDate' : FilterData.date,
                        'location' : FilterData.location,
                     })
                )
            }else if(msg == 'RequestJob'){
                MoreInfo.current.value = ''
                toast('Processing...', {
                    type: 'info',
                    theme: Theme,
                    position: 'top-right',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestJob',
                        'details' : body,
                     })
                )
            }else if(msg == 'DeleteJob'){
                toast('Deleting...', {
                    type: 'error',
                    theme: Theme,
                    position: 'top-right',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'DeleteJob',
                        'idval' : body[0],
                        'email' : body[1]
                     })
                )
            }else if(msg == 'MyJobs'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'MyJobs',
                        'userID' : UserId,
                        'email' : Email
                     })
                )
            }else if (msg == 'ReadMore'){
                toast('Fetching...', {
                    type: 'info',
                    theme: Theme,
                    position: 'top-right',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'ReadMore',
                        'JobID' : body ,
                        'email' : Email
                    })
                )
            }else if (msg == 'WithdrawRequest'){
                toast('Withdrawing...', {
                    type: 'info',
                    theme: Theme,
                    position: 'top-right',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'WithdrawRequest',
                        'userID' : User != null ? User.id : 'null',
                        'JobID' : body
                    })
                )
            }else if(msg == 'ApproveRequest'){
                toast('Approving...', {
                    type: 'info',
                    theme: Theme,
                    position: 'top-center',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'ApproveRequest',
                        'Details' : ApprovedRequetData,
                        'Email': Email
                    })
                )
            }else if (msg == 'DoneJob'){
                toast('Processing...', {
                    type: 'info',
                    theme: Theme,
                    position: 'top-center',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'DoneJob',
                        'Details' : body,
                    })
                )
            }else if(msg == 'JobHistory'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'JobHistory',
                        'id' : UserId,
                    })
                )
            }else if(msg == 'DeleteJobHistory'){
                toast('Deleting...', {
                    type: 'error',
                    theme: Theme,
                    position: 'top-center',
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'DeleteJobHistory',
                        'Position' : body,
                        'id' : UserId
                    })
                )
            }
        }
        
    }  

    function PostJob(data) {
        if(data.img != ''){
            const formData = new FormData();
            formData.append('file', UploadBlogImg);
            
            formData.append('name',UploadBlogImgName)
            
            UploadFile(formData)
        }
       data.Employer = User != null ? User.name  :'N/A'
       data.EmployerChatId = User != null ? User.id  :'N/A'
       requestWsStream('PostJob',data)
    }
    const FileUpload = () => {
        var File =  UploaderFile.current.files[0] ?  UploaderFile.current.files[0] : null

        if(File){
            
            var imgDis = document.getElementById('jobImgBlog')     
            const render = new FileReader()
                render.onload = function (e) {
                        imgDis.src = e.target.result
                        setValue('img',e.target.result)
                        SetUploadBlogImg(File)
                        SetUploadBlogImgName(File.name)
                    }            
                render.readAsDataURL(File)
        }
    }
    const RequestFileUploadfunc = () => {
        var File =  RequestUploaderFile.current.files[0] ?  RequestUploaderFile.current.files[0] : null

        if(File){
            const render = new FileReader()
                render.onload = function (e) {
                        SetRequestFileUpload(File)
                        SetRequestFileUploadName(File.name)
                    }            
                render.readAsDataURL(File)
        }
    }
    const TriggerUpload = () => {

        RequestUploaderFile.current.click()
    }

    function ReadmoreFunc(props){
        SetReadmore((e) => {
            return {
                ...e,
                'data' : props,
                'show' : true,
                'request' : false,
                'MoreInfo' : ''
            }
        })

    }
    const OpenImage = (props) => {

        window.open(`${import.meta.env.VITE_WS_API}/media/${props}`,'_blank')
    }
    function DownloadFunc (props) {
        const url = `${import.meta.env.VITE_WS_API}/media/${props}`
        const a = document.createElement('a');
        a.href = props;
        a.download =  props;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(props);
        toast('Successfully Downloaded', {
            type: 'success',
            theme: Theme,
            position: 'top-right'
        })
    }
    function CopyChat(props,i) {
        if(props){

            navigator.clipboard.writeText(props).then(() => {
            }).catch(err => {
                console.error('Error:', err);
            });
            SettooltipVal(i)
            setTimeout(() => {
                SettooltipVal(null)
            }, 2000);
        }else {
            return false   
        }
        
    }
    function SetReply(action,msg,name){
        if(action == 'show'){
            SetShow((e) => {
                return {
                ...e,
                'ReplyChat' : msg,
                'ReplyChatDiv' : true,
                'ReplyChatName' : name
                }
            })
        }else if(action == 'close'){
            SetShow((e) => {
                return {
                ...e,
                'ReplyChat' : '',
                'ReplyChatDiv' : false,
                'ReplyChatName' : ''
                }
            })
        }
        
    }
   
    function ControlReadmore (props) {
        if(props == 'close'){
            SetReadmore((e) => {
                return {
                    ...e,
                    'data' : null,
                    'show' : false,
                    'request' : false
                }
            })
        }else if(props == 'request'){
            SetReadmore((e) => {
                return {
                    ...e,
                    'request' :true
                }
            })
        }
    }
    function ControlReadmoreMyJobs (props) {
        if(props == 'close'){
            SetReadmoreMyJobs((e) => {
                return {
                    ...e,
                    'data' : null,
                    'show' : false,
                }
            })
        }
    }

    const InputmoreInfo = (event) => {
        const {name, value} = event.target
        SetReadmore((e) => {
            return {
                ...e,
                [name] :value
            }
        })
    }
    
    function SubmitRequest () {
        var id  = User != null ? User.id : ''
        var data = {
            'chatID' : id,
            'name' : User != null ? User.name : '',
            'MoreDetails' : MoreInfo.current.value,
            'JobId' : Readmore.data.id,
            'UploadedFileName' : RequestFileUploadName != 'fallback.jpeg' ? RequestFileUploadName : '' 


        }
        var x = Readmore.data
        if(x.RequestIDs != null){
             x.RequestIDs.push(id)
        }else{
            x.RequestIDs = [id]
        }
        SetReadmore((e) => {
            return {
                ...e,
                data : x
            }           
        })
        const formData = new FormData();
        
        formData.append('file', RequestFileUpload);
        
        formData.append('name',RequestFileUploadName)
        RequestFileUpload != null ? UploadFile(formData) : ''
        requestWsStream('RequestJob',data)
        SetReadmore((e) => {
            return {
                ...e,
                'request' : false
            }
        })
    }
    const MyjobsReadmoreRequest = (props) => {
        if(props){


            requestWsStream('ReadMore',props)
        }
    }
    const MapperFindJobs = FindJobsData.map((items,i) => {
        var imgsrc = Fallbackimg  // items.Details.img
        var dt = new Date(items.Details.ApplicyDeadline)
        var x = items.RequestIDs
        const requestmade = x != null ?  x.length : 0 
        return (
            <div key={i} className=" flex  min-w-[300px] mx-auto mb-auto hover:shadow-sky-600 dark:hover:shadow-orange-500 shadow-lg md:min-w-[400px] max-w-[300px] md:max-w-[400px] flex-col gap-1 h-fit min-h-fit rounded-sm transition-all duration-500 dark:bg-slate-800 bg-slate-100 ring-1 ring-sky-600 dark:ring-orange-500 p-1">
                <div className=" flex flex-row w-full h-fit min-h-fit gap-2">
                    <div className=" w-[50%] h-32 min-h-fit flex max-h-[200px]  max-w-[50%]">
                        <img className=" max-w-fit w-full h-full" src={`${items.Details.img}`} alt="" />
                    </div>
                    <div className=" text-sm md:text-base flex flex-col  max-w-[50%] gap-2">
                        <input disabled className=" break-words outline-none border-none text-ellipsis bg-transparent " id="PoppinN" value={`Title: ${items.Details.JobTitle}`} />
                        <span>Status: {items.Details.JobStatus}</span>
                        <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit "  value={`Job Location: ${items.Details.JobLocation}`} ></textarea>

                        <span>Request made: {requestmade}</span>
                    </div>
                </div>
                <div className=" my-2 flex flex-col gap-2 pr-2">
                    <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  value={`Application Deadline: ${dt.toLocaleDateString()}`} ></textarea>
                    <textarea readOnly className=" resize-y w-full h-[45px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Requirements: ${items.Details.JobRequirements}`} ></textarea>
                    <textarea readOnly className=" resize-y w-full h-[45px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Description: ${items.Details.JobDescription}`} ></textarea>
                    <button onClick={() => ReadmoreFunc(items)}  className=" transition-all duration-500 disabled:bg-gray-300 rounded-sm ml-auto p-2 border-transparent bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[100px] font-bold hover:text-blue-600">Read More</button>
                </div>

            </div>
        )
    })
    const DeleteJobHistory =(props) => {
        if(props){
            requestWsStream('DeleteJobHistory',props)
        }
    }
    const MapperJobHistory = JobHistoryData.map((items,i) => {
       
        var x = items.RequestIDs 
        var pos = String(i)
        return (
            <div key={i} className=" flex  min-w-[300px] mx-auto mb-auto hover:shadow-sky-600 dark:hover:shadow-orange-500 shadow-lg md:min-w-[400px] max-w-[300px] md:max-w-[400px] flex-col gap-1 h-fit min-h-fit rounded-sm transition-all duration-500 dark:bg-slate-800 bg-slate-100 ring-1 ring-sky-600 dark:ring-orange-500 p-1">
                <div className=" flex flex-row w-full h-fit min-h-fit gap-2">
                    <div className=" w-[50%] h-32 min-h-fit flex max-h-[200px]  max-w-[50%]">
                        <img className=" max-w-fit w-full h-full" src={`${items.Details.img}`} alt="" />
                    </div>
                    <div className=" text-sm md:text-base flex flex-col  max-w-[50%] gap-2">
                        <textarea readOnly className=" resize-y w-fit break-words  max-w-[150px] h-fit min-h-fit  ring-0 max-h-fit outline-none border-none bg-transparent" name="" id="" value={`Title: ${items.Details.JobTitle}`} ></textarea>
                        <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit "  value={`Job Location: ${items.Details.JobLocation}`} ></textarea>

                    </div>
                </div>
                <div className=" my-2 flex flex-col gap-2 pr-2">
                    <p disabled className=" p-0  break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  >{`Employer: ${items.Details.Employer}`} </p>
                    <p disabled className={` ${items.Details.EmployerChatId != UserId ? 'hidden' : ''} p-0  break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm `}  >{`Employees: ${items.Details.Employees}`} </p>
                    <p disabled className=" p-0  break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  >{`Opened On: ${items.OpenedDate}`} </p>
                    <p disabled className=" p-0  break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  >{`Closed On: ${items.ClosedDate}`}</p>
                    <textarea readOnly className=" resize-y w-full h-[45px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Requirements: ${items.Details.JobRequirements}`} ></textarea>
                    <textarea readOnly className=" resize-y w-full h-[55px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Description: ${items.Details.JobDescription}`} ></textarea>
                    <button onClick={() => DeleteJobHistory(pos)}   className= {`flex transition-all duration-500 disabled:bg-gray-300 rounded-sm ml-auto p-1 border-transparent bg-red-600 text-slate-200 hover:border-red-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-red-600 hover:bg-transparent min-w-[60px] font-bold hover:text-red-600 `}>Delete</button>
                </div>

            </div>
        )
    })
    const MapperMyJobs=  MyJobsData.map((items,i) => {
        var imgsrc = Fallbackimg  // items.Details.img
        var dt = new Date(items.Details.ApplicyDeadline)
        
        return (
            <div key={i} className=" flex  min-w-[300px] mx-auto mb-auto hover:shadow-sky-600 dark:hover:shadow-orange-500 shadow-lg md:min-w-[400px] max-w-[300px] md:max-w-[400px] flex-col gap-1 h-fit min-h-fit rounded-sm transition-all duration-500 dark:bg-slate-800 bg-slate-100 ring-1 ring-sky-600 dark:ring-orange-500 p-1">
                <div className=" flex flex-row w-full h-fit min-h-fit gap-2">
                    <div className=" w-[50%] h-32 min-h-fit flex max-h-[200px]  max-w-[50%]">
                        <img className=" max-w-fit w-full h-full" src={`${items.Details.img}`} alt="" />
                    </div>
                    <div className=" text-sm md:text-base flex flex-col  max-w-[50%] gap-2">
                        <input disabled className=" break-words outline-none border-none text-ellipsis bg-transparent " id="PoppinN" value={`Title: ${items.Details.JobTitle}`} />
                        <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit "  value={`Job Location: ${items.Details.JobLocation}`} ></textarea>

                    </div>
                </div>
                <div className=" my-2 flex flex-col gap-2 pr-2">
                    <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  value={`Application Deadline: ${dt.toLocaleDateString()}`} ></textarea>
                    <textarea readOnly className=" resize-y w-full h-[45px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Requirements: ${items.Details.JobRequirements}`} ></textarea>
                    <textarea readOnly className=" resize-y w-full h-[45px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Description: ${items.Details.JobDescription}`} ></textarea>
                    <button onClick={() => MyjobsReadmoreRequest(items.JobID)}  className= {` transition-all duration-500 disabled:bg-gray-300 rounded-sm ml-auto p-2 border-transparent bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[100px] font-bold hover:text-blue-600 `}>Read More</button>
                </div>

            </div>
        )
    })
    function DeleteJob(idval,email){
        var x = [idval,email]
        requestWsStream('DeleteJob',x)
    }
    function OpenInbox(props){
        if(props){
            requestWsStream('MyjobLogChats',props)
        }
        
    }
    function ApproveJobProposal(props){
        props ? console.log('am chatting: ', props): ''
    }
    function DownloadFunc (props) {
        const url = `${import.meta.env.VITE_WS_API}/media/${props}`
        const a = document.createElement('a');
        a.href = props;
        a.download =  props;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(props);
        toast('Successfully Downloaded', {
            type: 'success',
            theme: Theme,
            position: 'top-right'
        })
    }
    function WithdrawRequest(props){
        if(props){
            ControlReadmore('close')
            requestWsStream('WithdrawRequest',props)
        }
    }
    function WithdrawRequestMyJobs(props){
        if(props){
            ControlReadmoreMyJobs('close')
            requestWsStream('WithdrawRequest',props)
        }
    }
    
    const RequestDisplayContainer =(data) =>{
        if(data.data != null){
            return data.data.map((items,i) => {
                return (
                    <div className={` w-full ring-1 flex flex-col gap-2 ring-purple-600 p-1 rounded-sm `} key={i}>
                    <div className=" flex flex-row justify-between px-4 w-full">
                        <span>Name: {items.name}</span>
                        <button className= {` transition-all duration-500 disabled:bg-gray-300 rounded-sm  sm:p-1 border-transparent bg-orange-600 text-slate-200 hover:border-orange-600 border-[1px] dark:text-slate-800 dark:hover:text-orange-600 hover:bg-transparent min-w-[60px] font-bold hover:text-orange-600 `}  onClick={() => OpenInbox(items.chatID)} >Chat</button>

                    </div>
                    <div className= {` flex flex-col justify-between px-1 w-full `}>
                        <span className= {` ${items.UploadedFileName != '' ? 'flex flex-col justify-between px-1 w-full' : ' hidden'} flex flex-row my-2 justify-between px-2 w-full `}>
                            <p>Uploaded File:</p>
                            <span className={`flex align-middle gap-2 flex-row`}>
                                <FaFileArrowDown title="Download File" onClick={() => DownloadFunc(items.UploadedFileName)} className={` text-red-600 min-h-6  sm:min-h-8 cursor-pointer flex sm:text-xl ml-3 rounded-sm `}   />
                                <small onClick={() => DownloadFunc(items.UploadedFileName)} className=" cursor-pointer  underline underline-offset-1 dark:text-amber-200 italic font-mono w-fit my-auto">{items.UploadedFileName}</small>
                            </span>
                        </span>
                        <textarea readOnly className=" resize-y mr-auto w-full h-[65px] min-h-fit  ring-0 max-h-[80px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`More Information: ${items.MoreDetails}`}  ></textarea>
                        <button onClick={() => ApprovalCardFunc('show',items)} className= {` transition-all duration-500 ml-auto mr-2 px-1 my-2 disabled:bg-gray-300 rounded-sm  sm:p-1 border-transparent bg-orange-600 text-slate-200 hover:border-orange-600 border-[1px] dark:text-slate-800 dark:hover:text-orange-600 hover:bg-transparent min-w-[60px] font-bold hover:text-orange-600 `}  >Approve</button>

                    </div>
                </div>
                )
            })
        }else {
            // display information that there are no applicants yet
        }
    }
    const ApprovedDisplayContainer =(data) =>{
        if(data.data != null){
            
            return data.data.map((items,i) => {
                return (
                    <div className={` w-full ring-1 flex flex-col gap-2 ring-purple-600 p-1 rounded-sm `} key={i}>
                    <div className=" flex flex-row justify-between px-4 w-full">
                        <span>Name: {items.name}</span>
                        <button className= {` transition-all duration-500 disabled:bg-gray-300 rounded-sm  sm:p-1 border-transparent bg-orange-600 text-slate-200 hover:border-orange-600 border-[1px] dark:text-slate-800 dark:hover:text-orange-600 hover:bg-transparent min-w-[60px] font-bold hover:text-orange-600 `}  onClick={() => OpenInbox(items.chatID)} >Chat</button>

                    </div>
                    <div className= {` flex flex-col justify-between px-1 w-full `}>
                        <span className= {` ${items.UploadedFileName != '' ? 'flex flex-col justify-between px-1 w-full' : ' hidden'} flex flex-row my-2 justify-between px-2 w-full `}>
                            <p>Uploaded File:</p>
                            <span className={`flex align-middle gap-2 flex-row`}>
                                <FaFileArrowDown title="Download File" onClick={() => DownloadFunc(items.UploadedFileName)} className={` text-red-600 min-h-6  sm:min-h-8 cursor-pointer flex sm:text-xl ml-3 rounded-sm `}   />
                                <small onClick={() => DownloadFunc(items.UploadedFileName)} className=" cursor-pointer  underline underline-offset-1 dark:text-amber-200 italic font-mono w-fit my-auto">{items.UploadedFileName}</small>
                            </span>
                        </span>
                        <textarea readOnly className=" resize-y mr-auto w-full h-[65px] min-h-fit  ring-0 max-h-[80px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`More Information: ${items.MoreDetails}`}  ></textarea>

                    </div>
                </div>
                )
            })
        }else {
            // display information that there are no applicants yet
        }
    }
    
    const WriteGeneraldata = (event) => {
        const {value,name} = event.target 
        SetGeneraldata((e) => {
            return {
                ...e,
                [name] : value
            }
        })
        
    }
    const ReadmoreContainer = () => {
        
        if(Readmore.data){
            var dt = new Date(Readmore.data.Details.ApplicyDeadline)
            var x = Readmore.data.RequestIDs
            var id = User != null ? User.id : ''
            const AcceptedIDs = Readmore.data.AcceptedIDs
            const isApproved = AcceptedIDs != null ?  AcceptedIDs.includes(id) : false 

            const isApplied = x != null ?  x.includes(id) : false 
            const requestmade = x != null ?  x.length : 0 
            const date = Readmore.data.Details.ApplicyDeadline
            const expdate = new Date(date).toLocaleDateString()
            const dateval = new Date().toLocaleDateString()            
            const Expired = dateval  >= expdate  ? true : false
            
            return(
                <section className=" border-[1px] border-blue-600 dark:border-orange-500 w-[90%] mx-auto max-w-[500px] rounded-sm p-1 my-auto h-fit">
                    <div className=" dark:text-slate-100 flex  min-w-full mx-auto m-auto  w-full h-full flex-col gap-1  rounded-sm transition-all duration-500 bg-transparent ring-0 ">
                        <div className=" flex flex-row w-full h-fit min-h-fit gap-2">
                            <div className=" w-[50%] h-32 min-h-fit flex max-h-[200px]  max-w-[50%]">
                                <img className=" w-full max-w-fit h-full" src={Readmore.data ? Readmore.data.Details.img : ''} alt="" />
                            </div>
                            <div className=" text-sm md:text-base flex flex-col  max-w-[50%] gap-2">
                                <textarea disabled className=" p-0 resize-none min-h-fit my-auto break-words outline-none  border-none text-ellipsis bg-transparent h-fit "  value={`Title: ${Readmore.data ? Readmore.data.Details.JobTitle : ''}`} ></textarea>
                                <span>Status: {Readmore.data ? Readmore.data.Details.JobStatus : ''}</span>
                                <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit "  value={`Job Location: ${Readmore.data ? Readmore.data.Details.JobLocation : ''}`} ></textarea>
                                <span>Request made: {requestmade}</span>
                            </div>
                        </div>
                        <div className=" my-2 flex flex-col gap-2 pr-2">
                            <textarea disabled className="  resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  value={`Application Deadline: ${dt.toLocaleDateString()}`} ></textarea>

                            <textarea readOnly className=" resize-y w-full h-[65px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Requirements: ${Readmore.data ? Readmore.data.Details.JobRequirements : '' }`} ></textarea>
                            <textarea readOnly className=" resize-y w-full h-[65px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Description: ${Readmore.data ? Readmore.data.Details.JobDescription : ''}`} ></textarea>
                            
                        </div>
                        <div className= {` ${isApplied || Expired == true  ? " hidden" : ''} my-2 flex flex-col gap-2 pr-2 `}>
                            <button onClick={() => ControlReadmore('request')}  className=  {` ${Readmore.data.email == Email ? 'hidden' : 'flex'} transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[60px] font-bold hover:text-blue-600  `}>Request Job</button>

                        </div>
                        <div className= {` w-[90%] ml-1 mr-auto ring-1 ring-purple-600 rounded-sm p-2 ${Readmore.request && Readmore.data.email != Email  ? 'my-2 flex flex-col gap-2 pr-2' : ' hidden'}  `}>
                            <big className=" underline-offset-4 underline" id="BigProppin" >Request Form</big>

                            <div className=" flex flex-col gap-4 sm:flex-row w-full">
                                <label htmlFor="">Upload File (optional):</label>
                                <input  ref={RequestUploaderFile} onChange={RequestFileUploadfunc} className=" hidden text-sm h-fit my-auto" type="file" />
                                < MdOutlineFileUpload onClick={TriggerUpload} title="upload" className=" hover:text-xl transition-all duration-300 dark:hover:text-lime-500 hover:text-blue-600 cursor-pointer text-lg   my-auto"/>
                                {RequestFileUploadName && <p>{RequestFileUploadName}</p>}
                            </div>
                            <div className=" flex flex-col gap-4 sm:flex-row w-full">
                                <label htmlFor="">More Info(optional):</label>
                                <textarea ref={MoreInfo}  placeholder="More Information"  className=" resize-y w-full h-[65px] min-h-fit sm:w-[60%]  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="MoreInfo" id="MoreInfo"></textarea>
                            </div>
                            <button onClick={SubmitRequest} className=" min-w-[80px] ml-auto my-auto p-1 rounded-sm bg-transparent border-[1px] hover:p-2 transition-all duration-500 hover:text-slate-800  dark:hover:text-purple-700 text-blue-500 border-blue-500" >Submit</button>
                        </div>
                        <div className={`${Readmore.data.email == Email ? 'flex flex-col gap-1' : ' hidden'} `} >
                            <span id="PoppinN" className=" text-lg font-semibold underline underline-offset-4 text-center w-full" >{requestmade} Applicants</span>
                            <div className=" flex flex-col gap-2 p-2 max-h-[250px] overflow-auto" ><RequestDisplayContainer data={Readmore.data.Request}/></div>
                        </div>
                        <div  className={` w-20 my-2 h-20 ${isApplied && !isApproved && Readmore.data.email != Email  ? 'flex' : 'hidden'} `} >
                            <img className=" p-[-1px] w-44 h-32 min-w-fit rounded-full" src={pendingImg} alt="" />
                        </div>
                        <div  className={` w-fit h-fit ${isApproved &&  Readmore.data.email != Email ? 'flex' : 'hidden'} `} >
                            <img className="   p-6 w-44 h-44 min-w-fit  rounded-full" src={ApprovedImg} alt="" />
                        </div>
                        <div className=" my-2 flex flex-row gap-2 px-2 w-full justify-around">
                            <button onClick={() => DeleteJob(Readmore.data.id,Readmore.data.email)}   className= {`${Readmore.data.email == Email ? 'flex' : ' hidden'} transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-red-600 text-slate-200 hover:border-red-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-red-600 hover:bg-transparent min-w-[60px] font-bold hover:text-red-600 `}>Delete Job</button>
                            <button onClick={() => WithdrawRequest(Readmore.data.id)}   className= {`${Readmore.data.email != Email && isApplied == true ? 'flex' : ' hidden'} transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-red-600 text-slate-200 hover:border-red-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-red-600 hover:bg-transparent min-w-[60px] font-bold hover:text-red-600 `}>Withdraw Request</button>
                            <button onClick={() => ControlReadmore('close')}  className=" transition-all duration-500 disabled:bg-gray-300 rounded-sm ml-auto p-1 border-transparent bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[60px] font-bold hover:text-blue-600">Close</button>

                        </div>
                        <div className= {` my-2 ${Expired ? 'flex flex-row' : 'hidden'} gap-2 px-2 w-full justify-around `}>
                            <button onClick={() => ApprovalCardFunc('DoneJob',ExpireDetailsData)}  className=" transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-yellow-500 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[60px] font-bold hover:text-blue-600">Mark Job as Done</button>

                        </div>
                    </div>
        
                </section>
            )
        }else {
            return (
                <div></div>
            )
        }
    }
    async function PastDataText(props) {
        //ChatMessageRef.current.value = props
        
        try {
            const clipboardData = await navigator.clipboard.readText();
            ChatMessageRef.current.value = clipboardData
              SetGeneraldata((e) => {
                    return {
                        ...e,
                        'chatMessage' : clipboardData
                    }
                })
          } catch (error) {
            //console.error('Failed to read clipboard data:', error);
          }
      
    
    }
    function CloseChat () {
        SetShowChatComponent(false)
        if(WsEvent.current != null ){
            //console.log('wsEvent current',WsEvent.current,typeof(WsEvent.current))
            WsEvent.current.close(1000,'Closing Chat')
              
        }
        SetRoomName('null')
    }
    const ReadmoreMyJobsContainer = () => {
        if(ReadmoreMyJobs.data){
            var dt = new Date(ReadmoreMyJobs.data.Details.ApplicyDeadline)
            var x = ReadmoreMyJobs.data.RequestIDs
            const AcceptedIDs = ReadmoreMyJobs.data.AcceptedIDs
            var id = User != null ? User.id : ''
            const isApplied = x != null ?  x.includes(id) : false 
            const isApproved = AcceptedIDs != null ?  AcceptedIDs.includes(id) : false 
            const requestmade = x != null ?  x.length : 0 
            const date = ReadmoreMyJobs.data.Details.ApplicyDeadline
            const expdate = new Date(date).toLocaleDateString()
            const dateval = new Date().toLocaleDateString()            
            const Expired =dateval  >= expdate  ? true : false            

            const ExpireDetailsData = {
                'AcceptedIDs' : AcceptedIDs,
                'Details' : ReadmoreMyJobs.data.Details,
                'OpenedDate' : ReadmoreMyJobs.data.OpenedDate,
                'id' : ReadmoreMyJobs.data.id,
                'ClosedDate' : String(dateval)
            }

            return(
                <section className=" border-[1px] border-blue-600 dark:border-orange-500 w-[90%] mx-auto max-w-[500px] rounded-sm p-1 my-auto h-fit">
                    <div className=" dark:text-slate-100 flex  min-w-full mx-auto m-auto  w-full h-full flex-col gap-1  rounded-sm transition-all duration-500 bg-transparent ring-0 ">
                        <div className=" flex flex-row w-full h-fit min-h-fit gap-2">
                            <div className=" w-[50%] h-32 min-h-fit flex max-h-[200px]  max-w-[50%]">
                                <img className=" w-full max-w-fit h-full" src={ReadmoreMyJobs.data ? ReadmoreMyJobs.data.Details.img : ''} alt="" />
                            </div>
                            <div className=" text-sm md:text-base flex flex-col  max-w-[50%] gap-2">
                                <textarea disabled className=" p-0 resize-none min-h-fit my-auto break-words outline-none  border-none text-ellipsis bg-transparent h-fit "  value={`Title: ${ReadmoreMyJobs.data ? ReadmoreMyJobs.data.Details.JobTitle : ''}`} ></textarea>
                                <span>Status: {ReadmoreMyJobs.data ? ReadmoreMyJobs.data.Details.JobStatus : ''}</span>
                                <textarea disabled className=" p-0 resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit "  value={`Job Location: ${ReadmoreMyJobs.data ? ReadmoreMyJobs.data.Details.JobLocation : ''}`} ></textarea>
                                <span>Request made: {requestmade}</span>
                            </div>
                        </div>
                        <div className=" my-2 flex flex-col gap-2 pr-2">
                            <textarea disabled className="  resize-none min-h-fit break-words outline-none border-none text-ellipsis bg-transparent h-fit text-sm "  value={`Application Deadline: ${dt.toLocaleDateString()}`} ></textarea>

                            <textarea readOnly className=" resize-y w-full h-[65px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Requirements: ${ReadmoreMyJobs.data ? ReadmoreMyJobs.data.Details.JobRequirements : '' }`} ></textarea>
                            <textarea readOnly className=" resize-y w-full h-[65px] min-h-fit  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="" id="" value={`Description: ${ReadmoreMyJobs.data ? ReadmoreMyJobs.data.Details.JobDescription : ''}`} ></textarea>
                            
                        </div>
                        <div className= {` ${ isApplied || Expired == true ? " hidden" : ''} my-2 flex flex-col gap-2 pr-2 `}>
                            <button onClick={() => ControlReadmore('request')}  className=  {` ${ReadmoreMyJobs.data.email == Email ? 'hidden' : 'flex'} transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[60px] font-bold hover:text-blue-600  `}>Request Job</button>

                        </div>
                        <div className= {` w-[90%] ml-1 mr-auto ring-1 ring-purple-600 rounded-sm p-2 ${ReadmoreMyJobs.request && ReadmoreMyJobs.data.email != Email  ? 'my-2 flex flex-col gap-2 pr-2' : ' hidden'}  `}>
                            <big className=" underline-offset-4 underline" id="BigProppin" >Request Form</big>

                            <div className=" flex flex-col gap-4 sm:flex-row w-full">
                                <label htmlFor="">Upload File (optional):</label>
                                <input  ref={RequestUploaderFile} onChange={RequestFileUploadfunc} className=" hidden text-sm h-fit my-auto" type="file" />
                                < MdOutlineFileUpload onClick={TriggerUpload} title="upload" className=" hover:text-xl transition-all duration-300 dark:hover:text-lime-500 hover:text-blue-600 cursor-pointer text-lg   my-auto"/>
                                {RequestFileUploadName && <p>{RequestFileUploadName}</p>}
                            </div>
                            <div className=" flex flex-col gap-4 sm:flex-row w-full">
                                <label htmlFor="">More Info(optional):</label>
                                <textarea {...register('moreInfoRequestJob',{required : false})} placeholder="More Information"  className=" resize-y w-full h-[65px] min-h-fit sm:w-[60%]  ring-0 max-h-[100px] outline-none border-[1px] rounded-sm border-slate-200 dark:border-slate-600 bg-transparent" name="MoreInfo" id="MoreInfo"></textarea>
                            </div>
                            <button onClick={SubmitRequest} className=" min-w-[80px] ml-auto my-auto p-1 rounded-sm bg-transparent border-[1px] hover:p-2 transition-all duration-500 hover:text-slate-800  dark:hover:text-purple-700 text-blue-500 border-blue-500" >Submit</button>
                        </div>
                        <div className={`${ReadmoreMyJobs.data.email == Email ? 'flex flex-col gap-1' : ' hidden'} `} >
                            <span id="PoppinN" className=" text-lg font-semibold underline underline-offset-4 text-center w-full" >{requestmade} Applicants</span>
                            <div className=" flex flex-col gap-2 p-2 max-h-[250px] overflow-auto" ><RequestDisplayContainer data={ReadmoreMyJobs.data.Request}/></div>
                        </div>
                        <div className={`${ReadmoreMyJobs.data.email == Email && AcceptedIDs != null ? 'flex flex-col gap-1' : ' hidden'} `} >
                            <span id="PoppinN" className=" text-lg font-semibold underline underline-offset-4 text-center w-full" >{requestmade} Approved Applicants</span>
                            <div className=" flex flex-col gap-2 p-2 max-h-[250px] overflow-auto" ><ApprovedDisplayContainer data={ReadmoreMyJobs.data.AcceptedRequest}/></div>
                        </div>
                        <div  className={` w-20 h-20 ${isApplied && !isApproved && ReadmoreMyJobs.data.email != Email ? 'flex' : 'hidden'} `} >
                            <img className=" p-[-1px] w-44 h-32 min-w-fit rounded-full" src={pendingImg} alt="" />
                        </div>
                        <div  className={` w-fit h-fit ${isApproved &&  ReadmoreMyJobs.data.email != Email ? 'flex' : 'hidden'} `} >
                            <img className="   p-6 w-44 h-44 min-w-fit  rounded-full" src={ApprovedImg} alt="" />
                        </div>

                        <div className=" my-2 flex flex-row gap-2 px-2 w-full justify-around">
                            <button onClick={() => DeleteJob(ReadmoreMyJobs.data.id,ReadmoreMyJobs.data.email)}   className= {`${ReadmoreMyJobs.data.email == Email && Expired == false ? 'flex' : ' hidden'} transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-red-600 text-slate-200 hover:border-red-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-red-600 hover:bg-transparent min-w-[60px] font-bold hover:text-red-600 `}>Delete Job</button>
                            <button className= {` ${ReadmoreMyJobs.data.email != Email && isApproved ? '' : ' hidden'} transition-all duration-500 disabled:bg-gray-300 rounded-sm  sm:p-1 border-transparent bg-orange-600 text-slate-200 hover:border-orange-600 border-[1px] dark:text-slate-800 dark:hover:text-orange-600 hover:bg-transparent min-w-[60px] font-bold text-center hover:text-orange-600 `}  onClick={() => OpenInbox(ReadmoreMyJobs.data.CreatorsID)} >Chat</button>

                            <button onClick={() => WithdrawRequestMyJobs(ReadmoreMyJobs.data.id)}   className= {`${ReadmoreMyJobs.data.email != Email && isApplied == true && isApproved == false && Expired == false ? 'flex' : ' hidden'} transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-red-600 text-slate-200 hover:border-red-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-red-600 hover:bg-transparent min-w-[60px] font-bold hover:text-red-600 `}>Withdraw Request</button>
                            <button onClick={() => ControlReadmoreMyJobs('close')}  className=" transition-all duration-500 disabled:bg-gray-300 rounded-sm ml-auto p-1 border-transparent bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[60px] font-bold hover:text-blue-600">Close</button>

                        </div>
                        <div className= {` my-2 ${!Expired && ReadmoreMyJobs.data.email == Email ? 'flex flex-row' : 'hidden'} gap-2 px-2 w-full justify-around `}>
                            <button onClick={() => ApprovalCardFunc('DoneJob',ExpireDetailsData,ReadmoreMyJobs.data.AcceptedRequest)}  className=" transition-all duration-500 disabled:bg-gray-300 rounded-sm mr-auto p-1 border-transparent bg-yellow-500 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md dark:text-slate-800 dark:hover:text-sky-500 hover:bg-transparent min-w-[60px] font-bold hover:text-blue-600">Mark Job as Done</button>

                        </div>
                    </div>
        
                </section>
            )
        }else {
            return (
                <div>nodata my jobs</div>
            )
        }
    }
    function ToogleChat() {
        CloseChat()
        if(ShowChatDisp == true){
            SetShowChatDisp(false)
            //SetShowChatComponent(false)
        }else {
            requestWsStream('Chats')
            SetShowChatDisp(true)
            SetShowChatComponent(false)
        }
    }
    const GetNameChats = (props) => {
        if (props){
        var email = User != null ? User.email : 'null'
            for (const key in props) {
                if (key !== email ) {
                  return key;
                }
        }
        }
    }   
    const OpenImagePrivate = (props) => {
        window.open(`${props}`,'_blank')
    }
    
   
    function StartChatFunc(){
        requestWsStream('StartNewChat')
    }
    function ExpandChatComponent(props){
        if(props){
            SetShowChatComponent(true)
            SetDisplayMore(false)
        }
    }
    function ApprovalCardFunc(props,data,extradata = null){
        if(props == 'show'){
            console.log(data)
            SetApprovedRequetData([data,ReadmoreMyJobs.data.id])
            SetShowApprovalCard(true)
            SetReadmoreMyJobs((e) => {
                return {
                    ...e,
                    'show' : false
                }
            })
        }else if(props == 'hide'){
            SetShowApprovalCard(false)
            SetReadmoreMyJobs((e) => {
                return {
                    ...e,
                    'show' : true
                }
            })
        }else if(props == 'approve' ){
            SetShowApprovalCard(false)
            requestWsStream('ApproveRequest')
        }else if(props == 'DoneJob'){
            SetReadmoreMyJobs((e) => {
                return {
                    ...e,
                    'show' : false
                }
            })
            SetReadmore((e) => {
                return {
                    ...e,
                    'show' :false
                }
            })
            var x = data.AcceptedIDs
            x != null ?  x.push(UserId) : ''
            if(x == null){
                x = [UserId]
            }
            data.AcceptedIDs = x
            if(extradata != null){
                var names = ''
               
                for (let x in extradata){
                    var val = extradata[x].name
                    names += `${val}, `
                }
                data.Details.Employees = names
            }

            requestWsStream('DoneJob',data)
        }
    }
    return (
        <div className={` w-full md:h-screen overflow-x-hidden  h-full ${Theme}`}>

            <div className=" overflow-visible w-full h-full  min-h-full">
                <div className="  top-0  md:sticky w-full z-50 bg-transparent  border-slate-900">
                    <Navbar />
                </div>

                <div className=" mb-[1px] shadow-md shadow-orange-800 transition-all duration-700 dark:shadow-sky-500 dark:bg-slate-800 bg-slate-100 flex flex-row w-full justify-around">
                    <div className=" w-fit flex py-2 flex-row">
                            <LiaSearchengin title="Search" onClick={SearchFunc} className={` cursor-pointer w-fit hover:ring-0  hover:text-pink-500 ${!ShowSearch ? ' opacity-100' : ' opacity-100'} transition-all duration-500 text-2xl my-auto text-orange-500 translate-x-6 z-40`}/>
                            <input 
                                onChange={WriteGeneraldata}
                                name="searchVal"
                            className="   bg-slate-800 text-slate-200 dark:text-slate-800 dark:ring-1 dark:bg-slate-200  placeholder:text-slate-400 placeholder:font-semibold pl-6 text-center max-w-[100px] sm:max-w-[200px] outline-none text-ellipsis transition-all duration-500 hover:ring-transparent border-[1px] hover:border-slate-800 z-30 m-auto ring-2 w-fit "
                            placeholder={` Search`}
                            onMouseEnter={() => SetShowSearch(false)}
                            onMouseLeave={() => SetShowSearch(true)}
                            type="text" />

                    </div>
                    <div className=" z-40 flex flex-row py-2 align-middle">
                                <span className=" flex flex-row gap-1 align-middle text-slate-800 dark:text-slate-100">
                                <span onClick={() => SetTheme(Theme == 'light' ? 'dark' : 'light')} className=' overflow-hidden cursor-pointer hover:underline-offset-2  hover:dark:text-amber-500 hover:text-blue-600 flex flex-row gap-2 font-semibold align-middle m-auto justify-around text-center dark:text-slate-100'>Theme:
                                    <p onClick={() => SetTheme(Theme == 'light' ? 'dark' : 'light')} className=' w-fit m-auto'>{Theme == 'light' ? <GiMoonClaws className=' my-auto w-fit animate-pulse mx-auto text-base text-center cursor-pointer hover:animate-spin' onClick={() => SetTheme('dark')}/>  : 
                                    <RxSun className='  my-auto w-fit text-base text-center animate-pulse mx-auto cursor-pointer hover:animate-spin '  onClick={() => SetTheme('light')} />}</p> 
                                </span>
                                </span>
                    </div>                  

                </div>
                <div className=" h-fit  flex flex-col bg-slate-100 dark:bg-slate-800 font-semibold dark:text-slate-100  gap-2 w-full ">
                        <div className=" flex flex-row z-40 w-full  md:align-middle justify-around md:justify-center p-2 sm:gap-4 md:gap-2 gap-2 text-[small] sm:text-sm text-center font-semibold md:text-base">
                                <p className={`hover:text-orange-500 my-auto transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'FindJobs' ? '   animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('FindJobs')} >Find Jobs</p>
                                <p className={` hover:text-orange-500 transition-all duration-300 md:mx-auto my-auto w-fit ${DispChoice == 'PostJob' ? '   animate-pulse cursor-not-allowed autofill  dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('PostJob')}>Post Job</p>                            
                            <div className=" flex flex-row z-40  overflow-x-auto w-1/2 justify-around p-2 sm:gap-4 my-auto  md:justify-around md:gap-2 gap-2 text-[small] sm:text-sm font-semibold md:text-base" >
                                <p className={`hover:text-orange-500 transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'MyJobs' ? '   animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('MyJobs')} >My Jobs</p>
                                <p className={`hover:text-orange-500 transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'JobHistory' ? '   animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('JobHistory')} >Job History</p>
                            </div>
                           
                        </div>

                        <div className={ ` z-40 mb-2 ${DispChoice != 'PostJob' ? 'flex' : 'hidden'} md:flex-row-reverse justify-center flex flex-col gap-2 w-full min-h-screen h-full`}>
                            <Suspense fallback={SkeletonDiv}>
                                <div className= {`   ${DispChoice == 'PostJob' ? 'hidden' : ''} z-40  w-full  justify-around align-middle  flex flex-row  ${(Readmore.show ==  true && DispChoice == 'FindJobs') || (ReadmoreMyJobs.show && DispChoice == 'MyJobs') ? ' px-4 overflow-auto flex-nowrap whitespace-normal  min-h-fit md:w-[50%] w-full max-w-full h-fit  md:mb-auto' : ' min-h-screen flex-wrap md:overflow-y-auto md:flex-row '}  py-6  gap-3 `}>
                                    {DispChoice == 'FindJobs' ? WsDataStreamOpened ? MapperFindJobs : SkeletonDiv : DispChoice == 'MyJobs' ? WsDataStreamOpened ?  MapperMyJobs : SkeletonDiv : DispChoice == 'JobHistory' ? WsDataStreamOpened ? MapperJobHistory : SkeletonDiv : SkeletonDiv } 
                                </div>
                            </Suspense>

                            <div className= {` md:h-fit md:mb-auto md:w-[50%] ${Readmore.show == true && DispChoice == 'FindJobs' ? 'flex' : 'hidden'} bg-slate-100 dark:bg-slate-800 flex flex-col justify-around w-full  h-full my-3 `}>
                                <ReadmoreContainer />
                            </div>
                            <div className= {` md:h-fit md:mb-auto md:w-[50%] ${ReadmoreMyJobs.show == true && DispChoice == 'MyJobs' ? 'flex' : 'hidden'} bg-slate-100 dark:bg-slate-800 flex flex-col justify-around w-full  h-full my-3 `}>
                                <ReadmoreMyJobsContainer />
                            </div>
                        </div>
                                                
                        
                </div>

                
                <div className= {` bg-slate-200 dark:text-slate-100 min-h-screen dark:bg-slate-800  ${DispChoice != 'PostJob' ? 'hidden' : ''} z-40   justify-around align-middle md:overflow-y-auto flex flex-row   overflow-auto w-full py-6 px-4 gap-3 md:flex-col `}>
                        <form noValidate onSubmit={handleSubmit(PostJob)} className=" h-fit min-h-fit p-2 rounded-md w-[95%] mx-auto md:max-w-[700px] ring-2 dark:ring-orange-500  flex flex-col gap-2 justify-around"  >
                            <div className=" w-full flex justify-center mt-0">
                                <big id="BigProppin" >Post a Job</big>
                            </div>    
                            <div className=" w-full flex flex-col sm:flex-row  gap-2 justify-around mt-0">
                                <img nonce='NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwia==' className=" border-[1px] outline-none border-slate-200 w-28 h-28 rounded-lg " src='' id="jobImgBlog" alt="" />
                                <input className=" my-auto h-fit" ref={UploaderFile} onChange={FileUpload} accept="image/*" type="file" />
                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="Title">Job Title :</label>
                                <input
                                {...register('JobTitle',{
                                    required : 'Job title is required.',
                                    minLength : {
                                        value : 5,
                                        message :'Input more characters'
                                    }
                                })}
                                placeholder="Title" id="Title" className=" placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm bg-transparent outline-none ring-1"  type="text" />
                                {errors.JobTitle && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base py-2" >{errors.JobTitle?.message}</p>}

                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="JobCategory">Job Category :</label>
                                <input
                                {...register('JobCategory',{
                                    required : 'Job category is required.',
                                    minLength : {
                                        value : 5,
                                        message :'Input more characters'
                                    }
                                })}
                                placeholder="Job Category" id="JobCategory" className=" placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm bg-transparent outline-none ring-1"  type="text" />
                                {errors.JobCategory && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base py-2" >{errors.JobCategory?.message}</p>}

                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="JobStatus">Job Status :</label>
                                <input
                                 value='Opened'  disabled id="JobStatus" className=" bg-gray-300 dark:bg-gray-500 text-gray-800 dark:text-slate-200 font-semibold cursor-not-allowed placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm  outline-none ring-1"  type="text" />

                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="Jobdeadline">Apply Deadline :</label>
                                <input
                                {...register('ApplicyDeadline',{
                                    required : 'Job deadline is required.',
                                    valueAsDate : true,
                                    
                                    minLength : {
                                        value : 3,
                                        message :'Input more characters'
                                    }
                                })}
                                placeholder="Job Deadline"  id="Jobdeadline" className=" placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm bg-transparent outline-none ring-1" min={formattedDate}  type='date' />
                                {errors.ApplicyDeadline && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base py-2" >{errors.ApplicyDeadline?.message}</p>}

                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="JobLocation">Job Location :</label>
                                <input
                                {...register('JobLocation',{
                                    required : 'Job location is required.',
                                    minLength : {
                                        value : 3,
                                        message :'Input more characters'
                                    }
                                })}
                                placeholder="Job Location" id="JobLocation" className=" placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm bg-transparent outline-none ring-1"  type="text" />
                                {errors.JobLocation && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base py-2" >{errors.JobLocation?.message}</p>}

                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="JobRequirements">Job Requirements :</label>
                                <textarea
                                
                                {...register('JobRequirements',{
                                    required : 'Job requirements is required.',
                                    minLength : {
                                        value : 3,
                                        message :'Input more characters'
                                    }
                                })}
                                placeholder="Job Requirements" id="JobRequirements" className=" min-h-[50px] max-h-[120px] placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm bg-transparent outline-none ring-1"></textarea>
                                {errors.JobRequirements && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base py-2" >{errors.JobRequirements?.message}</p>}

                            </div>
                            <div className=" flex flex-col gap-2 w-full">
                                <label className=" font-semibold cursor-pointer w-fit mr-auto" htmlFor="JobDescription">Job Description :</label>
                                <textarea
                                
                                {...register('JobDescription',{
                                    required : 'Job description is required.',
                                    minLength : {
                                        value : 10,
                                        message :'Input more characters'
                                    }
                                })}
                                placeholder="Job Description" id="JobDescription" className=" min-h-[50px] max-h-[120px] placeholder:text-center placeholder:font-semibold placeholder:text-lg placeholder:font-serif text-ellipsis font-mono rounded-sm bg-transparent outline-none ring-1"></textarea>
                                {errors.JobDescription && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base py-2" >{errors.JobDescription?.message}</p>}

                            </div>

                            <div className=" mt-3 flex w-full justify-center">
                                <button id="submit" disabled={!isDirty || !isValid || isSubmitting } type="submit" className=" disabled:cursor-not-allowed transition-all duration-500 disabled:bg-gray-300 disabled:text-slate-800 rounded-sm mx-auto p-2 bg-blue-700 hover:border-blue-600 border-[1px] border-transparent hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] font-bold hover:text-blue-600">Post</button>

                            </div>
                        </form> 
                </div>
                
              
                <div className= {` dropdown dropdown-top lg:dropdown-right   dropdown-end ml-0 left-[80%] sm:left-[90%]  top-auto md:left-[1%] fixed bottom-2 z-50 `}>
                    {/* <button className={` z-40 float-right right-2 ${showScroller ? ' sticky' : 'hidden'} absolute  bg-blue-600 text-slate-100 p-1 md:text-base text-sm `} ><a href="#navSect"><FaArrowRightLong className=' p-1 text-xl md:text-2xl xl:text-4xl rotate-[270deg]' /></a></button> */}
                    <label tabIndex={0}  role="button" className="btn mr-3 mt-5 mb-auto btn-circle hover:bg-sky-700 bg-slate-800 dark:bg-purple-700 border-none outline-none swap swap-rotate">
  
                    {/* this hidden checkbox controls the state */}
                    <input className=" hidden" type="checkbox" />                  
                    {/* hamburger icon */}
                    <IoMdAdd onClick={() => SetShowMoreTools((e) => !e)} className= {`swap-on  fill-current mx-auto   text-slate-100 font-semibold cursor-pointer text-2xl `} />
                    
                    {/* close icon */}
                    <IoMdClose  onClick={() => SetShowMoreTools((e) => !e)}  className= {` swap-off  fill-current text-slate-100 font-semibold cursor-pointer text-2xl `} />
                    
                    </label>
                    
                </div>
                <div className=" w-full fixed  z-50">
                    <div className={` rounded-sm max-w-[900px]   ${ShowApprovalCard ? 'flex flex-col gap-2' : 'hidden'} top-[50%] bg-opacity-90 fixed md:left-[30%] lg:left-[45%] sm:left-5 p-4 h-fit z-50 transition-all duration-500 bg-slate-900  mx-auto`}>
                        <blockquote className=" text-center text-slate-100 px-1">Once approved it cannot be reversed!</blockquote>
                        <div className=" flex flex-row w-full justify-around ">
                            <button onClick={() => ApprovalCardFunc('hide')} className=" bg-amber-600 font-semibold transition-all duration-300 hover:text-gray-900 hover:bg-slate-100 rounded-sm border-[1px] border-transparent hover:border-amber-600  text-slate-950 cursor-pointer hover:border-transparent  text-sm min-w-[80px] px-2 py-1">Cancel</button>
                            <button onClick={() => ApprovalCardFunc('approve')} className=" bg-gray-500 text-slate-50 hover:text-gray-900 hover:bg-slate-100 transition-all duration-300 hover:font-semibold   text-sm rounded-sm cursor-pointer min-w-[60px] px-2 py-1">Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
const mapStateToProps =  state => ({
    isAuthenticated:state.chatReducer.isAuthenticated
})    


export default connect(mapStateToProps,{CheckAuthenticated, UploadFile,logout})(Jobs)