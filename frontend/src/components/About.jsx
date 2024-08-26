import React from 'react'
import { IoIosSend } from "react-icons/io";
import { MdCancelPresentation } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { hide } from '../redux/welcome'
import rituraj from '../assets/rituraj.png'
import devesh from '../assets/devesh.png'
import { GrLinkedin } from "react-icons/gr";



const About = () => {
    return <>
        <div className=' tracking-wide flex flex-col gap-8 p-8  '>

            <header className=' w-full text-center text-[#5d610bf8] text-xl xs:text-2xl font-bold font-roboto'>
                <span className=''>Welcome to quIET</span>
            </header>
            <main className=' flex flex-col gap-8  font-ubuntu text-sm xs:text-base'>
                <div className=' '>
                    Welcome to quIET, a social media platform designed for those who value their privacy and the freedom to express themselves without fear of judgment. We’re thrilled to have you join our community where your thoughts, ideas, and experiences can be shared freely and anonymously.
                </div>
                <div>
                    <div className=' text-[#5d610bf8] xs:text-lg font-semibold'>What is quIET?</div>
                    <div>
                        quIET is an anonymous social media platform where users can interact, post comments, and engage in discussions without revealing their true identity as users often face the challenge of balancing their public image with their true thoughts and feelings. In this digital age, where personal data is often at risk, quIET provides a sanctuary where you can be yourself without the pressure of maintaining a public persona. Here, every user is assigned a randomly generated username, ensuring that your real name and email address remain completely private.
                    </div>
                </div>
                <div>
                    <div className='text-[#5d610bf8]  xs:text-lg font-semibold'>Key Features</div>
                    <ul className=' list-disc pl-8'>
                        <li>Each user is given a unique, randomly generated username. Your real name and email address are never displayed, ensuring complete anonymity.</li>

                        <li>
                            Discuss anything from college life and societal critiques to personal stories, or just engage in some light-hearted gossip and observations without the fear of judgment and burden of revealing your identity.
                        </li>

                        <li>
                            Interact with others, comment on posts, and participate in discussions in a community that values privacy and authenticity.
                        </li>

                    </ul>


                </div>

                <div className=''>
                    <div className='text-[#5d610bf8]  xs:text-lg font-semibold'>A Glimpse Into the quIET Experience</div>
                    <div>
                        As a new user, you’ll find that quIET is not just another social media platform. It’s a space where the usual constraints of identity and reputation are lifted, allowing for more genuine and diverse conversations. Whether you’re here to share your thoughts on the latest trends, vent about college life, or engage in serious discussions about social issues, quIET welcomes you with open arms.
                    </div>
                </div>

                <div className=' flex flex-col gap-4'>
                    <div className='text-[#5d610bf8]  xs:text-lg font-semibold'>About the Creator</div>
                    <div className='flex items-center gap-4'>
                        <img className='h-16 w-16 rounded-full bg-white' src={devesh} alt="" />
                        <div className=' flex flex-col'>
                            <span  className='text-base justify-end flex font-roboto font-medium'><a href='https://www.linkedin.com/in/imdeveshshukla/' target='blank' className='flex items-center cursor-pointer gap-2 hover:text-blue-600'>Devesh Shukla <GrLinkedin className=' text-blue-800 text-lg'/></a></span >
                            <span className=' text-xs text-gray-600 '>M.C.A, Intitute of engineering and technology, Lucknow</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <img className='h-16 w-16 rounded-full bg-white' src={rituraj} alt="" />
                        <div className=' flex flex-col'>
                            <span className='text-base justify-end  flex  font-roboto font-medium'><a href='https://www.linkedin.com/in/rituraj67/' target='blank' className='flex items-center cursor-pointer gap-2 hover:text-blue-600'>Rituraj Singh <GrLinkedin className=' text-blue-800 text-lg'/></a></span >
                            <span className=' text-xs text-gray-600 '>M.C.A,Intitute of engineering and technology, Lucknow</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className=' text-[#3e4202f8] flex items-start'>
                <div ><span>Thank you for joining quIET. We hope you enjoy your journey of anonymous interaction, where your voice can be as loud or as soft as you want it to be</span> <span className='  font-bold'><span>—just stay quIET</span><IoIosSend className=' inline-block  text-xl' /></span>.</div>
            </footer>
        </div>
    </>
}

export default About


export const WelcomePage = ({setIsFirstVisit}) => {
    const dispatch = useDispatch();
    return (
        <>
            <div className='tracking-wide animate-slideInFromBehind relative flex flex-col gap-4 p-4 rounded-lg shadow-2xl bg-[#c8cc83]  w-[80vw] 1_5md:w-[60vw] overflow-auto scrollable-box max-h-[80vh]'>
                <div onClick={() => setIsFirstVisit(false)} className=' cursor-pointer absolute right-4 top-4 text-2xl'><MdCancelPresentation /></div>
                <header className=' w-full text-center text-[#5d610bf8] text-xl xs:text-2xl font-bold font-roboto'>
                    <span className=''>Welcome to quIET</span>
                </header>
                <main className=' flex flex-col gap-2 text-[#3e4202f8] font-ubuntu text-sm xs:text-base'>
                    <div className=''>
                        Welcome to quIET, a social media platform designed for those who value their privacy and the freedom to express themselves without fear of judgment. We’re thrilled to have you join our community where your thoughts, ideas, and experiences can be shared freely and anonymously.
                    </div>
                    <div>
                        <div className='  xs:text-lg font-semibold'>What is quIET?</div>
                        <div>
                            quIET is an anonymous social media platform where users can interact, post comments, and engage in discussions without revealing their true identity as users often face the challenge of balancing their public image with their true thoughts and feelings. In this digital age, where personal data is often at risk, quIET provides a sanctuary where you can be yourself without the pressure of maintaining a public persona. Here, every user is assigned a randomly generated username, ensuring that your real name and email address remain completely private.
                        </div>
                    </div>
                    <div>
                        <div className='  xs:text-lg font-semibold'>Key Features</div>
                        <ul className=' list-disc pl-8'>
                            <li>Each user is given a unique, randomly generated username. Your real name and email address are never displayed, ensuring complete anonymity.</li>

                            <li>
                                Discuss anything from college life and societal critiques to personal stories, or just engage in some light-hearted gossip and observations without the fear of judgment and burden of revealing your identity.
                            </li>

                            <li>
                                Interact with others, comment on posts, and participate in discussions in a community that values privacy and authenticity.
                            </li>

                        </ul>


                    </div>

                    <div className=''>
                        <div className='  xs:text-lg font-semibold'>A Glimpse Into the quIET Experience</div>
                        <div>
                            As a new user, you’ll find that quIET is not just another social media platform. It’s a space where the usual constraints of identity and reputation are lifted, allowing for more genuine and diverse conversations. Whether you’re here to share your thoughts on the latest trends, vent about college life, or engage in serious discussions about social issues, quIET welcomes you with open arms.
                        </div>
                    </div>
                </main>

                <footer className=' text-[#3e4202f8] flex items-start'>
                    <div ><span>Thank you for joining quIET. We hope you enjoy your journey of anonymous interaction, where your voice can be as loud or as soft as you want it to be</span> <span className='  font-bold'><span>—just stay quIET</span><IoIosSend className=' inline-block  text-xl' /></span>.</div>
                </footer>
            </div>
        </>
    )
}