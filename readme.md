# navigate-hacker-news-comments

**Navigate in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) of a [Hacker News](https://news.ycombinator.com) comments page.**

[![npm version](https://img.shields.io/npm/v/navigate-hacker-news-comments.svg)](https://www.npmjs.com/package/navigate-hacker-news-comments)
[![build status](https://api.travis-ci.org/derhuerst/navigate-hacker-news-comments.svg?branch=master)](https://travis-ci.org/derhuerst/navigate-hacker-news-comments)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/navigate-hacker-news-comments.svg)
![minimum Node.js version](https://img.shields.io/node/v/navigate-hacker-news-comments.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)


## Installation

```shell
npm install navigate-hacker-news-comments
```


## Usage

We assume that you run this code on a Hacker News post (such as [this one](https://news.ycombinator.com/item?id=23172483)) or comments page (such as [this one](https://news.ycombinator.com/item?id=23176953)). In the following examples, we will use the [`test/hn-post.html`](test/hn-post.html).

### all comments

Let's find all comments, in the [depth-first](https://en.wikipedia.org/wiki/Depth-first_search) order in which they occur in the page:

```js
const {findComments} = require('navigate-hacker-news-comments')

const comments = findComments(document)
while (true) {
	const {done, value: comment} = comments.next()
	if (done) break
	console.log(comment)
}
```

`findComments` is a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that walks the DOM step by step. It returns an [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol), so we can collect all comments using [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from):

```js
const allComments = Array.from(findComments(document))
console.log(...allComments.slice(0, 3))
```

```js
{
	id: '23173572',
	parentId: '23172483',
	author: 'aazaa',
	age: '12 hours ago',
	text: '> ... Deno is (and always will be) a single…',
	level: 0,
}
{
	id: '23173707',
	parentId: '23173572',
	author: 'bgdam',
	age: '12 hours ago',
	text: 'See the thing about the sandbox…',
	level: 40,
}
{
	id: '23175634',
	parentId: '23173707',
	author: 'danShumway',
	age: '7 hours ago',
	text: `> That combined with the 'download…`,
	level: 80,
}
```

### siblings

To find *siblings* (comments replying to the same parent) of a comment:

```js
const {
	findCommentElement,
	findSiblings,
} = require('navigate-hacker-news-comments')

const foo = findCommentElement(document, '23174668')
const fooSiblings = findSiblings(document, foo)
Array.from(fooSiblings).length // 2
```

### children

To find children of a comment:

```js
const {findChildren} = require('navigate-hacker-news-comments')

const fooChildren = findChildren(document, foo)
Array.from(fooChildren).length // 4
```

### Node.js

If you want to use this package in Node.js, use [jsdom](https://github.com/jsdom/jsdom) to emulate the DOM:

```js
const {readFileSync} = require('fs')
const {JSDOM} = require('jsdom')

const post = readFileSync('path/to/hn-comments.html', {encoding: 'utf8'})
const {document} = new JSDOM(post).window
```


## Contributing

If you have a question or need support using `navigate-hacker-news-comments`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/navigate-hacker-news-comments/issues).
