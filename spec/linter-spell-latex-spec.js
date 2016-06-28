'use babel'

import * as path from 'path'
import * as _ from 'lodash'
import { Range } from 'atom'

describe('The linter-spell-latex provider for Atom Linter', () => {
  const grammar = require('../lib/main').provideGrammar()[0]

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('linter-spell-latex')
    })
  })

  it('finds spelling regions in "foo.tex"', () => {
    waitsForPromise(() => {
      return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(editor => {
        expect(_.isEqual(
          [new Range([1, 0], [1, 14]), new Range([3, 0], [3, 6]), new Range([24, 0], [24, 4])],
          grammar.getRanges(editor, [editor.getBuffer().getRange()]).ignoredRanges)).toBe(true, 'Matching ranges')
      })
    })
  })

  it('finds spellcheck TeX magic in "foo.tex"', () => {
    waitsForPromise(() => {
      return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(editor => {
        expect(_.isEqual(grammar.getDictionaries(editor), ['en_US'])).toBe(true, 'en_US dictionary')
      })
    })
  })
})
