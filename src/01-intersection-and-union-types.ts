/* eslint-disable prettier/prettier */

// ===============================
// 01-intersection-and-union-types

{
    type Intersection = { a: string } & { b: number };
    const test1: Intersection = { a: 'a', b: 1 }; // ok
    // const test2: Intersection = { a: 'a' }; // Property 'b' is missing in type '{ a: string; }' but required in type '{ b: number; }'
}
{
    type Union = { a: string } | { a: number };
    const test1: Union = { a: 'a' }; // ok
    const test2: Union = { a: 1 }; // ok
}

// =================
// inferface vs type

{
    interface A { a: string }
    interface B extends A { b: number }
    const test1: B = { a: 'a', b: 1 }; // ok
    // const test2: B = { a: 'a' }; // Property 'b' is missing in type '{ a: string; }' but required in type 'B'
}
{
    interface A { a: string }
    interface B { a: number }
    type Union = A | B;
    const test1: Union = { a: 'a' }; // ok
    const test2: Union = { a: 1 }; // ok
}
