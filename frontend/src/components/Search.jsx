import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { useDebounce } from '../hooks/useDebounce';
import dp from '../assets/dummydp.png'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { setShowSearch } from '../redux/search';
import { useDispatch, useSelector } from 'react-redux';
import baseAddress from '../utils/localhost';
import { setDefaultOptions } from 'date-fns';
import loading from '../redux/loading';
import { SearchSkelton } from './Postskelton';


const Search = () => {
    const [search, setSearch] = useState("");
    const [menu, setMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([])
    const Navigate = useNavigate()
    const debouncedSearch = useDebounce(search, 500);
    const dispatch = useDispatch()
    const showSearch = useSelector(state => state.search.value)



    const searchRef = useRef(null);
    const handleSearch = (e) => {
        setSearch(e.target.value);

    }

    useEffect(() => {

        const fetchdata = async () => {
            if (debouncedSearch) {
                setLoading(true)
                await fetchUsers({ debouncedSearch, setUsers, setRooms, setLoading });
                setLoading(false)
            } else {
                setUsers([])
                setRooms([])
            }
        }

        fetchdata()

    }, [debouncedSearch]);






    const openUserProfile = (username) => {
        Navigate(`/u/${username}`);
        setMenu(false);
        dispatch(setShowSearch(false))
        setSearch("")
    }

    const openRoom = (CreatorId, title) => {
        Navigate(`/room/${CreatorId}/${title}`);
        setMenu(false);
        dispatch(setShowSearch(false))
        setSearch("")
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
            <span className="absolute z-30 left-2"><IoSearchOutline className=" text-2xl" /></span>
            <div className='relative'>
                <input spellCheck={"false"} onClick={() => setMenu(true)} onChange={(e) => handleSearch(e)} autoComplete='off' value={search} className={` w-[90vw] xs:w-[60vw] 2_sm:w-[36vw] outline-none pl-10 pr-4 py-2 relative z-20  lg:w-[30vw] hover:bg-[#acb23fa3]   rounded-3xl ${menu ? ' bg-[#c2c7b3]' : 'bg-[#878c47] 2_sm:bg-[#656923]'} `} type="search" name="search" id="search" placeholder='Search' />
                {menu && <Menu users={users} rooms={rooms} loading={loading} openUserProfile={openUserProfile} openRoom={openRoom} debouncedSearch={debouncedSearch} isSearch={true} />}
            </div>
        </div>
    )
}

export default Search

export const fetchUsers = async ({ debouncedSearch, setUsers, setRooms, setLoading }) => {

    try {
        const res = await axios.get(baseAddress + 'search/getusers', {
            params: { key: debouncedSearch },
        });
      

        setUsers(res.data.users)
        setRooms(res.data.rooms)
    } catch (error) {
        console.error('Error fetching users:', error);
    }

};


export const Menu = ({ users, rooms, debouncedSearch, openUserProfile, openRoom, loading, isSearch, setTitle, setMenu }) => {


    return (
        <div className=' absolute top-0 min-h-20 bg-[#c2c7b3] w-full rounded-3xl  '>
            <div className='mt-14 h-[1px] w-full bg-[#4c6011]'></div>
            {users.length == 0 && rooms.length == 0 && <div className='text-md font-light py-1 px-4'>Search for people or community.</div>}
            {loading? <SearchSkelton/>:<>
                {users.length > 0 && <div className=' text-md font-semibold py-1 px-4'>People</div>}
                <div className='py-2 px-4 flex flex-col'>
                    {users.map(user => {
                        return <div key={uuidv4()} onClick={() => openUserProfile(user.username)} className=' flex items-center gap-4 cursor-pointer hover:bg-[#b9c19e] rounded-lg py-2 px-4'>
                            <img
                                src={user.dp ? user.dp : dp}
                                alt="Profile"
                                className="w-8 h-8 rounded-full   bg-white"
                            />
                            <span className=' text-sm font-semibold overflow-clip'>u/{user.username}</span>
                        </div>

                    })}
                </div>

                {rooms.length > 0 && <div className=' text-md font-semibold py-1 px-4'>Rooms</div>}
                <div className='py-2 px-4 flex flex-col'>
                    {rooms.map(room => {
                        return <div key={uuidv4()} onClick={() => openRoom(room.CreatorId, room.title)} className=' flex items-center gap-4 cursor-pointer hover:bg-[#b9c19e] rounded-lg py-2 px-4'>
                            <img
                                src={room.img ? room.img : dp}
                                alt="Profile"
                                className="w-8 h-8 rounded-full   bg-white"
                            />
                            <span className=' text-sm font-semibold overflow-clip'>q/{room.title}</span>
                        </div>

                    })}
                </div>
            </>}
            <div className=' px-4 py-2 flex items-center gap-4 border-t border-[#656923]'><IoSearchOutline className=' text-xl' /><span>search for"{debouncedSearch}"...</span></div>
        </div>
    )
}
