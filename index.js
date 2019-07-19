const DAFSA = require('./dafsa')

const words = ['help', 'hear', 'heart', 'health', 'healthy', 'happy']

const dafsa = new DAFSA()

words.forEach((word) => dafsa.add(word))

function print (node, letter, tabs = '') {
  const size = node.children.size
  const base = `${tabs}${letter} has ${size} ${size === 1 ? 'child' : 'children'}`
  const suffix = node.isWordEnd ? 'and ends a word' : ''
  console.log(`${base} ${suffix}`)
  node.children.forEach((v, k) => print(v, k, tabs + '\t'))
}

function getLetterNodeCount (lettersMap) {
  let sum = 0
  for (let v of lettersMap.values()) {
    sum += v.length
  }
  return sum
}

print(dafsa.root, 'ROOT')
console.log(
  '%d words, %d unique letters; we have %d letter nodes',
  words.length,
  words.join('').split('').reduce((t, l) => { t.add(l); return t }, new Set()).size,
  getLetterNodeCount(dafsa.letters)
)
