const fs = require('fs')
const DAFSA = require('./dafsa')
const Trie = require('./trie')

function print (node, letter, tabs = '') {
  const size = node.children.size
  const base = `${tabs}${letter} has ${size} ${size === 1 ? 'child' : 'children'}`
  const suffix = node.isWordEnd ? 'and ends a word' : ''
  console.log(`${base} ${suffix}`)
  node.children.forEach((v, k) => print(v, k, tabs + '\t'))
}

function getNodeCount (root) {
  const seen = new Set()
  function visit (node, fn) {
    fn(node)
    node.children.forEach(child => visit(child, fn))
  }
  visit(root, (node) => { seen.add(node) })
  return seen.size
}

/**************************************************************/

const wordsFile = fs.readFileSync('./sortedWords.txt', 'utf8')
const words = wordsFile.split('\n')

const dafsa = new DAFSA()
const trie = new Trie()
words.forEach((word) => trie.addWord(word))

dafsa.addSortedWords(words)

console.log('These words are not words:', words.filter(word => !dafsa.isWord(word)))
console.log('All words are words?', words.every(word => dafsa.isWord(word)))

// print(dafsa.root, 'ROOT')
// console.log(
//   '%d words, %d letters, %d unique letters; we have %d letter nodes; trie has %d nodes',
//   words.length,
//   words.join('').split('').length,
//   words.join('').split('').reduce((t, l) => { t.add(l); return t }, new Set()).size,
//   getNodeCount(dafsa.root),
//   getNodeCount(trie.root)
// )
