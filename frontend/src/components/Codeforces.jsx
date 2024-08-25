export default function Codeforces({ rating }){
    const getItem = {
        "newbie": <p className="text-gray-500">newbie</p>,
        "pupil":<p className="text-green-500">pupil</p>,
        "specialist":<p className="text-blue-300">specialist</p>,
        "expert":<p className="text-blue-600">expert</p>,
        "candidate master":<p className="text-purple-500">Candidate master</p>,
        "master":<p className="text-orange-500">master</p>,
        "international master":<p className="text-orange-600">International master</p>,
        "grandmaster":<p className="text-red-600">Grandmaster</p>,
        "international grandmaster":<p className="text-red-700">International Grandmaster</p>,
        "legendary grandmaster":<p className="text-red-700"><span className="text-black">legendary</span> Grandmaster</p>

    }

    return getItem[rating];
}