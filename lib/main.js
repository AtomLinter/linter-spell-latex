'use babel'

import * as _ from 'lodash'

const ignorePattern =
  /(?:\\(?:[$%#\\]|\w+)|\$\$(?:\\\\|\\\$|[^$])*\$\$|\$(?:\\\\|\\\$|[^$])*\$|\\\[.*\\\])/gim

const magicPattern = /^%\s*!TEX\s+spellcheck\s*=\s*(.*)$/im

const ignoredArguments = [
  "addtocounter",
  "addtocounter",
  "begin",
  "bibitem",
  "bibliography",
  "bibliographystyle",
  "cite",
  "documentclass",
  "end",
  "ensuremath",
  "label",
  "newenvironment",
  "newtheorem",
  "pageref",
  "ref",
  "refstepcounter",
  "renewenvironment",
  "setcounter",
  "stepcounter",
  "thispagestyle",
  "usecounter",
  "usepackage",
  "value",
  "vspace"
]

const ignoredEnvironments = [
  "displaymath",
  "equation",
  "equation*",
  "filecontents"
]

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
}

export default {
  argumentPattern: null,
  environmentPattern: null,

  provideGrammar () {
    return [{
      grammarScopes: ['text.tex', 'text.tex.latex'],
      getDictionaries: textEditor => {
        let dictionaries = []
        textEditor.scan(magicPattern, ({match, stop}) => {
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
              ignoredRanges.push(range)
            })
          }
        }
        findIgnored(ignorePattern)
        findIgnored(this.argumentPattern)
        findIgnored(this.environmentPattern)
        return { ranges: ranges, ignoredRanges: ignoredRanges }
      }
    }]
  },

  activate () {
    this.updatePatterns()
    atom.config.onDidChange('linter-spell-latex.ignoredArgumentCommands', () => this.updatePatterns())
    atom.config.onDidChange('linter-spell-latex.ignoredEnvironments', () => this.updatePatterns())

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
      _.map(_.concat(ignoredArguments, atom.config.get('linter-spell-latex.ignoredArgumentCommands')), escapeRegExp).join('|') +
      ')(?:\\[[^\\]]*\\])?\\{[^}]*\\}',
      'g')
    this.environmentPattern = new RegExp(
      '(?:' +
      _.map(_.concat(ignoredEnvironments, atom.config.get('linter-spell-latex.ignoredEnvironments')),
        env => `\\\\begin\\{${escapeRegExp(env)}\\}(?:\\s|\\S)*\\\\end\\{${escapeRegExp(env)}\\}`).join('|') +
      ')',
      'g')
  }


}
