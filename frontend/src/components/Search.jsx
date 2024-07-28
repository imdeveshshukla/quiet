import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { useDebounce } from '../hooks/useDebounce';
import dp from '../assets/dummydp.png'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


const Search = () => {
    const [search, setSearch] = useState("");
    const [menu, setMenu] = useState(false);
    const [users, setUsers] = useState([]);
    const Navigate = useNavigate()
    const debouncedSearch = useDebounce(search, 500);


    const searchRef = useRef(null);
    const handleSearch = (e) => {
        setSearch(e.target.value);

    }

    useEffect(() => {
        if (debouncedSearch) {
            fetchUsers();
        } else {
            setUsers([])
        }
    }, [debouncedSearch]);


    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/search/getusers', {
                params: { key: debouncedSearch },
            });
            console.log(res.data);
            setUsers(res.data)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };



    const openUserProfile = (username) => {
        Navigate(`/u/${username}`);
        setMenu(false);
    }



    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setMenu(false);
        }
    };



    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={searchRef} className="search flex items-center relative ">
            <span className="absolute z-10 left-2"><IoSearchOutline className=" text-2xl" /></span>
            <div className='relative'>
                <input onClick={() => setMenu(true)} onChange={(e) => handleSearch(e)} autoComplete='off' value={search} className={`outline-none pl-10 pr-4 py-2 w-[30vw] hover:bg-[#acb23fa3]   rounded-3xl ${menu ? ' bg-[#c2c7b3]' : 'bg-[#656923]'} `} type="search" name="search" id="search" placeholder='Search' />
                {menu && <div className=' absolute top-0 min-h-20 bg-[#c2c7b3] w-full rounded-3xl -z-10 '>
                    <div className='mt-14 h-[1px] w-full bg-[#4c6011]'></div>
                    {users.length > 0 ? <div className=' text-md font-semibold py-1 px-4'>People</div> : <div className='text-md font-light py-1 px-4'>Search for people or community.</div>}
                    <div className='py-2 px-4 flex flex-col'>
                        {users.map(user => {
                            return <>
                                <div key={uuidv4()} onClick={() => openUserProfile(user.username)} className=' flex items-center gap-4 cursor-pointer hover:bg-[#b9c19e] rounded-lg py-2 px-4'>
                                    <img
                                        src={user.dp ? user.dp : dp}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full   bg-white"
                                    />
                                    <span className=' text-sm font-semibold'>u/{user.username}</span>
                                </div>
                            </>
                        })}
                    </div>
                    <div className=' px-4 py-2 flex items-center gap-4 border-t border-[#656923]'><IoSearchOutline className=' text-xl' /><span>search for"{debouncedSearch}"...</span></div>
                </div>}
            </div>
        </div>
    )
}

export default Search
