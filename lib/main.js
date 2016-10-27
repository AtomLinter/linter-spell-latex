'use babel'

import { CompositeDisposable } from 'atom'

const magicSpellCheckPattern = /^%\s*!TEX\s+spellcheck\s*=\s*(.*)$/im
const ignorePattern = /[0-9]+(pt|mm|cm|in|ex|em|bp|pc|dd|cc|sp)/
const grammarScopes = ['text.tex', 'text.tex.latex', 'text.tex.latex.memoir', 'text.tex.latex.beamer']

export default {
  disposables: null,

  provideGrammar () {
    function checkComments () {
      return atom.config.get('linter-spell-latex.checkComments')
    }

    return [{
      grammarScopes: grammarScopes,
      findLanguageTags: textEditor => {
        let languages = []
        textEditor.scan(magicSpellCheckPattern, ({match, stop}) => {
          languages = match[1].split(/\s*,\s*/)
          stop()
        })
        return languages
      },
      checkedScopes: {
        'comment.line.at-sign.bibtex': checkComments,
        'comment.line.percentage.tex': checkComments,
        'comment.line.percentage.latex': checkComments,
        'comment.line.percentage.directive.texshop.tex': false,
        'comment.line.percentage.magic.tex': false,
        'constant.character.latex': false,
        'constant.other.reference.citation.latex': false,
        'constant.other.reference.latex': false,
        'keyword.control.cite.latex': false,
        'keyword.control.tex': false,
        'markup.raw.verb.latex': false,
        'markup.underline.link.latex': false,
        'meta.catcode.tex': false,
        'meta.definition.latex': false,
        'meta.embedded.block.generic': false,
        'meta.embedded.block.lua': false,
        'meta.embedded.block.python': false,
        'meta.embedded.block.source': false,
        'meta.embedded.line.r': false,
        'meta.function.begin-document.latex': false,
        'meta.function.end-document.latex': false,
        'meta.function.environment.latex.tikz': false,
        'meta.function.environment.math.latex': false,
        'meta.function.link.url.latex': false,
        'meta.function.memoir-alltt.latex': false,
        'meta.function.verb.latex': false,
        'meta.function.verbatim.latex': false,
        'meta.include.latex': false,
        'meta.preamble.latex': false,
        'meta.reference.latex': false,
        'meta.scope.item.latex': false,
        'storage.type.function.latex': false,
        'storage.type.function.tex': false,
        'string.other.math.block.tex': false,
        'string.other.math.latex': false,
        'string.other.math.tex': false,
        'support.function.be.latex': false,
        'support.function.emph.latex': false,
        'support.function.ExplSyntax.tex': false,
        'support.function.footnote.latex': false,
        'support.function.general.tex': false,
        'support.function.marginpar.latex': false,
        'support.function.marginpar.latex': false,
        'support.type.function.other.latex': false,
        'support.function.section.latex': false,
        'support.function.textbf.latex': false,
        'support.function.textit.latex': false,
        'support.function.texttt.latex': false,
        'support.function.url.latex': false,
        'support.function.verb.latex': false,
        'text.tex.latex.beamer': true,
        'text.tex.latex.memoir': true,
        'text.tex.latex': true,
        'text.tex': true,
        'variable.parameter.function.latex': false
      },
      getRanges: (textEditor, ranges) => {
        let ignoredRanges = []
        for (const searchRange of ranges) {
          textEditor.scanInBufferRange(ignorePattern, searchRange, ({range}) => {
            ignoredRanges.push(range)
          })
        }
        return { ranges: ranges, ignoredRanges: ignoredRanges }
      }
    }, {
      grammarScopes: ['text.bibtex'],
      checkedScopes: {
        'markup.underline.link.http.hyperlink': false,
        'string.quoted.double.bibtex': true,
        'string.quoted.other.braces.bibtex': true
      }
    }]
  },

  provideDictionary () {
    let wordList = require('linter-spell-word-list')
    let a = new wordList.ConfigWordList({
      name: 'LaTeX',
      keyPath: 'linter-spell-latex.words',
      grammarScopes: grammarScopes
    })
    this.disposables.add(a)
    return a.provideDictionary()
  },

  activate () {
    this.disposables = new CompositeDisposable()
    require('atom-package-deps').install('linter-spell-latex')
      .then(() => {
        console.log('All dependencies installed, good to go')
      })
  },

  deactivate () {
    this.disposables.dispose()
  }
}
