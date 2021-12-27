/* eslint-disable @typescript-eslint/no-explicit-any */

// ===========
// 02-generics

{
    type Primitive = string | number | boolean;

    const identity = (
        x: Primitive | Array<Primitive> | Record<string, Primitive>,
    ) => x;

    const test1 = identity('a'); // typeof test1: Primitive | Primitive[] | Record<string, Primitive>
    const test2 = identity(1); // typeof test2: Primitive | Primitive[] | Record<string, Primitive>
}
{
    const identity = (x: any) => x;
    const test1 = identity('a'); // typeof test1: any
    const test2 = identity(1); // typeof test2: any
}
{
    const identity = <T>(x: T) => x;
    const test1 = identity<string>('a'); // typeof test1: string
    // const test2 = identity<string>(1); // Argument of type 'number' is not assignable to parameter of type 'string'
    const test3 = identity<number>(1); // typeof test2: number
}
{
    const identity = <T>(x: T) => x;
    const test1 = identity('a'); // typeof test1: "a"
    const test2 = identity(1); // typeof test2: 1
}

// ===================
// generic constraints
{
    const identity = <T extends string>(x: T) => x;
    const stringTest = identity('a'); // typeof stringTest: "a"
    // const numberTest = identity(1); // Argument of type 'number' is not assignable to parameter of type 'string'
}
{
    const identity = <T extends 'A' | 'B' | 'C'>(x: T) => x;
    const test1 = identity('A'); // typeof stringTest: "A"
    // const test2 = identity('D'); // Argument of type '"D"' is not assignable to parameter of type '"A" | "B" | "C"'
}
