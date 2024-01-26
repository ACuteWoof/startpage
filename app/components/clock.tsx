import { useState, useEffect } from 'react';

export default function Clock({ className }: { className?: string }) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        var timerID = setInterval(() => tick(), 1000);

        return function cleanup() {
            clearInterval(timerID);
        };
    });

    function tick() {
        setDate(new Date());
    }

    return (<span className={className}>{date.toLocaleTimeString('en-US', {
        hour12: false,
    })}</span>);
}