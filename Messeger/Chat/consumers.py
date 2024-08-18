# chat/consumers.py
import json,datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Account,RequestJobTable, JobsTable
from channels.db import database_sync_to_async
from django.core.files.storage import default_storage
from django.db.models import Q
from .models import sanitize_string
#from ..Messeger.settings import redisConnection

@database_sync_to_async
def PostJobFunc(CreatorsID,email,location,OpenedDate,Details,imageName):
    if location != '' and OpenedDate != '' and Details != '' and email != 'null':
       imageName = sanitize_string(imageName)
       Details['img'] = imageName
       email = sanitize_string(email)
       location = sanitize_string(location)
       OpenedDate = sanitize_string(OpenedDate)
       Details['requests'] = 0
       x = JobsTable.objects.create(CreatorsID =CreatorsID,email = email,location = location,OpenedDate =OpenedDate,Details = Details)
       JobsTable.save
       RequestJobTable.objects.create(email = email,JobID = x.id,Details = Details)
       responseval =  {'status' : 'success','message' : 'Job Posted Successfuly'}
    else:
       responseval =  {'status' : 'error','message' : 'Invalid Data'}

    return responseval


@database_sync_to_async
def FindJobsFunc(location,OpenedDate):
    if location != '' and OpenedDate != '' and OpenedDate != '':
        data = list(JobsTable.objects.filter(Q(OpenedDate=OpenedDate) | Q(location=location) ).values())    
        return data
    else:
        data = list(JobsTable.objects.all().values())    

        #responseval =  {'status' : 'error','message' : 'Invalid Data'}
        return data


@database_sync_to_async
def RequestJobFunc(details):
    if details['chatID'] != '' and details['name'] != '' and details['JobId'] != '' :
        id = sanitize_string(details['JobId'])
        data = JobsTable.objects.filter(id = id)
        if not data:
            responseval =  {'status' : 'warning','message' : 'Job not found or was deleted.'}
            return responseval
        listdata = list(data.values())
        if listdata[0]['RequestIDs'] != None:
            x = listdata[0]['RequestIDs']
            if details['chatID'] in x: 
                responseval =  {'status' : 'warning','message' : 'Job Request Exists.'}
                return responseval
            else:
                x.append(details['chatID'])
            
            data.update(RequestIDs = x)   
        else:
            data.update(RequestIDs = [details['chatID']]) 
        
        newRequest = {
            'name' : details['name'],
            'chatID' : details['chatID'],
            'MoreDetails' : details['MoreDetails'],
            'UploadedFileName' : details['UploadedFileName']
        }
        requestList = listdata[0]['Request']
        if requestList != None:
            requestList.append(newRequest)
            data.update(Request = requestList)   
        else:
            data.update(Request = [newRequest])  
        JobsTable.save
        
        RequestJobTable.objects.create(Details = listdata[0]['Details'],userID = details['chatID'], JobID = id)
        RequestJobTable.save
        responseval =  {'status' : 'success','message' : 'Job Request Successfuly Uploaded'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data'}
    
    return responseval


@database_sync_to_async
def DeleteJobFunc(idval,email):
    if idval != '' and idval != 'null' and email != '' and email != 'null':
        id = sanitize_string(idval)
        JobsTable.objects.filter(id = id, email = email).delete()
        RequestJobTable.objects.filter(JobID = id).delete()
        responseval =  {'status' : 'success','message' : 'Job deleted Successfuly'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data or Job was already deleted.'}
    return responseval


@database_sync_to_async
def MyJobsFunc (userID,email):
    if userID != '' and userID != 'null' and email != '' and email != 'null':
        id = sanitize_string(userID)
        emailval = sanitize_string(email)
        val = list(RequestJobTable.objects.filter(Q(email = emailval) | Q(userID = id)).values())
        return val
    else:
        return []
    

@database_sync_to_async
def ReadMoreFunc (email,JobID):
    if JobID != '' and JobID != 'null' and email != '' and email != 'null':
        email = sanitize_string(email)
        idval = sanitize_string(JobID)
        data = list(JobsTable.objects.filter(id = idval).values())  
        return data
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data or Job was already deleted.'}
        return responseval
    

@database_sync_to_async
def WithdrawRequestFunc (userID,JobID):
    if JobID != '' and JobID != 'null' and userID != '' and userID != 'null':
        userIDval = int(sanitize_string(userID))
        JobIDval = sanitize_string(JobID)
        RequestJobTable.objects.filter(JobID = JobIDval,userID = userIDval).delete()
        data = list(JobsTable.objects.filter(id = JobIDval).values())
        ids = data[0]['RequestIDs']  
        requestdict = data[0]['Request']
        if ids != None:
            custom = [*ids]
            for x in custom:
                if x == userIDval:                    
                    custom.remove(userIDval)
        if requestdict != None:
            for x in requestdict:
                if x['chatID'] == userIDval:
                    requestdict.remove(x)
                    break
        db = JobsTable.objects.filter(id = JobIDval)
        db.update(RequestIDs = custom,Request = requestdict)
        JobsTable.save
        responseval =  {'status' : 'success','message' : 'Request Withdrawn.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval


@database_sync_to_async
def ApproveRequestFunc(Details):
    if Details != '' and Details != None:
        idval = Details[1]

        data = JobsTable.objects.filter(id = idval)
        valuedata = list(data.values())
        AcceptedRequestval = valuedata[0]['AcceptedRequest']
        AcceptedIDsval = valuedata[0]['AcceptedIDs']
        Requestval = valuedata[0]['Request']
        if AcceptedRequestval != None:
            AcceptedIDsval.append(Details[0]['chatID'])
            
            AcceptedRequestval.append(Details[0])
        else:
            AcceptedRequestval = [Details[0]]
            AcceptedIDsval = [Details[0]['chatID']]
        if Requestval != None:
            for x in Requestval:
                if x['chatID'] == Details[0]['chatID']:
                    Requestval.remove(x)
                    break
        data.update(Request = Requestval,AcceptedRequest = AcceptedRequestval,AcceptedIDs = AcceptedIDsval)
        JobsTable.save
        responseval =  {'status' : 'success','message' : 'Request Approved.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval



@database_sync_to_async
def DoneJobFunc(Details):
    if Details != '' and Details != None:
        idval = sanitize_string(Details['id'])
        users = Details['AcceptedIDs']
        jobdetails = {
            'Details' : Details['Details'],            
            'OpenedDate' : Details['OpenedDate'],
            'ClosedDate' : Details['ClosedDate']
        }
        JobsTable.objects.filter(id = idval).delete()
        RequestJobTable.objects.filter(JobID = idval).delete()
        for x in users:
            xval = sanitize_string(x)
            db = Account.objects.filter(id = xval)
            valdata = list(db.values())
            JobsHistory = valdata[0]['JobsHistory']
            if JobsHistory != None:
                JobsHistory.append(jobdetails)
                db.update(JobsHistory = JobsHistory)
            else:
                val = [jobdetails]
                db.update(JobsHistory = val)
            Account.save
        
        responseval =  {'status' : 'success','message' : 'Successful.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval


@database_sync_to_async
def JobHistoryFunc(id):
    if id != None and id != '':
        idval = sanitize_string(id)
        data = list(Account.objects.filter(id = idval).values('JobsHistory'))
        val = data[0]['JobsHistory']
        if len(data) != 0:
            return val
        else:
            responseval =  {'status' : 'error','message' : 'Data not found.'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval


@database_sync_to_async
def DeleteJobHistoryFunc (id,Position):
    if id != None and id != '' and Position != '' and Position != None:
        idval = sanitize_string(id)
        pos = int(sanitize_string(Position))
        data = list(Account.objects.filter(id = idval).values('JobsHistory'))
        val = data[0]['JobsHistory']
        if val != None:
            val.pop(pos)
        Account.objects.filter(id = idval).update(JobsHistory = val)
        Account.save
        responseval =  {'status' : 'success','message' : 'Successfuly Deleted.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval


class ChatList(AsyncWebsocketConsumer):
    async def connect(self):    
       
        await self.accept() 
        

    async def disconnect(self, close_code):      
        pass


    async def send_msg(self, data,type):
        
        await self.send(
            text_data=json.dumps(
                {
                    'type' : type,
                    "message": data,
                }
            )
        )   

    #recieve message from websocket
    async def receive(self, text_data=None,bytes_data=None):
        file_name = ''
        date = datetime.datetime.now()
        #return
        if isinstance(bytes_data,bytes):         
            
            file_buffer =bytes_data
            #file_name = 'loginPreview.png'  # Replace with a unique file name
            if default_storage.exists(file_name):
                pass
                # Duplicate found, handle it (e.g., raise an error, rename the file)
            else:
                with default_storage.open(file_name, 'wb') as f:
                    f.write(file_buffer)
            # Handle the uploaded file as needed
            
            await self.send_msg(data='Success',type='Upload')
        else:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            if(message == 'PostJob'):
                Details =  text_data_json['Details']
                email =  text_data_json['email']
                CreatorsID = text_data_json['CreatorsID']
                OpenedDate =  text_data_json['OpenedDate']
                location =  text_data_json['location']
                imageName =  text_data_json['imageName']
                val = await  PostJobFunc(CreatorsID =CreatorsID,email = email,imageName=imageName,Details = Details,OpenedDate =OpenedDate,location = location)
                await self.send_msg(data= val, type='PostJob')
            elif(message == 'FindJobs'):
                OpenedDate =  text_data_json['OpenedDate']
                location =  text_data_json['location']
                val = await  FindJobsFunc(OpenedDate =OpenedDate,location = location)
                await self.send_msg(data= val, type='FindJobs')
            elif(message== 'RequestJob'):
                details =  text_data_json['details']
                val = await  RequestJobFunc(details = details)
                await self.send_msg(data= val, type='RequestJob')
            elif(message== 'DeleteJob'):
                idval =  text_data_json['idval']
                email =  text_data_json['email']
                val = await  DeleteJobFunc(idval = idval,email = email)
                await self.send_msg(data= val, type='DeleteJob')
            elif(message== 'MyJobs'):
                userID =  text_data_json['userID']
                email = text_data_json['email']
                val = await  MyJobsFunc(userID = userID,email = email)
                await self.send_msg(data= val, type='MyJobs')
            elif(message== 'ReadMore'):
                JobID =  text_data_json['JobID']
                email = text_data_json['email']
                val = await  ReadMoreFunc(JobID = JobID,email = email)
                await self.send_msg(data= val, type='ReadMore')
            elif(message== 'WithdrawRequest'):
                JobID =  text_data_json['JobID']
                userID = text_data_json['userID']
                val = await  WithdrawRequestFunc(JobID = JobID,userID = userID)
                await self.send_msg(data= val, type='WithdrawRequest')
            elif(message == 'ApproveRequest'):
                Details = text_data_json['Details']
                val = await ApproveRequestFunc(Details=Details)
                await self.send_msg(data=val,type='ApproveRequest')
            elif (message == 'DoneJob'):
                Details = text_data_json['Details']
                val = await DoneJobFunc(Details=Details)
                await self.send_msg(data=val,type='DoneJob') 
            elif (message == 'JobHistory'):
                id = text_data_json['id']
                val = await JobHistoryFunc(id=id)
                await self.send_msg(data=val,type='JobHistory') 
            elif (message == 'DeleteJobHistory'):
                id = text_data_json['id']
                Position = text_data_json['Position']
                val = await DeleteJobHistoryFunc(id=id,Position = Position)
                await self.send_msg(data=val,type='DeleteJobHistory') 
            





                 




   

