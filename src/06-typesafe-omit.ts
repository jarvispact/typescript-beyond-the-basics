// ================
// 05-typesafe-omit

// naive

{
    const omit = (obj: Record<string, unknown>, keysToOmit: Array<string>) =>
        Object.fromEntries(
            Object.entries(obj).filter(([k]) => !keysToOmit.includes(k)),
        ) as Record<string, unknown>;

    const obj = { a: 'a', b: 'b' };

    omit(obj, ['c', '42']); // ['c', '42'] is a valid argument, but it should not be valid!

    const partialObj = omit(obj, ['a']); // typeof partialObj: Record<string, unknown>
    const a = partialObj.a; // typeof a: unknown
    const b = partialObj.b; // typeof b: unknown
    const c = partialObj.c; // typeof c: unknown
}

// ts support for keysToOmit

{
    const omit = <T extends Record<string, unknown>>(
        obj: T,
        keysToOmit: Array<keyof T>,
    ) =>
        Object.fromEntries(
            Object.entries(obj).filter(([k]) => !keysToOmit.includes(k)),
        ) as Record<string, unknown>;

    const obj = { a: 'a', b: 'b' };

    // omit(obj, ['c']); // Type '"c"' is not assignable to type '"a" | "b"'

    const partialObj = omit(obj, ['a']); // typeof partialObj: Record<string, unknown>
    const a = partialObj.a; // typeof a: unknown
    const b = partialObj.b; // typeof b: unknown
    const c = partialObj.c; // typeof c: unknown
}

// ts support for return value

{
    const omit = <T extends Record<string, unknown>>(
        obj: T,
        keysToOmit: Array<keyof T>,
    ) =>
        Object.fromEntries(
            Object.entries(obj).filter(([k]) => !keysToOmit.includes(k)),
        ) as Partial<T>;

    const obj = { a: 'a', b: 'b' };

    const partialObj = omit(obj, ['a']); // typeof partialObj: Partial<{a: string; b: string; }>
    const a = partialObj.a; // typeof a: string | undefined
    const b = partialObj.b; // typeof b: string | undefined
    // const c = partialObj.c; // Property 'c' does not exist on type 'Partial<{ a: string; b: string; }>'
}

// typesafe approach

{
    const omit = <T extends Record<string, unknown>, K extends Array<keyof T>>(
        obj: T,
        keysToOmit: K,
    ) =>
        Object.fromEntries(
            Object.entries(obj).filter(([k]) => !keysToOmit.includes(k)),
        ) as Omit<T, K[number]>;

    const obj = { a: 'a', b: 'b' };

    const partialObj = omit(obj, ['a']); // typeof partialObj: Omit<{ a: string; b: string; }, "a">
    // const a = partialObj.a; // Property 'a' does not exist on type 'Omit<{ a: string; b: string; }, "a">'
    const b = partialObj.b; // typeof b: string
    // const c = partialObj.c; // Property 'c' does not exist on type 'Omit<{ a: string; b: string; }, "a">'
}
