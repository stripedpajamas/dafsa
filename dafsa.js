function DAFSA () {
  this.root = Node()

  // a map of letter -> []node
  this.letters = new Map()
}

DAFSA.prototype.add = function (input) {
  const word = input.toLowerCase().replace(/[^a-z]/g, '')
  let node = this.root
  let used = new Set()
  for (let c of word) {
    used.add(node)
    if (!node.children.has(c)) {
      let next
      // try to get letter from letter map
      if (!this.letters.has(c)) {
        // letter does not exist in map, make a new one
        // and add it to this node's children
        next = Node()
        this.letters.set(c, [next])
      } else {
        // letter does exist in map; make sure to
        // only use a letter that we have not used
        // in this word yet
        let nexts = this.letters.get(c)
        for (let n of nexts) {
          if (!used.has(n)) {
            next = n
            break
          }
        }
        // did not find a letter unused in this path
        // so make a new one
        if (!next) {
          next = Node()
          this.letters.set(c, this.letters.get(c).concat(next))
        }
      }
      node.children.set(c, next)
    }
    node = node.children.get(c)
  }

  node.isWordEnd = true
}


function Node (isWordEnd) {
  return { isWordEnd, children: new Map() }
}

module.exports = DAFSA
