// =================
// 00-type-inference

// =============
// some examples

{
    const array = [1, '42', null]; // typeof array: (string | number | null)[]
    const item = array[0]; // typeof item: string | number | null
    // array.push(true); // Argument of type 'true' is not assignable to parameter of type 'string | number | null'
}
{
    // you can use a type annotation to also support "boolean" values
    const array: (string | number | null | boolean)[] = [1, '42', null];
    array.push(true); // ok
}
{
    const obj = { a: 'a', b: 'b' }; // typeof obj: { a: string; b: string; }
    // obj.c = 'c'; // Property 'c' does not exist on type '{ a: string; b: string; }'
}
{
    // you can use a type annotation to also support other string keys than "a" and "b"
    const obj: { [Key: string]: string } = { a: 'a', b: 'b' };
    obj.c = 'c'; // ok
}

// ==============================
// the difference in let vs const

{
    let aLetString = 'test'; // type: string
    const aConstString = 'test'; // type: "test"

    let aLetNumber = 1; // type: number
    const aConstNumber = 1; // type: 1

    const takeString = (x: string) => x;
    const result = takeString(aConstString); // typeof result: string
}

// =============
// literal types

// A string literal type can be considered a subtype of the string type.
// This means that a string literal type is assignable to a plain string,
// but not vice-versa.

{
    const B = 'B'; // typeof B: "B"
    type A = string;
    const test: A = B; // ok
}
{
    type A = 'A';
    // const test: A = 'B'; // Type '"B"' is not assignable to type '"A"'
}
