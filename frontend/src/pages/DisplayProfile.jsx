// src/components/DisplayProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import axios from 'axios';
import ProfileLayout from '../components/ProfileLayout';

const DisplayProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({})

  const getUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/search/getauser', {
        params: { key: username },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  useEffect(() => {
    getUser();
  }, [username]);

  return <ProfileLayout user={user} />;
}

export default DisplayProfile;
