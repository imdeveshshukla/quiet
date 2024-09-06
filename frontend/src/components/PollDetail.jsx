import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import baseAddress from '../utils/localhost';
import Polls from './Polls';
import axios from 'axios';

import { PollSkelton } from './Postskelton';



const PollDetail = () => {
    const { id } = useParams();
    const [poll, setpoll] = useState({})
    const [loading, setloading] = useState(false)
    


    const setPollVote = (res) => {
        const { optionId, userId } = res;

        let newOpt = poll?.options?.map(option => {

            const updatedVotes = option.votes.filter(vote => vote.userId !== userId);

            if (option.id === optionId) {

                return {
                    ...option,
                    votes: [...updatedVotes, res]
                };
            }

            return {
                ...option,
                votes: updatedVotes
            };
        });
        setpoll({...poll, options: newOpt})
    }




    const fetchPoll = async () => {

        setloading(true)
        try {
            // console.clear();
            // console.log("Fetching Poll");
            // const isRoom = await axios.get(`${baseAddress}poll/getpollRoom`,{
            //     params: {
            //         id,
            //     },
            // });
            // console.log(isRoom);

            const res = await axios.get(`${baseAddress}poll/getpoll`, {
                params: {
                    id,
                }
            })
            setpoll(res.data);

        } catch (error) {

        }
        setloading(false)

    }

    useEffect(() => {
        fetchPoll()
    }, [])


    return (
        <div>
            <div className=' min-h-screen overflow-auto xs:pl-4 sm:pl-16 1_5md:pl-2  2_md:pl-16'>
                {loading ? <PollSkelton /> : <Polls poll={poll} setPollVote={setPollVote} />}
            </div>
        </div>
    )
}

export default PollDetail
