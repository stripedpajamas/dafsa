function Node (key, isWordEnd) {
  this.key = key
  this.children = new Map()
  this.lastChild = null
  this.isWordEnd = isWordEnd
}

Node.prototype.addChild = function (key) {
  this.children.set(key, new Node(key, false))
  this.lastChild = this.children.get(key)
}

function DAFSA () {
  this.root = new Node()
  this.register = new Map()
}

/*
Working with Algorithm 1 from https://www.aclweb.org/anthology/J00-1002
*/
DAFSA.prototype.addSortedWords = function (words) {
  words.forEach((word) => {
    const { lastState, prefix } = commonPrefix(this.root, word)
    const currentSuffix = word.slice(prefix.length)
    if (lastState.children.size) replaceOrRegister(lastState, this.register)
    addSuffix(lastState, currentSuffix)
  })
  replaceOrRegister(this.root, this.register)
}

function addSuffix (root, suffix) {
  let node = root
  for (let c of suffix) {
    node.addChild(c)
    node = node.children.get(c)
  }
  node.isWordEnd = true
}

// the longest prefix w of Word such that
function commonPrefix (root, word) {
  let node = root
  let prefix = []
  for (let c of word) {
    if (!node.children.has(c)) break
    prefix.push(c)
    node = node.children.get(c)
  }
  return { lastState: node, prefix: prefix.join('') }
}

function replaceOrRegister (node, register) {
  const child = node.lastChild
  if (child && child.children.size) replaceOrRegister(child, register)
  if (isEqual(node, register.get(node.key))) {
    node.lastChild = register.get(node.key)
    node.children.set(node.lastChild.key, node.lastChild)
  } else {
    register.set(node.key, node)
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
