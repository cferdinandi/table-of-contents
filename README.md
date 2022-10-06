# Table of Contents

Automatically generate a table of contents from the headings on the page

[Demo](https://cferdinandi.github.io/table-of-contents/)

[Getting Started](#getting-started) | [Options & Settings](#options-and-settings) | [Browser Compatibility](#browser-compatibility) | [License](#license)

## Getting Started

### 1. Include Table of Contents on your site.

```html
<script src="path/to/table-of-contents.js"></script>
```

### 2. Add the markup to your HTML.

Include an empty element on the page that will hold your table of contents, and give it a unique selector. You also need to wrap the content that you want to generate your table of contents from in an element with a unique selector.

You can use any selectors you want. The example below uses data attributes.

```html
<div data-toc></div>



<div data-content>

<h2>Cat O'Nine Tails</h2>

<p>...</p>



<h3 id="the-brig">The Brig</h3>

<p>...</p>



<h4>Privateer</h4>

<p>...</p>



<h2>Ahoy</h2>

<p>...</p>

</div>
```

*__Note:__ headings without an ID will have one automatically generated based on the heading content.*

### 3. Initialize Table of Contents

In the footer of your page, after the content, initialize Table of Contents by passing in two arguments: the table of contents element selector, and content selector.

```html
<script> 
    tableOfContents('[data-toc]', '[data-content]');
</script>
```

## Options and Settings

`tableOfContents(contentSelector, resultSelector, settings, onBeforeScrollFn, onAfterScrollFn)`

### Selectors

**The content selector** is the selector in which the content to index is. For example, the selector for a blog post might be `.blog-post-content`

**The result selector** is an empty div in which the results will be print. For example, `.table-of-contents`

### Settings object:

```js

const settings = {
    levels: 'h2, h3, h4, h5, h6', // The heading levels to generate a table of contents from
    heading: { // Remove it or set it to null to disable the heading
         text: 'Test Heading', // The text of the heading
         headingLevel: "h2" // The heading's tag
    }, 
    listType: 'ul', // The list type to use for the table of contents
    headerOffset: 50, // The number in pixels to apply a space (useful for sticky headers)
    smooth: true // Smooth scroll. Default value is true
}
```

There are also two callback functions. `onBeforeScroll` is run before the scroll starts, and `onAfterScroll` runs after the scroll ends.

### Example:

```javascript
tableOfContents('[data-content]', '[data-toc]', {
levels: 'h2, h3, h4, h5, h6', // The heading levels to generate a table of contents from
heading: { // Remove it or set it to null to disable the heading
     text: 'Test Heading', // The text of the heading
     headingLevel: "h2" // The heading's tag
}, 
listType: 'ul', // The list type to use for the table of contents
headerOffset: 50, // The number in pixels to apply a space (useful for sticky headers)
smooth: true // Smooth scroll. Default value is true
}, onBeforeScroll, onAfterScroll);


function onBeforeScroll(){
    console.log("Starting scroll...");
}

function onAfterScroll() {
    console.log("Scroll ended");
}
```

## Browser Compatibility

Table of Contents works in all modern browsers, and IE 9 and above.

## License

The code is available under the [MIT License](LICENSE.md).
