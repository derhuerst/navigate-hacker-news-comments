'use strict'

const {JSDOM} = require('jsdom')
const {readFileSync} = require('fs')
const {
	deepStrictEqual: dEql,
} = require('assert')
const {
	findComments,
} = require('..')

// fixtures

const post = readFileSync(require.resolve('./hn-post.html'), {encoding: 'utf8'})
const {document} = new JSDOM(post).window

const expectedAll = require('./hn-post.json')

// tests

const all = findComments(document)
dEql(Array.from(all), expectedAll, 'all deep-equal')
console.info('all ✔︎')
