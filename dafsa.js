function Node (key, isWordEnd) {
  this.key = key
  this.children = new Map()
  this.parents = new Set()
  this.lastChild = null
  this.isWordEnd = isWordEnd
}

Node.prototype.addChild = function (key) {
  const node = new Node(key, false)
  this.children.set(key, node)
  node.parents.add(this)
  this.lastChild = this.children.get(key)
}

function DAFSA () {
  this.root = new Node()
  this.register = new Map() // key -> node[]
}

/*
Working with Algorithm 1 from https://www.aclweb.org/anthology/J00-1002
*/
DAFSA.prototype.addSortedWords = function (words) {
  words.forEach((word) => {
    let node = this.root
    for (let i = 0; i < word.length; i++) {
      let c = word[i]
      if (!node.children.has(c)) {
        if (node.children.size) replaceOrRegister(node, this.register)
        addSuffix(node, word, i)
        break
      }
      node = node.children.get(c)
    }
  })
  replaceOrRegister(this.root, this.register)
}

DAFSA.prototype.isWord = function (word) {
  let node = this.root
  for (let c of word) {
    if (!node.children.has(c)) return false
    node = node.children.get(c)
  }
  return node.isWordEnd
}

function addSuffix (root, word, suffixStart) {
  let node = root
  for (let i = suffixStart; i < word.length; i++) {
    let c = word[i]
    node.addChild(c)
    node = node.children.get(c)
  }
  node.isWordEnd = true
}

function replaceOrRegister (node, register) {
  const child = node.lastChild
  if (child && child.children.size) replaceOrRegister(child, register)
  let possibilities = register.get(node.key) || []
  if (!possibilities.length) register.set(node.key, possibilities.concat(node))
  for (let possibility of possibilities) {
    if (isEqual(node, possibility)) {
      node.parents.forEach((parent) => {
        parent.children.set(node.key, possibility)
        possibility.parents.add(parent)
      })
    } else {
      register.set(node.key, possibilities.concat(node))
      break
    }
  }
}

// the logical equality of nodes
function isEqual (a, b) {
  if (a === b) return false // no need to "replace" the node if they are _actually_ the same
  if (!(a && b)) return false
  const sameFinality = !(a.isWordEnd ^ b.isWordEnd)
  const sameChildrenSize = !(a.children.size ^ b.children.size)
  let sameChildrenKeys = true
  a.children.forEach((node, key) => {
    sameChildrenKeys = b.children.has(key) & isEqual(node, b.children.get(key))
  })
  return sameFinality & sameChildrenSize & sameChildrenKeys
}

module.exports = DAFSA
