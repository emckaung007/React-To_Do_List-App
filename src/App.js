import { useEffect, useState } from "react";
import uuid from "react-uuid";
import { api } from "./api/api";
import Form from "./components/Form";
import List from "./components/List";
import axios from "axios";

function App() {

  const [tasks,setTasks] = useState([]);
  const [loading,setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await api.get("/todolist")
                            
    // console.log(res.data);
    setTasks(res.data);

    setLoading(false);
  }

  useEffect(()=>{
    fetchTasks()
  },[]);

  const addNewTask = async (task) =>{
    const newTask = {
      id : uuid(),
      task,
      complete : false
    }
    
    // console.log(newTask);

    const res = await api.post('/todolist',newTask);

    // console.log(res);
    setTasks([...tasks,res.data])

  }


  const deleteTask = async (id) => {
    const res = await api.delete(`/todolist/${id}`)

    // console.log(res);

    if(res.statusText === "OK"){
      setTasks(tasks.filter(task => task.id !== id))
    }

  }


  const updateTask = async (id,complete) => {
      const res = await api.patch(`/todolist/${id}`,{
        complete
      });

      setTasks(tasks.map(task => {
        if(task.id == id){
          return{
            id : task.id,
            task : task.task,
            complete : !task.complete,
          }
        }
        return task;
      }))

  }


  return (
    <>
      <div className="w-full h-screen bg-zinc-800 flex flex-col gap-y-12 justify-center items-center">
          <h1 className="text-4xl text-center text-gray-300 font-bold">TO DO LIST</h1>
          <Form addNewTask={addNewTask}/>
          {
            loading === true ? <h1 className="text-2xl text-center text-gray-300 my-4">is Loading...</h1> :
            <List tasks={tasks} deleteTask={deleteTask} updateTask={updateTask}/>
          }
      </div> 
    </>
  );
}

export default App;
