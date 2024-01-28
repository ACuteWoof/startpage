import { CheckIcon, Cross1Icon, ReloadIcon } from "@radix-ui/react-icons"

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
    const [todo, setTodo] = useState<{
        content: string,
        completed: boolean
    }[]>([])
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

    const submit = () => {
        if (input.length === 0) return;
        setTodo([...todo, { content: input, completed: false }])
        setInput("")
    }

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
                    <Input
                        type="text"
                        placeholder="Add a task."
                        onChange={
                            (e) => setInput(e.target.value)
                        } value={input}
                        onKeyDown={
                            (e) => {
                                if (e.key === "Enter") submit()
                            }
                        }
                    />
                    <Button
                        disabled={input.length === 0}
                        onClick={submit}
                    >Add</Button>
                </div></CardContent>
            <CardContent className="overflow-y-scroll">

                {
                    todo.length === 0 ?
                        <div className="flex justify-center items-center h-full text-muted-foreground">
                            Nothing to do?
                        </div> :
                        todo.sort(
                            (a, b) => {
                                if (a.completed && !b.completed) return 1
                                if (!a.completed && b.completed) return -1
                                return 0
                            }
                        ).map((_, i) => <TodoItem key={i} id={i} setTodo={setTodo} todo={todo} />)
                }
            </CardContent>
        </Card>
    )
}

function TodoItem({ id, setTodo, todo, className }: {
    id: number, setTodo: Dispatch<SetStateAction<{ content: string, completed: boolean }[]>>, todo: { content: string, completed: boolean }[], className?: string
}) {
    return (
        <div className={"flex justify-between items-center hover:bg-muted/20 border-b-[1px] px-4 py-2 " + (
            todo[id].completed ? "line-through text-muted-foreground" : "text-card-foreground"
        )}>
            <div className="flex items-center">
                <span>{todo[id].content}</span>
            </div>
            <div className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={
                    () => {
                        const newTodo = todo.filter((_, i) => i !== id)
                        setTodo(newTodo)
                    }
                }>
                    <Cross1Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={
                    () => {
                        const newTodo = todo.map((item, i) => {
                            if (i === id) {
                                return { ...item, completed: !item.completed }
                            }
                            return item
                        })
                        setTodo(newTodo)
                    }
                }>
                    {todo[id].completed ? <ReloadIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />
                    }
                </Button>
            </div>
        </div>
    )
}
