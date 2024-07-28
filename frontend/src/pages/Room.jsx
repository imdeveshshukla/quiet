import axios from "axios";
import { useEffect, useState } from "react";
import baseAddress from "../utils/localhost";
import { useParams } from 'react-router-dom'
const Room = function({id}){
    
    const {title,userId} = useParams();

    const [name,setName] = useState("NULL");
    const [img,setImg] = useState(null);
    const [desc,setDescription] = useState("NULL");
    useEffect(async() => {

      const res = await axios.get(baseAddress+`rooms/getRoom/${title}`);
      if(res.data.status == 200)
      {
        // setName(res.data.title)
      }
    
    }, [])
    
    return <>

    </>
}

export default Room;