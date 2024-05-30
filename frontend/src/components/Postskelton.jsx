const Postskelton = ()=>{
    return <>
        <div class="rounded-3xl m-6 p-4 bg-gray-200 animate-pulse">
        <header class='flex gap-2 items-center my-2'>
            <div class="w-8 h-8 rounded-full bg-white"></div>
            <div class='h-4 bg-gray-300 w-32 my-2 rounded'></div>
        </header>
  
        <main class='cursor-pointer'>
            <div class='h-5 bg-gray-300 w-1/2 my-2 rounded'></div>
            <div class='h-4 bg-gray-300 w-3/4 my-2 rounded'></div>
            <div class='w-full max-h-[420px] object-contain py-2 bg-gray-300 rounded'></div>
        </main>
  
        <footer class='flex py-2 gap-6'>
            <div class='rounded-3xl flex gap-1 items-start justify-center p-2 bg-gray-300'>
            <div class="text-2xl h-6 w-6 rounded bg-white"></div>
            <div class='h-4 bg-gray-300 w-6 rounded'></div>
            <div class="text-2xl h-6 w-6 bg-white"></div>
            <div class='h-4 bg-gray-300 w-6 rounded'></div>
            </div>
    
            <div class='rounded-3xl flex gap-2 items-start justify-center p-2 cursor-pointer hover:text-blue-700 bg-gray-300'>
            <div class='text-2xl h-6 w-6 bg-white'></div>
            <div class='h-4 bg-gray-300 w-6 rounded'></div>
            </div>
    
    <div class='rounded-3xl flex gap-2 items-start justify-center p-2 bg-gray-300'>
      <div class='text-2xl h-6 w-6 bg-white'></div>
      <div class='h-4 bg-gray-300 w-16 rounded'></div>
    </div>
    
  </footer>
</div>
<div class='bg-gray-700 h-[1px]'></div>
    </>
}

export default Postskelton;