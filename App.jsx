
APP.jsx – FULL OFFICE SYSTEM WITH LOGIN + MEMBER MANAGEMENT
===========================================================

INSTALL FIRST:
npm install lucide-react react-hot-toast

-------------------------------------------

import React,{useState,useEffect} from "react";
import {Trash2,CheckCircle,Shield,Edit,Users,Plus,Sun,Moon} from "lucide-react";
import {Toaster,toast} from "react-hot-toast";

export default function App(){

/* AUTH */

const defaultAdmins=[{id:1,user:"admin",pass:"1234"}];

const [admins,setAdmins]=useState(()=>JSON.parse(localStorage.getItem("admins"))||defaultAdmins);
const [user,setUser]=useState(null);
const [login,setLogin]=useState({user:"",pass:""});

/* TASKS */

const staff=["Secretary","PA","PS","Assistant","Clerk"];

const emptyTask={letterNo:"",date:"",subject:"",assignedTo:"",remarks:"",priority:"Medium"};

const [tasks,setTasks]=useState(()=>JSON.parse(localStorage.getItem("officeTasks"))||[]);
const [newTask,setNewTask]=useState(emptyTask);
const [editing,setEditing]=useState(null);

const [tab,setTab]=useState("tasks");
const [dark,setDark]=useState(false);

/* SAVE */

useEffect(()=>{
localStorage.setItem("officeTasks",JSON.stringify(tasks));
localStorage.setItem("admins",JSON.stringify(admins));
},[tasks,admins]);

/* LOGIN */

const doLogin=()=>{
const found=admins.find(a=>a.user===login.user&&a.pass===login.pass);
if(!found){toast.error("Invalid Login");return;}
setUser(found);
toast.success("Welcome Admin");
};

const addAdmin=()=>{
const u=prompt("Username");
const p=prompt("Password");
if(!u||!p)return;
setAdmins([...admins,{id:crypto.randomUUID(),user:u,pass:p}]);
toast.success("Admin Added");
};

const removeAdmin=id=>{
if(!window.confirm("Remove Admin?"))return;
setAdmins(admins.filter(a=>a.id!==id));
};

/* TASKS */

const addTask=e=>{
e.preventDefault();
if(!newTask.subject){toast.error("Subject required");return;}
setTasks([{id:crypto.randomUUID(),...newTask,status:"Pending",created:new Date().toLocaleString(),history:[]},...tasks]);
setNewTask(emptyTask);
toast.success("Task Added");
};

const advance=id=>{
setTasks(tasks.map(t=>{
if(t.id!==id)return t;
const n=t.status==="Pending"?"In Progress":t.status==="In Progress"?"Completed":"Completed";
return {...t,status:n,history:[...(t.history||[]),`Status → ${n}`]};
}));
};

const del=id=>{
if(!window.confirm("Delete?"))return;
setTasks(tasks.filter(t=>t.id!==id));
};

const saveEdit=()=>{
setTasks(tasks.map(t=>t.id===editing.id?editing:t));
setEditing(null);
toast.success("Updated");
};

/* LOGIN SCREEN */

if(!user){
return(
<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
<Toaster/>
<div className="bg-slate-800 p-6 rounded">
<h2 className="flex gap-2 mb-4"><Shield/>Admin Login</h2>
<input placeholder="User" className="block mb-2 text-black" onChange={e=>setLogin({...login,user:e.target.value})}/>
<input type="password" placeholder="Pass" className="block mb-4 text-black" onChange={e=>setLogin({...login,pass:e.target.value})}/>
<button onClick={doLogin} className="bg-green-600 px-4 py-2">Login</button>
</div>
</div>
);
}

/* MAIN */

return(
<div className={dark?"bg-slate-900 text-white min-h-screen":"bg-slate-50 min-h-screen"}>
<Toaster/>

<div className="flex">

<div className="w-60 bg-slate-900 text-white p-4">
<h3 className="font-bold flex gap-2"><Shield/>Secretariat</h3>

<button onClick={()=>setTab("tasks")} className="block mt-4">Tasks</button>
<button onClick={()=>setTab("stats")} className="block mt-2">Stats</button>
<button onClick={()=>setTab("admins")} className="block mt-2">Members</button>

<button onClick={()=>setDark(!dark)} className="mt-6 flex gap-2">{dark?<Sun/>:<Moon/>}</button>
</div>

<div className="flex-1 p-6">

{tab==="tasks"&&(
<form onSubmit={addTask} className="space-y-2">
<input placeholder="Letter" value={newTask.letterNo} onChange={e=>setNewTask({...newTask,letterNo:e.target.value})}/>
<input type="date" value={newTask.date} onChange={e=>setNewTask({...newTask,date:e.target.value})}/>
<input placeholder="Subject" value={newTask.subject} onChange={e=>setNewTask({...newTask,subject:e.target.value})}/>
<select value={newTask.assignedTo} onChange={e=>setNewTask({...newTask,assignedTo:e.target.value})}>
<option></option>{staff.map(s=><option key={s}>{s}</option>)}
</select>
<select value={newTask.priority} onChange={e=>setNewTask({...newTask,priority:e.target.value})}>
<option>Low</option><option>Medium</option><option>High</option>
</select>
<input placeholder="Remarks" value={newTask.remarks} onChange={e=>setNewTask({...newTask,remarks:e.target.value})}/>
<button>Add</button>
</form>
)}

{tab==="tasks"&&tasks.map(t=>(
<div key={t.id} className="border p-3 mt-3">
<b>{t.subject}</b> ({t.status})
<div className="flex gap-2">
<button onClick={()=>advance(t.id)}><CheckCircle/></button>
<button onClick={()=>setEditing({...t})}><Edit/></button>
<button onClick={()=>del(t.id)}><Trash2/></button>
</div>
</div>
))}

{tab==="stats"&&(
<div>
<p>Pending {tasks.filter(t=>t.status!=="Completed").length}</p>
<p>Completed {tasks.filter(t=>t.status==="Completed").length}</p>
<p>Urgent {tasks.filter(t=>t.priority==="High").length}</p>
</div>
)}

{tab==="admins"&&(
<div>
<h2 className="flex gap-2"><Users/>Members</h2>
<button onClick={addAdmin} className="bg-green-600 px-3 py-1 mt-2 flex gap-2"><Plus/>Add</button>
{admins.map(a=>(
<div key={a.id} className="flex justify-between mt-2 border p-2">
{a.user}
<button onClick={()=>removeAdmin(a.id)}><Trash2/></button>
</div>
))}
</div>
)}

{editing&&(
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
<div className="bg-white p-4">
<input value={editing.subject} onChange={e=>setEditing({...editing,subject:e.target.value})}/>
<button onClick={saveEdit}>Save</button>
</div>
</div>
)}

</div>
</div>
</div>
);
  }
