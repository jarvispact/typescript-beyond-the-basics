// ==============
// 04-object-keys

{
    const obj = { a: 'a', b: 'b' };
    type Obj = typeof obj; // { a: string; b: string; }
    type Key = keyof Obj; // "a" | "b"

    const keys = Object.keys(obj); // typeof keys: string[]
}
{
    const objectKeys = <T extends Record<string, unknown>>(obj: T) =>
        Object.keys(obj) as Array<keyof T>;

    const obj = { a: 'a', b: 'b' };

    const keys = objectKeys(obj); // typeof keys: ("a" | "b")[]
    type Key = typeof keys[number]; // "a" | "b"
}
