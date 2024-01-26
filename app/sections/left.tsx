import dynamic from 'next/dynamic'
import Todo from '../components/todo'

const Clock = dynamic(() => import('../components/clock'), { ssr: false })


export default function Left({ className }: { className?: string }) {
    return <div className={"flex flex-col " + className}>
        <div
            className='flex flex-col justify-center items-center w-full h-[25vh]'
        ><Clock className='text-5xl font-mono' />
        </div>
        <div className="flex flex-col justify-center items-center w-full h-[75vh] pb-24">
            <Todo />
        </div>
    </div>
}