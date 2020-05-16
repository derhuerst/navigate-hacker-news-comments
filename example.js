'use strict'

const {JSDOM} = require('jsdom')
const {readFileSync} = require('fs')
const {
	findComments,
	findSiblings,
	findChildren,
} = require('.')

const post = readFileSync(require.resolve('./test/hn-post.html'), {encoding: 'utf8'})

const {document} = new JSDOM(post).window

const comments = findComments(document)
while (true) {
	const {value, done} = comments.next()
	if (done) break
	console.log(value)
}

// const all = Array.from(findComments(document))
// const b = all.find(c => c.id === '23174668')
// console.log('b', b)

// const bSiblings = findSiblings(document, b.raw)
// while (true) {
// 	const {value, done} = bSiblings.next()
// 	if (done) break
// 	console.log('sibling', value)
// }

// const bChildren = findChildren(document, b.raw)
// while (true) {
// 	const {value, done} = bChildren.next()
// 	if (done) break
// 	console.log('child', value)
// }
