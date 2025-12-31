import React, { useCallback, useState } from "react";
import CreateTask from "./CreateTask";
import {  useSelector } from "react-redux";
import TaskList from "./TaskList";





const Task = ({projectId})=>{

  const role = useSelector((state) => state.user.Role);
  
  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const searchQuery = useSelector((state) => state.searchQuery);
const accessCode = useSelector((state) => state.user.accessCode) || [];

const [refresh,setRefresh] = useState(false);

const triggerEvent = useCallback(()=>{

  setRefresh((prev)=>!prev)
},[])



    return(
        <div style={{display:'flex',flexDirection:'row',border:'3px solid red'}}>

       {
  (accessCode.includes('ALL_R') || accessCode.includes('PROJ_TASK_CR')  || role === 'Org Admin') && (
    <CreateTask  projectId ={{projectId:projectId}}
    taskCreated={triggerEvent}/>
  )
}

<TaskList  projectId ={{projectId:projectId}} refresh={refresh}/>

        </div>
    )









}


export default  Task