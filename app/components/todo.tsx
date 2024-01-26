import { BellIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

type CardProps = React.ComponentProps<typeof Card>

export default function Todo({ className, ...props }: CardProps) {
    const [todo, setTodo] = useState<string[]>([])
    const [todoLoadedFromStorage, setTodoLoadedFromStorage] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")

    useEffect(() => {
        const localTodo = localStorage.getItem("todo")
        if (localTodo) {
            setTodo(JSON.parse(localTodo))
        }
        setTodoLoadedFromStorage(true)
    }, [])

    useEffect(() => {
        if (!todoLoadedFromStorage) return;
        localStorage.setItem("todo", JSON.stringify(todo))
    }, [todo, todoLoadedFromStorage])


    return (
        <Card className={cn("w-[75%] h-full flex flex-col", className)} {...props}>
            <CardHeader>
                <CardTitle>Todo</CardTitle>
                <CardDescription>
                    Proverbs 26:14 KJV <br />
                    As the door turneth upon his hinges, So doth the slothful upon his bed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full items-center space-x-2">
                    <Input type="text" placeholder="Add a task." onChange={
                        (e) => setInput(e.target.value)
                    } value={input} />
                    <Button
                        disabled={input.length === 0}
                        onClick={
                            () => {
                                setTodo([...todo, input])
                                setInput("")
                            }
                        }
                    >Add</Button>
                </div></CardContent>
            <CardContent className="overflow-y-scroll">

                {
                    todo.length === 0 ?
                        <div className="flex justify-center items-center h-full text-muted-foreground">
                            Nothing to do?
                        </div> :
                        todo.map((_, i) => <TodoItem key={i} id={i} setTodo={setTodo} todo={todo} />)
                }
            </CardContent>
        </Card>
    )
}

function TodoItem({ id, setTodo, todo, className }: {
    id: number, setTodo: Dispatch<SetStateAction<string[]>>, todo: string[], className?: string
}) {
    return (
        <div className="flex justify-between items-center hover:bg-black/70 px-4 py-2 rounded-lg">
            <div className="flex items-center">
                <span>{todo[id]}</span>
            </div>
            <Button variant="outline" size="icon" onClick={
                () => {
                    const newTodo = todo.filter((_, i) => i !== id)
                    setTodo(newTodo)
                }
            }>
                <CheckIcon className="w-4 h-4" />
            </Button>
        </div>
    )
}
