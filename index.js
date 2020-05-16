'use strict'

const sortedIdx = require('lodash/sortedIndexBy')

const _indent = (doc, tr) => {
	const img = tr.querySelector('td.ind img')
	if (!img) return null
	const indent = parseInt(img.getAttribute('width'))
	return Number.isInteger(indent) ? indent : null
}

const _id = (doc, tr) => {
	const link = tr.querySelector('.comhead .age a')
	if (!link) return null
	const href = link.getAttribute('href')
	return href && new URL(href, 'a://b').searchParams.get('id') || null
}

const _author = (doc, tr) => {
	const userLink = tr.querySelector('.comhead .hnuser')
	if (!userLink) return null
	const href = userLink.getAttribute('href')
	return href && new URL(href, 'a://b').searchParams.get('id') || null
}

const _age = (doc, tr) => {
	const age = tr.querySelector('.comhead .age')
	return age && age.textContent || null
}

const _text = (doc, tr) => {
	const span = tr.querySelector('.commtext')
	if (!span) return null

	// todo: handle <pre><code> blocks, line breaks, etc
	// use a proper DOM to markdown tool?
	const text = Array.from(span.childNodes)
	.map((el) => {
		if (el.wholeText) return el.wholeText
		if (!el.classList) return null
		if (Array.from(el.classList.values()).includes('reply')) return null
		return (el.nodeName === 'P' ? '\n\n' : '') + el.textContent
	})
	.filter(t => t !== null)
	.join('')

	return text || null
}

const _findNext = (doc, tr) => {
	for (let i = 0; i < 10; i++) {
		tr = tr.nextElementSibling
		if (!tr) return null // no successor
		if (_indent(doc, tr) === null) continue
		return tr
	}
	return null
}

// indents: [[ident, id], ...]
const _parent = (indents, indent, id) => {
	const item = [indent, id]

	const idx = sortedIdx(indents, [indent], item => item[0])
	if (idx === 0) throw new Error('invalid comment tree: 2 roots?')

	if (idx >= indents.length) { // append, a.k.a. walk down the tree
		return {
			parent: indents[indents.length - 1][1],
			indents: [...indents, item],
		}
	}
	// replace, a.k.a. jump to neighbor
	return {
		parent: indents[idx - 1][1],
		indents: [...indents.slice(0, idx), item],
	}
}

const findComments = function* (document, start = null) {
	const rootId = document.querySelector('tr.athing[id]').getAttribute('id')
	let indents = [
		[-1, rootId],
	]

	let c = start
		? start.closest('tr.comtr')
		: document.querySelector('.comment-tree tr.comtr')
	while (c) {
		const id = _id(document, c)
		const indent = _indent(document, c)
		const {parent, indents: newIndents} = _parent(indents, indent, id)
		const comment = {
			id,
			parentId: parent,
			author: _author(document, c),
			age: _age(document, c),
			text: _text(document, c),
			level: indent, // todo: normalize?
		}
		Object.defineProperty(comment, 'raw', {value: c})
		yield comment

		c = _findNext(document, c)
		indents = newIndents
		if (!c) return; // no successor
	}
}

const findSiblings = function* (document, commentEl) {
	const comments = findComments(document, commentEl)
	// parse comment
	const {done, value: comment} = comments.next()
	if (done) return null

	while (true) {
		const {done, value: nextComment} = comments.next()
		if (done || nextComment.level < comment.level) return null
		if (nextComment.level === comment.level) yield nextComment
	}
}

const findChildren = function* (document, commentEl) {
	const comments = findComments(document, commentEl)
	// parse comment
	const {done, value: comment} = comments.next()
	if (done) return null

	while (true) {
		const {done, value: childComment} = comments.next()
		if (done || childComment.level <= comment.level) return null
		yield childComment
	}
}

// todo

module.exports = {
	findComments,
	findSiblings,
	findChildren,
}
