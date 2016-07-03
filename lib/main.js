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
      grammarScopes: ['text.tex', 'text.tex.latex', 'text.tex.latex.memoir', 'text.tex.latex.beamer'],
      getDictionaries: textEditor => {
        let dictionaries = []
        textEditor.scan(magicSpellCheckPattern, ({match, stop}) => {
          dictionaries = match[1].split(/(?:\s,)+/)
          stop()
        })
        return dictionaries
      },
      ignoredScopes: [
        '.comment.line.percentage.directive.texshop.tex',
        '.comment.line.percentage.tex',
        '.keyword.control.tex',
        '.meta.citation.latex .keyword.control.cite.latex',
        '.meta.function.begin-document.latex',
        '.meta.function.end-document.latex',
        '.meta.function.environment.general.latex .variable.parameter.function.latex',
        '.meta.function.link.url.latex .markup.underline.link.latex',
        '.support.function.url.latex',
        '.meta.preamble.latex',
        '.meta.reference.latex',
        '.storage.type.function.latex',
        '.support.function.general.tex',
        '.support.function.section.latex',
        '.support.function.textbf.latex',
        '.support.function.textit.latex',
        '.support.function.texttt.latex',
        '.support.function.be.latex',
        '.support.function.marginpar.latex',
        '.support.function.footnote.latex',
        '.support.function.emph.latex',
        '.support.function.verb.latex',
        '.text.tex.latex .meta.function.environment.math.latex'
      ]
      // getRanges: (textEditor, ranges) => {
      //   let ignoredRanges = []
      //   function findIgnored (pattern) {
      //     for (let searchRange of ranges) {
      //       textEditor.scanInBufferRange(pattern, searchRange, ({range}) => {
      //         let found = false
      //         for (let i = 0; i < ignoredRanges.length; i++) {
      //           if (ignoredRanges[i].intersectsWith(range)) {
      //             ignoredRanges[i] = ignoredRanges[i].union(range)
      //             found = true
      //           }
      //         }
      //         if (!found) {
      //           ignoredRanges.push(range)
      //         }
      //       })
      //     }
      //   }
      //   findIgnored(magicPattern)
      //   findIgnored(ignorePattern)
      //   findIgnored(this.argumentPattern)
      //   findIgnored(this.environmentPattern)
      //   return { ranges: ranges, ignoredRanges: ignoredRanges }
      // }
    }, {
      grammarScopes: ['text.bibtex'],
      ignoredScopes: [
        '.keyword.other.entry-type.bibtex',
        '.entity.name.type.entry-key.bibtex',
        '.string.unquoted.key.bibtex',
        '.markup.underline.link.http.hyperlink'
      ]
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
