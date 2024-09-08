import axios from "axios";
import baseAddress from "./localhost";

const getRoomsPolls = async(joined,privateRoom,dispatch,setHotPost,clearHotPostsInfo,isLoading,setHasMore,page,title)=>{
    
    if (!joined && privateRoom) {
        setHasMore(false);
        dispatch(setHotPost([]))
       
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

            console.log("InsidegetPolls ",isLoading)
          }
        } catch (error) {
          console.log(error);
          setHasMore(false); // Stop fetching if there's an error
          console.log("InsidegetPolls ",isLoading)
        }
  
      }
}
export default getRoomsPolls;