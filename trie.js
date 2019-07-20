function Trie () {
  this.root = { children: [] }
}

Trie.prototype.addWord = function (word) {
  let current = this.root
  for (let c of word) {
    let i = c.charCodeAt(0) - 97
    try {
      if (!current.children[i]) {
        current.children[i] = { children: [] }
      }
    } catch (e) {
      console.log({ word, i, current })
    }
    current = current.children[i]
  }
  current.val = word
}

module.exports = Trie
