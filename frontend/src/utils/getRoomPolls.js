import axios from "axios";
import baseAddress from "./localhost";

const getRoomsPolls = async(joined,privateRoom,dispatch,setHotPost,clearHotPostsInfo,setisLoading,setHasMore,page,title)=>{
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
          }
        } catch (error) {
          console.log(error);
          setHasMore(false); // Stop fetching if there's an error
          setisLoading(false);
        }
  
      }
}
export default getRoomsPolls;