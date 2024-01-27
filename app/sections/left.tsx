import dynamic from 'next/dynamic'
import Todo from '../components/todo'
import Search from '../components/search'

const Clock = dynamic(() => import('../components/clock'), { ssr: false })


export default function Left({ className }: { className?: string }) {
    return <div className={"flex flex-col " + className}>
        <div
            className='flex flex-col justify-center items-center w-full h-[25vh]'
        ><Clock className='text-7xl' />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center w-full h-[75vh] pb-24">
            <Search />
            <Todo />
        </div>
    </div>
}