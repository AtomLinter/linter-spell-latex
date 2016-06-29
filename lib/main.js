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
      getRanges: (textEditor, ranges) => {
        let ignoredRanges = []
        for (let searchRange of ranges) {
          textEditor.scanInBufferRange(/\\([$%#\\]|\w+)/gim, searchRange, ({range}) => {
            ignoredRanges.push(range)
          })
        }
        return { ranges: ranges, ignoredRanges: ignoredRanges }
      }
    }]
  },

  activate: () => {
    // require('atom-package-deps').install('linter-spell-latex')
    //   .then(() => {
    //     console.log('All dependencies installed, good to go')
    //   })
  },

  deactivate: () => {
  }
}
