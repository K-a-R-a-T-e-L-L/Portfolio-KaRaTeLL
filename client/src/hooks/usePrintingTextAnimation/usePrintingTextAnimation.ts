import { useEffect, useState } from "react";

export const usePrintingTextAnimation = (text: string[], interval: number, errorWord: string) => {

    const [Line, setLine] = useState<number>(0);
    const [Count, setCount] = useState<number>(0);
    const [CountError, setCountError] = useState<number>(-1);
    const [Result, setResult] = useState<string>('');
    const [Finish, setFinish] = useState<boolean>(false);
    const [PresenceUndefined, setPresenceUndefined] = useState<boolean>(false);

    useEffect(() => {
        if (Finish) return

        const Timeout = setTimeout(() => {
            if (Result.includes(errorWord) && !PresenceUndefined) {
                setPresenceUndefined(true);
                setCountError(Result.length - Result.indexOf(errorWord));
            }

            if (PresenceUndefined) {
                if (CountError >= 0) {
                    setResult(value => value.slice(0, -1));
                    setCountError(value => value - 1);
                } else {
                    setPresenceUndefined(false);
                    setCount(Count);
                }
            }
            else {
                setResult(value => value + text[Line][Count]);
                if (Count >= text[Line].length - 1) {
                    setCount(0);
                    if (Line < text.length - 1) {
                        setLine(value => value + 1);
                    }
                    else {
                        setFinish(true);
                    }
                }
                else {
                    setCount(value => value + 1);
                }
            }

        }, PresenceUndefined ? interval + 50 : interval);

        return () => clearTimeout(Timeout);
    }, [text, interval, Count, Line, Finish, PresenceUndefined, CountError, Result, errorWord]);

    return [Result, Finish] as const;
};

