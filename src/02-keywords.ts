// ===========
// 02-keywords

// =======================
// typeof, keyof, as const

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

// ================
// as const vs enum

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
    /**
    let Country;
    (function (Country) {
        Country[(Country['AT'] = 0)] = 'AT';
        Country[(Country['DE'] = 1)] = 'DE';
        Country[(Country['CH'] = 2)] = 'CH';
    })(Country || (Country = {}));
    */
}
{
    // https://www.typescriptlang.org/play?target=99&jsx=0&ssl=5&ssc=6&pln=1&pc=1#code/AQ4UwOwVwW2BhA9lCAXATgT2AbwFCiHACCAKsALzABEZ1ANAUSACICilN7DTz8AEp2oCehAL5A
    enum Country {
        AT = 'AT',
        DE = 'DE',
        CH = 'CH',
    }

    // gets compiled to:
    /**
    var Country;
    (function (Country) {
        Country["AT"] = "AT";
        Country["DE"] = "DE";
        Country["CH"] = "CH";
    })(Country || (Country = {}));
    */
}
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
    doSomethingWithCountry(Country.AT); // ok
    // doSomethingWithCountry('US') // Argument of type '"US"' is not assignable to parameter of type '"AT" | "DE" | "CH"'
}
