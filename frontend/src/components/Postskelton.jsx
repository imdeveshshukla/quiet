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
            <header className='flex justify-start gap-4 items-center my-2'>
                <div className=" w-32 h-32 xs:w-36 xs:h-36 rounded-full bg-white"></div>


                <div className=" w-1/2 xxs:w-2/3 flex flex-col">
                    <div className='h-10 bg-gray-300 w-full my-2 rounded'>
                    </div><div className='h-6 bg-gray-300 w-3/4 my-2 rounded'>
                    </div>
                    <div className="flex justify-end">
                    <div className='text-2xl h-6 w-8 bg-white'></div>
                    </div>
                </div>


            </header>




        </div>
    </>)
}