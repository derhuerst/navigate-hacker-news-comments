'use strict'

const {JSDOM} = require('jsdom')
const {readFileSync} = require('fs')
const {
	findComments,
} = require('.')

const post = readFileSync(require.resolve('./test/hn-post.html'), {encoding: 'utf8'})

const {document} = new JSDOM(post).window

const comments = findComments(document)
while (true) {
	const {value, done} = comments.next()
	if (done) break
	console.log(value)
}
