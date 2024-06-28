import { Card } from "antd";
import React, { useEffect, useState } from "react";
const Projects = () =>{
    const [data,setData]= useState([]);
    useEffect(() => {
        async function update() {
          const response = await fetch('http://localhost:3010/Project');
          const data = await response.json();
          console.log(data);
          setData(data);
        }
        console.log("Item Refreshed");
        update();
      }, []);


    return(
        <>
        {JSON.stringify(data)}
        {data.map((item) => (
        
        <Card 
        >
            {item.Title}
          </Card>
          ))}
        
        </>
    );

}
export default Projects;