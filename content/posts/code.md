+++
date = '2025-06-13T10:21:30+02:00'
draft = true
title = 'Code'
+++

# Code blocks
EasyDocs uses highlight.js to render the code blocks. A list with all the supported languages is available [here](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md).

## How to use
To insert a code block, you can use three backticks (```) followed by the language name, as below.

```md
\`\`\`javascript
const greeting = "Hello, Markdown!";
console.log(greeting);
\`\`\`
```

In this example, the code is enclosed in a code block, and the specified language is JavaScript. Replace the javascript with the appropriate language identifier (e.g., python, java, bash, etc.) if you want to highlight the code.

!!! hint When using code blocks, remember to:
* Use backticks appropriately to enclose your code.
* Utilize language identifiers for syntax highlighting (if needed).
* Ensure there are no spaces between the backticks and the language identifier/code.
* Maintain consistent indentation for readability.
!!!

# Examples
## JavaScript
```js
const hello = "Hello world!";

console.log(hello);
```

## HTML
```html
<h1>Hello world!</h1>
```

## CSS
```css
.hello-world {
  color: red;
}
```

## Python
```py
hello = "Hello world!"

print(hello)
```

## Rust
```rust
fn main () {
  println!("Hello world!");
}
```