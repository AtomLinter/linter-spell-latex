'use babel'

export default {

  provideGrammar: () => {
    return [{
      grammarScopes: ['text.tex', 'text.tex.latex'],
      getDictionaries: textEditor => {
        let dictionaries = []
        textEditor.scan(/^%\s*!TEX\s+spellcheck\s*=\s*(.*)$/im, ({match, stop}) => {
          dictionaries = match[1].split(/(?:\s,)+/)
          stop()
        })
        return dictionaries
      },
      getRanges: textEditor => {
        let ranges = []
        textEditor.scan(/(^|\\\\|[\[\]{}])[^{}\\\[\]]+(?=$|\\\\|[\[\]{}])/gim, ({match, range}) => {
          if (match[1]) {
            range.start.column++
          }
          ranges.push(range)
        })
        return ranges
      }
    }]
  },

  activate: () => {
  },

  deactivate: () => {
  }
}
