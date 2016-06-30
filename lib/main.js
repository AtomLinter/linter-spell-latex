'use babel'

import * as _ from 'lodash'

const ignorePattern =
  /(?:\\(?:[$%#\\]|\w+)|\$\$(?:\\\\|\\\$|[^$])*\$\$|\$(?:\\\\|\\\$|[^$])*\$|\\\[.*\\\])/gim

const magicSpellCheckPattern = /^%\s*!TEX\s+spellcheck\s*=\s*(.*)$/im

const magicPattern = /^%\s*!TEX\s+\S+\s*=\s*.*$/im

function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

export default {
  argumentPattern: null,
  environmentPattern: null,

  provideGrammar () {
    return [{
      grammarScopes: ['text.tex', 'text.tex.latex'],
      getDictionaries: textEditor => {
        let dictionaries = []
        textEditor.scan(magicSpellCheckPattern, ({match, stop}) => {
          dictionaries = match[1].split(/(?:\s,)+/)
          stop()
        })
        return dictionaries
      },
      getRanges: (textEditor, ranges) => {
        let ignoredRanges = []
        function findIgnored (pattern) {
          for (let searchRange of ranges) {
            textEditor.scanInBufferRange(pattern, searchRange, ({range}) => {
              let found = false
              for (let i = 0; i < ignoredRanges.length; i++) {
                if (ignoredRanges[i].intersectsWith(range)) {
                  ignoredRanges[i] = ignoredRanges[i].union(range)
                  found = true
                }
              }
              if (!found) {
                ignoredRanges.push(range)
              }
            })
          }
        }
        findIgnored(magicPattern)
        findIgnored(ignorePattern)
        findIgnored(this.argumentPattern)
        findIgnored(this.environmentPattern)
        return { ranges: ranges, ignoredRanges: ignoredRanges }
      }
    }]
  },

  activate () {
    this.updatePatterns()
    atom.config.onDidChange('linter-spell-latex', () => this.updatePatterns())

    require('atom-package-deps').install('linter-spell-latex')
      .then(() => {
        console.log('All dependencies installed, good to go')
      })
  },

  deactivate () {
  },

  updatePatterns () {
    this.argumentPattern = new RegExp(
      '\\\\(?:' +
      _.map(atom.config.get('linter-spell-latex.ignoredArgumentCommands'), escapeRegExp).join('|') +
      ')(?:\\[[^\\]]*\\])?\\{[^}]*\\}',
      'g')
    this.environmentPattern = new RegExp(
      '(?:' +
      _.map(atom.config.get('linter-spell-latex.ignoredEnvironments'),
        env => `\\\\begin\\{${escapeRegExp(env)}\\}(?:\\s|\\S)*\\\\end\\{${escapeRegExp(env)}\\}`).join('|') +
      ')',
      'g')
  }
}
