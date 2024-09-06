import axios from "axios";
import baseAddress from "./localhost";

const getRoomsPolls = async(joined,privateRoom,dispatch,setHotPost,clearHotPostsInfo,setSkeltonLoader,setHasMore,page,title)=>{
    
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
          const res = await axios.get(`${baseAddress}poll/getallpolls`, {
            params: {
              offset: page,
              limit: 10,
              subCommunity:title
            }
          });
          
          if (res.status === 200) {
            const fetchedPosts = res.data;
  
            if (fetchedPosts?.length < 10) {
              console.log('hasmore2 ',false);
              setHasMore(false);
            }

            // console.log("polls ",fetchedPosts);
            // dispatch(setSkeltonLoader())
            dispatch(setHotPost(fetchedPosts));
          }
        } catch (error) {
          console.log(error);
          setHasMore(false); // Stop fetching if there's an error
        //   dispatch(setSkeltonLoader())
        }
  
      }
}
export default getRoomsPolls;