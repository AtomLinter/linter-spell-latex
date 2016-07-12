'use babel'

// import * as _ from 'lodash'

const magicSpellCheckPattern = /^%\s*!TEX\s+spellcheck\s*=\s*(.*)$/im
const ignorePattern = /[0-9]+(pt|mm|cm|in|ex|em|bp|pc|dd|cc|sp)/

// function escapeRegExp (str) {
//   return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
// }

export default {

  provideGrammar () {
    return [{
      grammarScopes: ['text.tex', 'text.tex.latex', 'text.tex.latex.memoir', 'text.tex.latex.beamer'],
      getLanguages: textEditor => {
        let languages = []
        textEditor.scan(magicSpellCheckPattern, ({match, stop}) => {
          languages = match[1].split(/(?:\s,)+/)
          stop()
        })
        return languages
      },
      checkedScopes: {
        'comment.line.percentage.directive.texshop.tex': false,
        'comment.line.percentage.tex': false,
        'keyword.control.cite.latex': false,
        'keyword.control.tex': false,
        'markup.underline.link.latex': false,
        'meta.function.begin-document.latex': false,
        'meta.function.end-document.latex': false,
        'meta.function.environment.math.latex': false,
        'meta.preamble.latex': false,
        'meta.reference.latex': false,
        'storage.type.function.latex': false,
        'string.other.math.block.tex': false,
        'string.other.math.tex': false,
        'string.other.math.latex': false,
        'support.function.be.latex': false,
        'support.function.emph.latex': false,
        'support.function.footnote.latex': false,
        'support.function.general.tex': false,
        'support.function.marginpar.latex': false,
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
      //   '.keyword.other.entry-type.bibtex',
      //   '.entity.name.type.entry-key.bibtex',
      //   '.string.unquoted.key.bibtex',
      //   '.markup.underline.link.http.hyperlink'
      // ]
    }]
  },

  activate () {
    // this.updatePatterns()
    // atom.config.onDidChange('linter-spell-latex', () => this.updatePatterns())

    require('atom-package-deps').install('linter-spell-latex')
      .then(() => {
        console.log('All dependencies installed, good to go')
      })
  },

  deactivate () {
  }

  // updatePatterns () {
  //   this.argumentPattern = new RegExp(
  //     '\\\\(?:' +
  //     _.map(atom.config.get('linter-spell-latex.ignoredArgumentCommands'), escapeRegExp).join('|') +
  //     ')(?:\\[[^\\]]*\\])?\\{[^}]*\\}',
  //     'g')
  //   this.environmentPattern = new RegExp(
  //     '(?:' +
  //     _.map(atom.config.get('linter-spell-latex.ignoredEnvironments'),
  //       env => `\\\\begin\\{${escapeRegExp(env)}\\}(?:\\s|\\S)*\\\\end\\{${escapeRegExp(env)}\\}`).join('|') +
  //     ')',
  //     'g')
  // }
}
