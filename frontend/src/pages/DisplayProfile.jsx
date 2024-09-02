// src/components/DisplayProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import axios from 'axios';
import ProfileLayout from '../components/ProfileLayout';
import { useDispatch } from 'react-redux';
import {setProfileInfo} from '../redux/profile'
import toast from 'react-hot-toast';
import baseAddress from "../utils/localhost";



const DisplayProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({})
  const dispatch= useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${baseAddress}search/getauser`, {
        params: { key: username },
      });
      if(res.status==200){
        console.log(res);
        
        setUser(res.data);
        dispatch(setProfileInfo(res.data))
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
      toast.error("Unable to load profile !");
    }
  }

  useEffect(() => {
    getUser();
  }, [username]);

  return <ProfileLayout isLoading={isLoading} user={user} />;
}

export default DisplayProfile;
