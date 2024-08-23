const Postskelton = () => {
    return <>
        <div className=" h-full rounded-3xl m-2 p-2 xxs:m-6 xxs:p-4 bg-[#a3a674f0] animate-pulse">
            <header className='flex gap-2 items-center my-2'>
                <div className="w-8 h-8 rounded-full bg-white"></div>
                <div className='h-4 bg-gray-300 w-32 my-2 rounded'></div>
            </header>

            <main className='cursor-pointer'>
                <div className='h-5 bg-gray-300 w-1/2 my-2 rounded'></div>
                <div className='h-4 bg-gray-300 w-3/4 my-2 rounded'></div>
                <div className='w-full max-h-[420px] object-contain py-2 bg-gray-300 rounded'></div>
                <div className='w-full h-[30vh] object-contain py-2 bg-gray-300 rounded'></div>

            </main>

            <footer className='flex py-2 gap-2 xs:gap-6'>
                <div className='rounded-3xl flex gap-1 items-start justify-center p-2 bg-gray-300'>
                    <div className="text-2xl h-6 w-6 rounded bg-white"></div>
                    <div className='h-4 bg-gray-300 w-6 rounded'></div>
                    <div className="text-2xl h-6 w-6 bg-white"></div>
                    <div className='h-4 bg-gray-300 w-6 rounded'></div>
                </div>

                <div className='rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-gray-300'>
                    <div className='text-2xl h-6 w-6 bg-white'></div>
                    <div className='h-4 bg-gray-300 w-6 rounded'></div>
                </div>

                <div className='rounded-3xl flex gap-2 items-start justify-center p-2 bg-gray-300'>
                    <div className='text-2xl h-6 w-6 bg-white'></div>
                    <div className='h-4 bg-gray-300 w-16 rounded'></div>
                </div>

            </footer>
        </div>
        <div className='bg-gray-700 h-[1px]'></div>
    </>
}

export default Postskelton;


export const CommentSkelton = () => {
    return (<>
        <div className="  rounded-3xl m-2 p-2 xxs:m-6 xxs:p-4 bg-[#a3a674f0] animate-pulse">
            <header className='flex gap-2 items-center my-2'>
                <div className="w-12 h-12 rounded-full bg-white"></div>
                <div className='h-6 bg-gray-300 w-2/3 my-2 rounded'></div>
            </header>

            <main className='cursor-pointer'>

                <div className='w-full max-h-[420px] object-contain py-2 bg-gray-300 rounded'></div>
                <div className='w-full flex flex-col items-start pl-8  object-contain py-2 bg-gray-300 rounded'>
                    <div className='h-8 bg-gray-400 w-3/4 my-2 rounded'></div>
                    <footer className='flex py-2 gap-2 xs:gap-6'>
                        <div className='rounded-3xl flex gap-1 items-start justify-center p-2 bg-gray-400'>
                            <div className="text-2xl h-6 w-6 rounded bg-white"></div>

                            <div className="text-2xl h-6 w-6 rounded bg-white"></div>

                        </div>

                        <div className='rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-gray-400'>
                            <div className='text-2xl h-6 w-6 bg-white'></div>

                        </div>

                        <div className='rounded-3xl flex gap-2 items-start justify-center p-2 bg-gray-400'>
                            <div className='text-2xl h-6 w-6 bg-white'></div>

                        </div>

                    </footer>
                </div>

            </main>


        </div>
        <div className='bg-gray-700 h-[1px]'></div>
    </>)
}


export const ProfileSkelton = () => {
    return (<>
        <div className=" h-full rounded-3xl m-2 p-2 xxs:m-6 xxs:p-4 bg-[#a3a674f0] animate-pulse">
            <header className='flex justify-start gap-4 items-center my-2 animate-pulse'>
                <div className=" w-32 h-32 xs:w-36 xs:h-36 rounded-full bg-white"></div>


                <div className=" w-1/2 xxs:w-2/3 flex flex-col">
                    <div className='h-10 bg-gray-300 w-full my-2 rounded animate-pulse'></div>
                    <div className='h-6 bg-gray-300 w-3/4 my-2 rounded animate-pulse'></div>
                    <div className="flex justify-end">
                        <div className='text-2xl h-6 w-8 bg-white animate-pulse'></div>
                    </div>
                </div>


            </header>




        </div>
    </>)
}



export const LeetCodeSkelton = () => {
    return (<>
        <div className="grid grid-cols-[1fr_1fr] gap-8 xxs:gap-16 bg-[#e2e4c6]  p-4 xxs:p-8 rounded-xl w-fit   ">

            <div className=" w-32 h-32 xs:w-36 xs:h-36 p-2 rounded-full bg-gray-400 animate-pulse">
                <div className=" w-full h-full  rounded-full bg-white animate-pulse"></div>
            </div>


            <div className="  flex flex-col justify-between">
                <div className='px-10 py-4 bg-gray-300 rounded animate-pulse'></div>
                <div className='px-10 py-4 bg-gray-300 rounded animate-pulse'></div>
                <div className='px-10 py-4 bg-gray-300 rounded animate-pulse'></div>
            </div>
        </div>
    </>)
}
export const SearchSkelton = () => {
    return (<>
        

            <div className=" w-full flex flex-col gap-2 p-4 justify-between">
                <div className=' flex items-center justify-start pl-3 w-full h-12 bg-[#acb886] rounded animate-pulse'>
                    <div className=" h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                </div>
                <div className=' flex items-center justify-start pl-3 w-full h-12 bg-[#acb886] rounded animate-pulse'>
                    <div className=" h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                </div>
                <div className=' flex items-center justify-start pl-3 w-full h-12 bg-[#acb886] rounded animate-pulse'>
                    <div className=" h-10 w-10 rounded-full bg-gray-100 animate-pulse"></div>
                </div>
            </div>
       
    </>)
}