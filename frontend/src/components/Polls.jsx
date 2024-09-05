import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import dp from '../assets/dummydp.png';
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";
import ReadMore, { linkDecorator } from './ReadMore';
import { clearPostsInfo, setPollvote, toggleUpvote } from '../redux/Post';
import baseAddress from '../utils/localhost';
import Linkify from 'react-linkify';
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from 'react-icons/md';
import SmoothLoader from '../assets/SmoothLoader';
import { getTime } from './Posts';
import { v4 as uuidv4 } from 'uuid';
import SmallLoader from './SmallLoader';
import SmoothLoaderN from '../assets/SmoothLoaderN';
import { setUserPollvote } from '../redux/userpolls';





const Polls = ({ poll, user, inRoom, topic }) => {

    const userInfo = useSelector(state => state.user.userInfo);
    const isLogin = useSelector(state => state.login.value);
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const [isOpen, setOpen] = useState(false);
    const [delLoading, setLoading] = useState(false);
    const [loading, setloading] = useState(false)
    const dropdownRef = useRef(null);



    const [hasVoted, setHasVoted] = useState(false);
    const [loadingOptionId, setLoadingOptionId] = useState(null);




    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {

        const totalVotesPerPoll = poll?.options?.reduce((total, option) => total + option.votes.length, 0);
        setTotalVotes(totalVotesPerPoll)

    }, [poll]); // Run this effect when options change



    const handleVote = async (selectedOption) => {
        setloading(true)

        try {
            const res = await axios.post(`${baseAddress}poll/votepoll`, {
                pollOptionId: selectedOption,
            });

            console.log(res);


            if (res.status === 200) {
                setHasVoted(true);
                dispatch(setPollvote(res.data))
                dispatch(setUserPollvote(res.data))
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
        setloading(false)
        setLoadingOptionId(null)
    };


    const handleToggle = () => {
        setOpen((v) => !v)
    }
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }

    };






    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div key={poll.id}>
            <div className='px-4 py-2 xxs:px-8 xxs:py-4 border-2 border-[#f9ff86] rounded-2xl animate-glow m-4 xxs:m-8'>
                <header className='flex gap-2 items-center my-2'>
                    <img onClick={() => Navigate(`/u/${poll?.createdBy?.username}`)} src={poll?.createdBy?.dp || dp} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer bg-white" />
                    <div className=' flex flex-wrap gap-1 xs:gap-2 md:gap-4 items-center'>
                        <span onClick={() => Navigate(`/u/${poll?.createdBy?.username}`)} className='font-semibold cursor-pointer hover:text-green-900'>u/{poll?.createdBy?.username}</span>•{(inRoom && <><span onClick={() => Navigate(`/room/${user.userID}/${room.title}`)} className=' cursor-pointer hover:text-rose-900 text-sm font-semibold'>q/{room?.title}</span> <span>•</span></>)
                            || (topic && <><span onClick={() => Navigate(`/q/${"topic"}`)} className=' cursor-pointer hover:text-rose-900 text-sm font-semibold'>q/{topic}</span> <span>•</span></>)}<span className='text-xs text-gray-700'>{`${getTime(poll?.createdAt)} ago`}</span>

                    </div>
                    {poll?.userId === userInfo?.userID ?
                        <div className="relative flex items-center gap-8 ml-auto" ref={dropdownRef} >

                            <button onClick={handleToggle} className="flex items-center hover:focus:outline-none">
                                <BsThreeDotsVertical />
                            </button>
                            {isOpen && (
                                <div className="absolute right-0 top-4  bg-white rounded-md shadow-lg z-10">
                                    <ul className=" bg-[#6d712eb8] rounded-md ">
                                        <li className=" text-white hover:text-black">
                                            <button onClick={() => deletePost(id)} className="px-4 py-1 flex items-center gap-1 ">
                                                {delLoading ? <SmoothLoader /> : <><span>Delete</span> <MdDelete /></>}</button>
                                        </li>
                                    </ul>

                                </div>
                            )}
                        </div> : <></>}
                </header>
                <main className=''>
                    <div className=' text-lg font-roboto font-medium '>{poll?.title}</div>

                    <div className='relative flex flex-col gap-1'>



                        {poll?.options?.map(option => (

                            <button disabled={loading} onClick={() => {
                                {
                                    handleVote(option.id)
                                    setLoadingOptionId(option.id)
                                }
                            }} key={`${uuidv4()}${option.id}`} className='option cursor-pointer relative  '>
                                <div className={` ${option.votes.some(vote => vote.userId == userInfo?.userID) && ' shadow-md shadow-current'} flex justify-between items-center   relative border-2 bg-gray-200 px-2 py-1  rounded-md border-[#6d712eb8]`}>
                                    <span className=' text-sm  font-ubuntu font-semibold'>{option.text}</span>
                                    <span className=' text-xs font-semibold'>{`${((option.votes.length * 100 / totalVotes) || 0).toFixed(2)}%`}</span>

                                </div>


                                {loading && loadingOptionId == option.id && <div className=' absolute top-0 left-0  rounded-md min-h-full w-full z-10 bg-black bg-opacity-40 backdrop-blur-sm  flex items-center justify-center'>
                                    <SmoothLoaderN />
                                </div>}


                                <div style={{
                                    width: `${(option.votes.length * 100 / totalVotes)}%`
                                }} className={`absolute top-0 rounded-md ${option.votes.some(vote => vote.userId == userInfo?.userID) ? 'bg-[#c2c84da9]' : 'bg-[#f9ff86a9]'} min-h-full `}>

                                </div>
                            </button>

                        ))}
                        {/* c2c84da9 */}


                    </div>


                    <div className=' text-end text-sm mt-1 mr-2 text-gray-700'>Total_votes: {totalVotes}</div>

                </main>



            </div>
            <div className=' bg-gray-700 h-[1px]'></div>

        </div>
    )
}

export default Polls
