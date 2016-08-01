'use babel'

import * as path from 'path'
import * as _ from 'lodash'
// import { Range } from 'atom'

describe('The linter-spell-latex provider for Atom Linter', () => {
  const grammar = require('../lib/main').provideGrammar()[0]

  // beforeEach(() => {
  //   waitsForPromise(() => {
  //     return Promise.all(_.map(['language-tex'], p => atom.packages.activatePackage(p)))
  //   })
  // })

  // it('finds spelling regions in "foo.tex"', () => {
  //   waitsForPromise(() => {
  //     return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(editor => {
  //       expect(_.isEqual(
  //         [new Range([2, 0], [3, 0]), new Range([4, 0], [0, 24])],
  //         grammar.getRanges(editor, [editor.getBuffer().getRange()]).ignoredRanges)).toBe(true, 'Matching ranges')
  //     })
  //   })
  // })

  it('finds spellcheck TeX magic in "foo.tex"', () => {
    waitsForPromise(() => {
      return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(editor => {
        expect(_.isEqual(grammar.findLanguageTags(editor), ['en-US'])).toBe(true, 'en-US language')
      })
    })
  })
})
