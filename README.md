# typescript-beyond-the-basics
explaining intermediate to advanced typescript features

## sections

- 00-type-inference
- 01-intersection-and-union-types
- 02-keywords
- 03-type-narrowing
- 04-generics
- 05-object-keys
- 06-typesafe-omit

## Blog Post

## Intro

In this blog post i will not cover the absolute basics like type annotations with types like `string`, `number`, `boolean`, `Array` or `Record`. Also i wont explain how `unknown` and `any` works. I assume that you worked with typescript in the past. At the end of this post, you should have a better understanding of the following topics and how to use some more advanced features to write type safe code  where you maybe used `any` previously to bypass the typescript compiler:

- type-inference
- intersection and union types
- the keywords: `typeof`, `keyof` and `as const`
- type narrowing
- generics
- type guards

At the beginning, there will be some basics that you may know already. Bear with me. I try to keep it as short as possible and only cover the basics that are absolutely necessary for the subsequent topics like generics and type guards.

---

## Type inference

An example with arrays:

```ts
{
    const array = [1, '42', null]; // typeof array: (string | number | null)[]
    const item = array[0]; // typeof item: string | number | null
    array.push(true); // Argument of type 'true' is not assignable to parameter of type 'string | number | null'
}
{
    // you can use a type annotation to also support "boolean" values
    const array: (string | number | null | boolean)[] = [1, '42', null];
    array.push(true); // ok
}
```

Another example with objects:

```ts
{
    const obj = { a: 'a', b: 'b' }; // typeof obj: { a: string; b: string; }
    // obj.c = 'c'; // Property 'c' does not exist on type '{ a: string; b: string; }'
}
{
    // you can use a type annotation to also support other string keys than "a" and "b"
    const obj: { [Key: string]: string } = { a: 'a', b: 'b' };
    obj.c = 'c'; // ok
}
```

What is also very interesting is the difference between `let` and `const`:

```ts
{
    let aLetString = 'test'; // type: string
    const aConstString = 'test'; // type: "test"

    let aLetNumber = 1; // type: number
    const aConstNumber = 1; // type: 1

    const takeString = (x: string) => x;
    const result = takeString(aConstString); // typeof result: string
}
```

Have you noticed that we have passed something of type: `"test"` to our `takeString` function? The function accepts a argument of type `string`, but lets us pass something of type: `"test"` without any error. Heres why:

**A string literal type can be considered a subtype of the string type. This means that a string literal type is assignable to a plain string, but not vice-versa.**

Lets look at a example:

```ts
{
    const B = 'B'; // typeof B: "B"
    type A = string;
    const test: A = B; // ok
}
{
    type A = 'A';
    const test: A = 'B'; // Type '"B"' is not assignable to type '"A"'
}
```

---

## Intersection and Union types

Here an example of the `&` (intersection) and `|` (union) operators:

```ts
{
    type Intersection = { a: string } & { b: number };
    const test1: Intersection = { a: 'a', b: 1 }; // ok
    const test2: Intersection = { a: 'a' }; // Property 'b' is missing in type '{ a: string; }' but required in type '{ b: number; }'
}
{
    type Union = { a: string } | { a: number };
    const test1: Union = { a: 'a' }; // ok
    const test2: Union = { a: 1 }; // ok
}
```

There is a difference in `type` and `interface` for object types. You cannot use the `&` and `|` operators with interfaces, but you can with types. Personally i always use types because they have no limitations. However you can use the `extends` keyword, or use a type to make a union of 2 existing interfaces:

```ts
{
    interface A { a: string }
    interface B extends A { b: number }
    const test1: B = { a: 'a', b: 1 }; // ok
}
{
    interface A { a: string }
    interface B { a: number }
    type Union = A | B;
    const test1: Union = { a: 'a' }; // ok
    const test2: Union = { a: 1 }; // ok
}
```

---

## The keywords: `typeof`, `keyof` and `as const`

Maybe you have seen or used the types `typeof` and `keyof` before. `as const` seems to be not used a lot in the wild.

```ts
{
    const obj = { a: 'a', b: 'b' };
    type Obj = typeof obj; // { a: string; b: string; }
}
{
    const obj = { a: 'a', b: 'b' };
    type Key = keyof typeof obj; // "a" | "b"
}
{
    const obj = { a: 'a', b: 'b' } as const;
    type Obj = typeof obj; // { readonly a: "a"; readonly b: "b"; }
}
```

Lets have a closer look at the `as const` keyword and a potential use case to replace enums:

```ts
{
    // https://www.typescriptlang.org/play?target=99&jsx=0#code/AQ4UwOwVwW2BhA9lCAXATgT2AbwFCiHACCAKgDQFEgAiAopdSPABKOgC+QA
    enum Country {
        AT,
        DE,
        CH,
    }
}
{
    // gets compiled to:
    let Country;
    (function (Country) {
        Country[(Country['AT'] = 0)] = 'AT';
        Country[(Country['DE'] = 1)] = 'DE';
        Country[(Country['CH'] = 2)] = 'CH';
    })(Country || (Country = {}));
}
```

i dont like enums that have a number as the value, because now you have this number in your data and without the enum definition in your code you are not able to tell what this number means. Enums that have string values are better imho, since they have a semantic meaning:

```ts
{
    // https://www.typescriptlang.org/play?target=99&jsx=0&ssl=5&ssc=6&pln=1&pc=1#code/AQ4UwOwVwW2BhA9lCAXATgT2AbwFCiHACCAKsALzABEZ1ANAUSACICilN7DTz8AEp2oCehAL5A
    enum Country {
        AT = 'AT',
        DE = 'DE',
        CH = 'CH',
    }
}
{
    // gets compiled to:
    var Country;
    (function (Country) {
        Country["AT"] = "AT";
        Country["DE"] = "DE";
        Country["CH"] = "CH";
    })(Country || (Country = {}));
}
```

So what about `as const` ?

```ts
{
    const Country = {
        AT: 'AT',
        DE: 'DE',
        CH: 'CH',
    } as const;

    const values = Object.values(Country);
    type Country = typeof values[number];

    // gets compiled to:
    /**
    const Country = {
        AT: 'AT',
        DE: 'DE',
        CH: 'CH',
    };
    */
}
```

I leave it up to you to decide which one you like better. In the end it doesnt matter, but i like the fact that you have immediate intellisense with the `as const` variant and dont need to import the enum on every place where you use this enum:

```ts
{
    enum Country {
        AT = 'AT',
        DE = 'DE',
        CH = 'CH',
    }

    // you always need to import the Country enum to use this function
    const doSomethingWithEnum = (country: Country) => country;

    doSomethingWithEnum(Country.AT); // ok
    // doSomethingWithEnum('AT'); // Argument of type '"AT"' is not assignable to parameter of type 'Country'

    // However doSomethingWithEnum('AT') would lead to working javascript code!
}
{
    const Country = {
        AT: 'AT',
        DE: 'DE',
        CH: 'CH',
    } as const;

    const values = Object.values(Country);
    type Country = typeof values[number];

    // intellisense support and no need to import the country object to use this function
    const doSomethingWithCountry = (country: Country) => country;

    doSomethingWithCountry('AT'); // ok
    // doSomethingWithCountry('US') // Argument of type '"US"' is not assignable to parameter of type '"AT" | "DE" | "CH"'
}
```

Apart from the potential replacement of a enum, `as const` can be used for other things as well. I will show you another use case within the next section.

---

## Type narrowing

Type narrowing can be used to accept different types in a function, but then safely narrow down the type and perform different actions for different types:

```ts
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
```

Typescript has really awesome type inference, which lets us narrow the type based on a type of a common property:

```ts
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
```

But we can also narrow it if they have no common property, but 2 different proeprties:

```ts
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
```

At some point it becomes practical to introduce a `kind` or `type` property which then can be used to distinguish between different types:

```ts
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
```

Ok, i think that one was pretty straightforward. Now lets dig into generics. I have used typescript long time without ever writing a generic type myself. They may look scary, but trust me, as soon as you know how to use generics, it will open up a whole new world for you and unlock some really cool features :)

---

## Generics

Generics can be hard to understand if you have never worked with a type system before, thats why i want to explain it in detail to you. Imagine that you want to avoid a generic parameter you could write a identity function that just passes back everything you give it like this:

```ts
{
    type Primitive = string | number | boolean;

    const identity = (
        x: Primitive | Array<Primitive> | Record<string, Primitive>,
    ) => x;

    const test1 = identity('a'); // typeof test1: Primitive | Primitive[] | Record<string, Primitive>
    const test2 = identity(1); // typeof test2: Primitive | Primitive[] | Record<string, Primitive>
}
```

Now we are accepting almost all types as input, but the returned value is also of type: "almost all". So it is a pain for you to write down every possible type and you give no guarantee back to the user of this function. You can save yourself from writing all of these types and just use `any`:

```ts
{
    const identity = (x: any) => x;
    const test1 = identity('a'); // typeof test1: any
    const test2 = identity(1); // typeof test2: any
}
```

But again, you give no guarantee back to the user of this function. Wouldnt it be nice to just give the user of the function his own type back?

```ts
{
    const identity = <T>(x: T) => x;
    const test1 = identity<string>('a'); // typeof test1: string
    const test2 = identity<string>(1); // Argument of type 'number' is not assignable to parameter of type 'string'
    const test3 = identity<number>(1); // typeof test2: number
}
```

Let me try to explain with my own words how this works:

You want to write a util function that one of your co-workers can use and this function is the `identity` function in the examples above. There are 2 views on this:

- You as the writer of the function
- The user of this util function (your co-worker)

First you need to write this function, before anybody is able to use it. That means that at the time you write this function, you have no idea which type will be passed to this function by your co-worker. It could be `any`thing 😉. The type is only known once the function is called with some argument. Your co-worker can even rely on the type inference from typescript and dont specify a type at all:

```ts
{
    const identity = <T>(x: T) => x;
    const test1 = identity('a'); // typeof test1: "a"
    const test2 = identity(1); // typeof test2: 1
}
```

Awesome! You can even restrict the input via the `extends` keyword. Lets see 2 examples on how we could restrict the identity function to only accept a string or union type:

```ts
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
```

Now we are at a point where we can have a look at a real world example of a function with a generic argument and a constraint. This is a util function that i need in every project, and after the next section, you will probably also have one in every project from now on.

---

## Fixing `Object.keys`

I dont know if you have noticed this already, but the builtin function to get the keys of an object (`Object.keys`) has not the correct typings. Here is the problem:

```ts
{
    const obj = { a: 'a', b: 'b' };
    type Obj = typeof obj; // { a: string; b: string; }
    type Key = keyof Obj; // "a" | "b"

    const keys = Object.keys(obj); // typeof keys: string[]
}
```

I would expect the type of `keys` to be: `"a" | "b"`. Typescript inferred it correctly, but the type of the return value of `Object.keys` seems wrong. Now that we know what the problem is, we can try to write our own wrapper function with proper typing:

```ts
{
    const objectKeys = <T extends Record<string, unknown>>(obj: T) =>
        Object.keys(obj) as Array<keyof T>;

    const obj = { a: 'a', b: 'b' };

    const keys = objectKeys(obj); // typeof keys: ("a" | "b")[]
    type Key = typeof keys[number]; // "a" | "b"
}
```

What happens here? We created a function that accepts a argument with an generic type, but we have restricted it to an object type. So typescript will complain if you try to pass a `string` or a `Array` as argument. Since typescript has really good type inference, it will know that only `a` and `b` are valid keys for this object and pass back this type to us: `("a" | "b")[]`. If you would add a `c` key to the object, it will pass you back: `("a" | "b" | "c")[]` without any changes on the implementation of the function and without writing a type yourself. Thats the power of generics.

---

## A type safe `omit` function

Lets do this in 4 iterations, going from an naive approach to a full typesafe approach. The logic for the omit function is the same in all 4 iterations. We will only change the types.

### Naive

```ts
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
```

In this approach we are not using generics. The only typescript support we have is that the first argument needs to be a object and the second should be a array of strings. The type of the return value is: `Record<string, unknown>` which basically means: some unknown object. `a` and `b` on the return type are typed as `unknown`. If we try to access `c` which was not even present on the input, we get `unknown` and no error. 😔

### Typescript support for `keysToOmit`

```ts
{
    const omit = <T extends Record<string, unknown>>(
        obj: T,
        keysToOmit: Array<keyof T>,
    ) =>
        Object.fromEntries(
            Object.entries(obj).filter(([k]) => !keysToOmit.includes(k)),
        ) as Record<string, unknown>;

    const obj = { a: 'a', b: 'b' };

    omit(obj, ['c']); // Type '"c"' is not assignable to type '"a" | "b"'

    const partialObj = omit(obj, ['a']); // typeof partialObj: Record<string, unknown>
    const a = partialObj.a; // typeof a: unknown
    const b = partialObj.b; // typeof b: unknown
    const c = partialObj.c; // typeof c: unknown
}
```

Now we are using generics and by doing so, we can provide the user of the function with some intellisense for the `keysToOmit` argument. But the type of the return value is still: `Record<string, unknown>`. Also we still get `unknown` for `a`, `b` and `c`. 😔

### Typings for the return value

```ts
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
    const c = partialObj.c; // Property 'c' does not exist on type 'Partial<{ a: string; b: string; }>'
}
```

We still have the improvements from the last iteration regarding the `keysToOmit` argument, but now also add `as Partial<T>` to the end, which makes the type of the return value a **little** more accurate. `a` and `b` are typed with `string | undefined` which is somehow correct. But we now get a error when we try to access `c`. Still not perfect. 😔

### Typesafe approach

```ts
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
    const a = partialObj.a; // Property 'a' does not exist on type 'Omit<{ a: string; b: string; }, "a">'
    const b = partialObj.b; // typeof b: string
    const c = partialObj.c; // Property 'c' does not exist on type 'Omit<{ a: string; b: string; }, "a">'
}
```

Now look at this. It is wonderful. You have all the benefits of the previous iterations and also the type of the return value is now 100% correct. Only `b` is a valid key and it is typed as `string` which is also correct. Trying to access `a` on the return value will result in an error, because it was removed by our function. Trying to access `c` will also result in an error, since it was not even present on the input object. 😍