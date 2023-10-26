import '../styles/globals.css'
import '../styles/style.css'
import React, { useState } from "react";
import DynamicYourComponent from "../components/dynamicComponentLoader"
import LogOut from "../components/inputHelpers/logout"
import CreativPlayground from '@/components/creativPlayground';

const MasterPage2 = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2">
         <CreativPlayground />
      </div>
      <div className="col-span-1 m-2 dark:bg-slate-800 bg-slate-400  rounded-xl items-center justify-center h-auto">
        <nav className="m-2 bg-slate-600 rounded-xl flex justify-between items-center">
          <h1 onClick={() => location.reload()} className="m-2 text-5xl text-left text-white font-bold">PlanFlow3D</h1>
          <LogOut/>
        </nav>


 
      </div>
    </div>
  );
};

export default MasterPage2;
