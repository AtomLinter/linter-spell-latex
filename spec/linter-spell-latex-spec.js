'use babel'

import * as path from 'path'

describe('The linter-spell-latex provider for Atom Linter', () => {
  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('linter-spell-latex')
    })
  })

  it('finds spelling regions in "foo.tex"', () => {
    waitsForPromise(() => {
      return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(editor => {
      })
    })
  })
})
