import axios from "axios";
import baseAddress from "./localhost";

const getRoomsPolls = async(joined,privateRoom,dispatch,setHotPost,clearHotPostsInfo,setisLoading,isLoading,setHasMore,page,title)=>{
    setisLoading(true);
    if (!joined && privateRoom) {
        setHasMore(false);
        dispatch(setHotPost([]))
        setisLoading(false);
        return;
      }
      else {
        if (page == 0) {
          dispatch(clearHotPostsInfo())
        }
        try {
        //   dispatch(setSkeltonLoader())
          console.log("InsidegetPolls ",isLoading)
          const res = await axios.get(`${baseAddress}poll/getallpolls`, {
            params: {
              offset: page,
              limit: 10,
              subCommunity:title
            }
          });
          
          if (res.status === 200) {
            const fetchedPosts = res.data;
            dispatch(setHotPost(fetchedPosts));
            if (fetchedPosts?.length < 10) {
              setHasMore(false);
            }

            setisLoading(false);
            console.log("InsidegetPolls ",isLoading)
          }
        } catch (error) {
          console.log(error);
          setHasMore(false); // Stop fetching if there's an error
          setisLoading(false);
          console.log("InsidegetPolls ",isLoading)
        }
  
      }
}
export default getRoomsPolls;