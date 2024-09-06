import React from 'react'

const ConfirmWindow = ({ setifDelete,msg, setOpenConfirm }) => {

    const handleClick=(value)=>{
        if(value){
            setifDelete(true);
        }
        setOpenConfirm(false)
    }

    return (
        <div>
            <div className=' fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-20 backdrop-blur-md '>

                <div className=' bg-[#e3e7a7b8] border-[#595f0c] absolute py-8 space-y-8 top-1/2 z-50 w-[420px] left-1/2 translate-y-[-50%] translate-x-[-50%] px-6 flex flex-col justify-center items-center border-2 rounded-lg'>
                    <div className='text-[#535800] break-words text-lg font-ubuntu font-semibold '>
                        {msg}
                    </div>

                    <div className=' flex items-center justify-evenly w-full'>
                        <button onClick={()=> handleClick(false)} className=' rounded-md hover:bg-slate-200 px-3 py-1 bg-white text-lg font-ubuntu '>
                            Cancle
                        </button>
                        <button onClick={()=>handleClick(true)} className=' rounded-md  px-3 py-1 hover:bg-[#ff0000a1] text-white bg-[#FF0000] text-lg font-ubuntu '>
                            Confirm
                        </button>
                        
                    </div>



                </div>

            </div>
        </div>
    )
}

export default ConfirmWindow
