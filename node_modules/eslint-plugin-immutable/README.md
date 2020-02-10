# eslint-plugin-immutable

This is an ESLint plugin to disable all mutation in JavaScript. Think this is a bit too restrictive? Well if you're using Redux and React, there isn't much reason for your code to be mutating *anything*. Redux maintains a mutable pointer to your immutable application state, and React manages your DOM state. Your components should be stateless functions, translating data into Virtual DOM objects whenever Redux emits a new state. These ESLint rules explicitly prohibit mutation, effectively forcing you to write code very similar to [Elm](http://elm-lang.org/) in React.

## Installing

`npm install eslint-plugin-immutable --save-dev`

## ESLint Rules
There are three rules in the plugin:

### no-let

There's no reason to use `let` in a Redux/React application, because all your state is managed by either Redux or React. Use `const` instead, and avoid state bugs altogether.

```JavaScript
let x = 5; // <- Unexpected let or var, use const.
```

What about `for` loops? Loops can be replaced with the Array methods like `map`, `filter`, and so on. If you find the built-in JS Array methods lacking, use [lodash](https://github.com/lodash/lodash).

```JavaScript
const SearchResults = 
  ({ results }) => 
    <ul>{
      results.map(result => <li>result</li>) // <- Who needs let?
    }</ul>;
```

### no-this

Thanks to libraries like [recompose](https://github.com/acdlite/recompose) and Redux's [React Container components](http://redux.js.org/docs/basics/UsageWithReact.html), there's not much reason to build Components using `React.createClass` or ES6 classes anymore. The `no-this` rule makes this explicit.

```JavaScript
const Message = React.createClass({
  render: function() {
    return <div>{ this.props.message }</div>; // <- no this allowed
  }
})
```

Instead of creating classes, you should use React 0.14's [Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.t5z2fdit6) and save yourself some keystrokes:

```JavaScript
const Message = ({message}) => <div>{ message }</div>;
```

What about lifecycle methods like `shouldComponentUpdate`? We can use the [recompose](https://github.com/acdlite/recompose) library to apply these optimizations to your Stateless Functional Components. The [recompose](https://github.com/acdlite/recompose) library relies on the fact that your Redux state is immutable to efficiently implement shouldComponentUpdate for you.

```JavaScript
import { pure, onlyUpdateForKeys } from 'recompose';

const Message = ({message}) => <div>{ message }</div>;

// Optimized version of same component, using shallow comparison of props
// Same effect as React's PureRenderMixin
const OptimizedMessage = pure(Message);

// Even more optimized: only updates if specific prop keys have changed
const HyperOptimizedMessage = onlyUpdateForKeys(['message'], Message);
```

### no-mutation

You might think that prohibiting the use of `let` and `var` would eliminate mutation from your JavaScript code. **Wrong.** Turns out that there's a pretty big loophole in `const`...

```JavaScript
const point = { x: 23, y: 44 };
point.x = 99; // This is legal
```

This is why the `no-mutation` rule exists. This rule prevents you from assigning a value to the result of a member expression.

```JavaScript
const point = { x: 23, y: 44 };
point.x = 99; // <- No object mutation allowed.
```

This rule is just as effective as using Object.freeze() to prevent mutations in your Redux reducers. However this rule has **no run-time cost.** A good alternative to object mutation is to use the object spread syntax coming in ES2016.

```JavaScript
const point = { x: 23, y: 44 };
const transformedPoint = { ...point, x: 99 };
```

You can enable this syntax using the [syntax-object-rest-spread](https://babeljs.io/docs/plugins/syntax-object-rest-spread/) [Babel](https://babeljs.io/) plug-in.

## Supplementary ESLint Rules to Enable

The rules in this package alone can not eliminate mutation in your JavaScript programs. To go the distance I suggest you also enable the following built-in ESLint rules:

* no-var (self-explanatory)
* no-undef (prevents assigning to global variables that haven't been declared)
* no-param-reassign (prevents assigning to variables introduced as function parameters)

## Sample Configuration File

Here's a sample ESLint configuration file that activates these rules:

```
{
    "extends": "airbnb",
    "plugins": [
        "immutable"
    ],
    "rules": {
    	"immutable/no-let": 2,
    	"immutable/no-this": 2,
    	"immutable/no-mutation": 2
    }
}
```

Special Thanks to [cerealbox](https://github.com/cerealbox) who paired with me on this.
