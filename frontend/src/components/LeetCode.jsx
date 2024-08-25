import React, { useEffect, useRef, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Greencheck from '../assets/Greencheck';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { FaTrophy } from "react-icons/fa"
import { SiLeetcode } from 'react-icons/si';
import { LeetCodeSkelton } from './Postskelton';
import baseAddress from '../utils/localhost';
import axios from 'axios';
import CryptoJS from 'crypto-js';





const LeetCode = () => {
    const [showAccRate, setShowAccRate] = useState(false)
    const user = useSelector(state => state.profile.profileInfo)
    const [lcdata, setlcdata] = useState({})
    const [isLoading, setisLoading] = useState(false)


    const {
        acceptanceRate,
        contributionPoints,
        easySolved,
        hardSolved,
        mediumSolved,
        ranking,
        totalEasy,
        totalHard,
        totalMedium,
        totalQuestions,
        totalSolved
    } = lcdata;

    const [leftPart, rightPart] = acceptanceRate?.toString()?.split('.') || [0, 0];

    const easyPercentage = (totalEasy / totalQuestions) * 100;
    const mediumPercentage = (totalMedium / totalQuestions) * 100;
    const hardPercentage = (totalHard / totalQuestions) * 100;
    const easySolvedPercentage = (easySolved / totalQuestions) * 100;
    const mediumSolvedPercentage = (mediumSolved / totalQuestions) * 100;
    const hardSolvedPercentage = (hardSolved / totalQuestions) * 100;

    
    const getLC = async () => {

        setisLoading(true)
        try {
            const encUsername = CryptoJS.AES.encrypt(user.leetcode, import.meta.env.VITE_LC_SECRETKEY).toString();
            

            
            
            let res = await axios.post(`${baseAddress}search/getLCdata/`, {username: encUsername});
            
            if (res.status==200) {
                
                setlcdata(res.data);

            } else {
                console.log("Some error occured!");
                toast.error("Some error occured!")

            }


        } catch (error) {
            console.log(error);

        }
        setisLoading(false)
    }


    const handleMouseEnter = () => {
       
        setShowAccRate(true)

    }
    const handleMouseLeave = () => {
        
        setShowAccRate(false)


    }

    useEffect(() => {
        if (user?.leetcode) {
            getLC()
        }
    }, [user])


    return (

        <div className=' flex flex-col gap-2'>
            <div className='max-w-[448px] '>
                <div className=' rounded-t-xl flex items-center gap-2 p-4 bg-[#666923d3]'>
                    <SiLeetcode className=' text-2xl' />
                    <span><span className=' text-white'>Leet</span><span className=' text-[#debe10]'>Code</span> Profile</span>
                </div>

                <div className=' flex justify-between p-4  bg-[#82872460]  rounded-b-xl '>
                    <div className=' flex items-center gap-2' > <FaTrophy className=' text-xl text-[#ffffff]' /> <span className='font-medium text-sm font-mono'>{ranking?.toLocaleString()}</span></div>
                    <div className=' flex items-center gap-2'>
                        <img className=' h-5 w-5' src="https://assets.leetcode.com/static_assets/public/images/LeetCoin.png" alt="" />
                        <span className='font-medium text-sm font-mono'>{contributionPoints?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {isLoading?<LeetCodeSkelton/>:
            <div className=' grid grid-cols-[1fr_1fr] gap-8 xxs:gap-16 bg-[#e2e4c6]  p-4 xxs:p-8 rounded-xl w-fit   ' >



            <div onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()} className="multi-arc-progres " style={{ position: 'relative', width: 160, height: 160 }}>



                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <CircularProgressbar
                        value={easyPercentage - easyPercentage / 8}
                        styles={buildStyles({
                            pathColor: '#264545',
                            trailColor: 'transparent',
                            pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={6}
                    />

                </div>

                <div  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <CircularProgressbar
                        value={easySolvedPercentage - easySolvedPercentage / 8}
                        styles={buildStyles({
                            pathColor: '#1cbaba',
                            trailColor: 'transparent',
                            pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={6}
                    />
                </div>


                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    transform: `rotate(${(easyPercentage / 100) * 360}deg)`

                }}>
                    <CircularProgressbar
                        value={mediumPercentage - easyPercentage / 8}
                        styles={buildStyles({
                            pathColor: '#534520', // Yellow for Medium
                            trailColor: 'transparent',
                            pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={6}
                    />
                </div>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    transform: `rotate(${(easyPercentage / 100) * 360}deg)`

                }}>
                    <CircularProgressbar
                        value={mediumSolvedPercentage - easySolvedPercentage / 8}
                        styles={buildStyles({
                            pathColor: '#ffb700',
                            trailColor: 'transparent',
                            pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={6}
                    />
                </div>

                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    transform: `rotate(${((easyPercentage + mediumPercentage) / 100) * 360}deg)`

                }}>
                    <CircularProgressbar
                        value={hardPercentage - easyPercentage / 8}
                        styles={buildStyles({
                            pathColor: '#512b2b', 
                            trailColor: 'transparent',
                            pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={6}
                    />
                </div>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    transform: `rotate(${((easyPercentage + mediumPercentage) / 100) * 360}deg)`

                }}>
                    <CircularProgressbar
                        value={hardSolvedPercentage - easySolvedPercentage / 8}
                        styles={buildStyles({
                            pathColor: '#f63737', 
                            trailColor: 'transparent',
                            pathTransitionDuration: 0.5,
                        })}
                        strokeWidth={6}
                    />
                </div>




                <div  className="progress-text  cursor-default" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50% -50%', color: '#fff', textAlign: 'center' }}>
                    <div className=' flex items-baseline text-gray-600'> <span className=' text-2xl font-semibold'>{showAccRate ? leftPart : totalSolved || 0}</span> <span className=' font-semibold text-sm'>{showAccRate ? `.${rightPart}%` : `/${totalQuestions || 0}`}</span></div>
                    <div className=' flex items-center gap-1 justify-center'> {!showAccRate && <span><Greencheck /></span>} <span className='text-black'>
                        {showAccRate ? 'Acceptance' : 'Solved'}</span></div>
                </div>
            </div>


            <div className=' flex flex-col justify-between'>
                <div className=' flex flex-col rounded-md  items-center px-4 bg-[#d2d5a1]'>
                    <span className=' text-[#1cbaba]'>Easy</span>
                    <span className=' text-xs font-semibold'>{easySolved || 0}/{totalEasy || 0}</span>
                </div>
                <div className=' flex flex-col rounded-md items-center px-4 bg-[#d2d5a1]'>
                    <span className=' text-[#ffb700]'>Medium</span>
                    <span className=' text-xs font-semibold'>{mediumSolved || 0}/{totalMedium || 0}</span>
                </div>
                <div className=' flex flex-col rounded-md items-center px-4 bg-[#d2d5a1]'>
                    <span className=' text-[#f63737]'>Hard</span>
                    <span className=' text-xs font-semibold'>{hardSolved || 0}/{totalHard || 0}</span>
                </div>

            </div>


        </div>}

            
        </div>
    );
};

export default LeetCode;
