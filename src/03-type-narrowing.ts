// ===========
// 02-keywords

{
    const format = (value: string | number) => {
        if (typeof value === 'string') {
            // value is of type string and all string functions are available within the if block
            return Number.parseFloat(value).toFixed(2);
        } else {
            // value is of type number and all number functions are available within the else block
            return value.toFixed(2);
        }
    };
}
{
    const a = { value: 'a' };
    const b = { value: 42 };
    type AOrB = typeof a | typeof b;

    const takeAOrB = (aOrB: AOrB) => {
        if (typeof aOrB.value === 'string') {
            const { value } = aOrB; // typeof value: string
        } else {
            const { value } = aOrB; // typeof value: number
        }
    };
}
{
    const a = { a: 'a' };
    const b = { b: 42 };
    type AOrB = typeof a | typeof b;

    const takeAOrB = (aOrB: AOrB) => {
        if ('a' in aOrB) {
            const { a } = aOrB; // typeof a: string
        } else {
            const { b } = aOrB; // typeof b: number
        }
    };
}

// =======================
// as const in union types

{
    const a = { kind: 'a' as const, value: 'a' };
    const b = { kind: 'b' as const, value: 42 };
    type AOrB = typeof a | typeof b;

    const takeAOrB = (aOrB: AOrB) => {
        if (aOrB.kind === 'a') {
            const { value } = aOrB; // typeof value: string
        } else {
            const { value } = aOrB; // typeof value: number
        }
    };
}
