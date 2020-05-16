'use strict'

const {JSDOM} = require('jsdom')
const {readFileSync} = require('fs')
const {
	ok,
	deepStrictEqual: dEql,
} = require('assert')
const {
	findComments,
	findSiblings,
	findChildren,
} = require('..')

// fixtures

const post = readFileSync(require.resolve('./hn-post.html'), {encoding: 'utf8'})
const {document} = new JSDOM(post).window

const expectedAll = require('./hn-post.json')

const a = expectedAll.find(c => c.id === '23178768')
ok(a, 'precondition failed: 23178768 not found')
const aSpanEl = document.querySelector('#unv_23178768')
ok(aSpanEl, 'precondition failed: 23178768 <span> not found')

const b = expectedAll.find(c => c.id === '23174668')
ok(b, 'precondition failed: 23174668 not found')
const bSpanEl = document.querySelector('#unv_23174668')
ok(bSpanEl, 'precondition failed: 23174668 <span> not found')

// tests

const all = findComments(document)
dEql(Array.from(all), expectedAll, 'all deep-equal')
console.info('all ✔︎')

const aSiblings = Array.from(findSiblings(document, aSpanEl))
dEql(aSiblings, [])
console.info('siblings of A ✔︎')

const bSiblings = Array.from(findSiblings(document, bSpanEl))
.map(item => item.id)
dEql(bSiblings, ['23174860', '23174031'])
console.info('siblings of B ✔︎')

const bChildren = Array.from(findChildren(document, bSpanEl))
.map(item => item.id)
dEql(bChildren, ['23175481', '23174868', '23175743', '23176412'])
console.info('chilren of B ✔︎')
