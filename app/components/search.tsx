import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Search() {
    const [input, setInput] = useState('');

    const submit = () => {
        setInput('')
        window.open(`https://duckduckgo.com/?q=${input}`, '_self')
    }

    return (
        <Card className="w-[75%] flex items-center space-x-2 p-4">
            <Input
                type="text"
                placeholder="Web Search"
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
                variant="outline"
            >
                Search
            </Button>
        </Card>
    )
}