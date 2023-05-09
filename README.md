<div align="center">
	<h1>X Enum</h1>
	<h4 align="center">
        An advanced typescript/javascript enumeration library with extra functionality and behaviors
	</h4>
</div>

<p align="center">
	<a href="#-installation-and-documentation">Installation</a> ❘
	<a href="#-features">Features</a> ❘
	<a href="#-usage">Usage</a>
</p>

## 🚀&nbsp; Installation and Documentation

```bash
npm install xenum
```

### Support

This package can be used either in frontend or backend with the same installation and the same examples described bellow


## 🥙 &nbsp; Features

- Gives you extendable and advanced way to build enums rather than the traditional typescript built in enum
- Easy to use
- Works with decorator pattern to give multiple synonyms to the enum
- it gives you the ability to build complex enums "enum of nested objects"
- types inferred from the enum
- building complex enums
- can be used in frontend or backend

## 📄&nbsp; Usage

### Enum Types
X Enum provides two types of enums
- basic enum: used for basic/primitive data types such as strings, numbers and symbols
- complex enum: used for complex data types such as objects and nested objects

#### Basic Enums

This is the standard type in this library and the commonly used one, it allows you to build an enum for the primitive data types like strings

```typescript
import { BaseEnum } from '../src/index';

class UserType extends BaseEnum<string>() {
    static Admin = new UserType('admin');
    static Moderator = new UserType('moderator');
    static Creator = new UserType('creator');
    static User = new UserType('user');
}
```

It's super simple to define your enum options, you just extend the base enum and define the data types you want as generic type and it will be inferred automatically

Now let's see how can we operate on the enum

##### Accessing an option

```typescript
console.log(UserType.Admin)
// output: UserType { option: 'admin' }
```

as you can see accessing an option in the enum will return to you an object containing the option, you can use something called `.getOption()` or `.toString()` to get the actual value of it

```typescript
console.log(UserType.Admin.getOption())
// output: admin
```

```typescript
console.log(UserType.Admin.toString())
// output: admin
```

**Note** for non string values, `getOption()` method is better because it returns the option as it's data type, but `toString()` method returns it as a string

##### Get Available options

```typescript
    console.log(UserType.GetAvailableOptionsAsStrings())
    // output: [ 'admin', 'moderator', 'creator', 'user' ]
```

or you can get the available options as array

**Note** this will return an array with the class itself for each option

```typescript
console.log(UserType.GetAvailableOptionsAsObjects())
/**
 * [
  UserType { option: 'admin' },
  UserType { option: 'moderator' },
  UserType { option: 'creator' },
  UserType { option: 'user' }
]
*/
```

you can also get the enum keys

```typescript
console.log(UserType.GetAvailableOptionsKeys())
// output: [ 'Admin', 'Moderator', 'Creator', 'User' ]
```

you can also get all the available options as a map, this will return a map with the key and value

```typescript
console.log(UserType.GetAvailableOptionsAsMap())
/**
 * Map(4) {
  'Admin' => UserType { option: 'admin' },
  'Moderator' => UserType { option: 'moderator' },
  'Creator' => UserType { option: 'creator' },
  'User' => UserType { option: 'user' }
}
*/
```

##### Aliases

What if you want to provide multiple synonymous for the same option, for example supposing you have the following enum shape

```typescript
class TshirtSize extends BaseEnum<string>() {
  static Small = new TshirtSize('small')
  static Medium = new TshirtSize('medium')
  static Large = new TshirtSize('large')
}
```
as you can see it's a t shirt sizes enum and you want also express multiple aliases for each size for example small has range from 36-38 then how can you express these also as valid options?

```typescript
class TshirtSize extends BaseEnum<string>() {
  @Aliases(['36', '38'])
  static Small = new TshirtSize('small')
  static Medium = new TshirtSize('medium')
  static Large = new TshirtSize('large')
}
```

using aliases decorator you are giving multiple synonyms to the same option

##### Check if the Enum has an option with a given key

Maybe you want to check if the eumeration has an option with a given key like the following case

suppose you have an APi and there is a payload is sent to the APi with `country` property and you want to check if this country name is listed in your enum or not like the following:

```typescript
class Country extends BaseEnum<string>() {
    static USA = new Country('USA')
}
const payload = { country: "usa" }
```

you need just to do the following:

```typescript
console.log(Country.GetFromString(payload.country))
// output: Country { settings: {}, option: 'USA' }
```

This method does internal checks if the given parameter matches one of either the enum keys or the enum values even if it's lowercased it will give you the right value. If the option is found it will return an object instance from it and you can use `getOption` or `toString` method to get the raw value, if the value does not exist then will return `null` value



#### Complex Enum Type

This enum type is built for complex structure that you might have, it can hold in the value nested objects, maps, sets, arrays and maybe other enums!

suppose you have country and each country has its own states or gornments list, then you want when to fetch a country you want to fetch the nested governments or states related to it, in that case you can use the complex enum

```typescript
interface IGovernmentEnum {
    name: string;
    code: string;
}

class GovernmentEnum extends ComplexEnum<IGovernmentEnum>() {
    static Cairo = new GovernmentEnum({
        name: 'Cairo',
        code: 'cairo',
    })
}

interface ICountryEnum {
    name: string;
    governments: GovernmentEnum[];
}

class Country extends ComplexEnum<ICountryEnum>() {
    static Egypt = new Country({
        name: 'Egypt',
        governments: [GovernmentEnum.Cairo],
    })
}
```

now the way to get from string is the same way as you do in basic enums, you can use `GetFromString` method

```typescript
console.log(Country.GetFromString('egypt'))
```

this should output the enum option

**Note** `GetFromString` method is smarter than you think!

This method does search in the enum key or the fields inside this option to check if the given parameter matches one of them or not


##### How to make the search matches your criteria?

In case you don't want the default behaivour `getFromString` method does, you can use a decorator called `OverrideEnumName`

This decorator actually lets you specify certin key "should be a string" to be validated against the entered param


```typescript
class UserType extends BaseEnum<string> {
    @OverrideEnumName('normalUser', { exact: true })
    user = new UserType('user')
}
```

with using this decorators the getFromString will return a found option only if you gave it `normalUser`

```typescript
UserType.GetFromString('normalUser') // output: UserType option
```

however if you passed to it any other value it will return null

```typescript
UserType.GetFromString('user') // output: null
```

There is an optional parameter you can pass to that decorator, it has only one proerty which is `exact`, it's a boolean value, default value is `false`, if sat to yes then the passed value should be match exaclty the enum key, if set to false it will do lowercase for both to compare them

```typescript
class UserType extends BaseEnum<string> {
    @OverrideEnumName('normalUser', { exact: false })
    user = new UserType('user')
}
UserType.GetFromString('normalUser') // will return result
```

```typescript
class UserType extends BaseEnum<string> {
    @OverrideEnumName('normalUser', { exact: true })
    user = new UserType('user')
}
UserType.GetFromString('normalUser') // will return null
```

