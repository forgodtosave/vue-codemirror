import { parser } from '@lezer/python'
import { SyntaxNode } from '@lezer/common'
import {
  delimitedIndent,
  indentNodeProp,
  TreeIndentContext,
  foldNodeProp,
  foldInside,
  LRLanguage,
  LanguageSupport
} from '@codemirror/language'
import { globalCompletion, localCompletionSource } from './complete'
export { globalCompletion, localCompletionSource }

/* function indentBody(context: TreeIndentContext, node: SyntaxNode) {
  let base = context.baseIndentFor(node)
  let line = context.lineAt(context.pos, -1),
    to = line.from + line.text.length
  // Don't consider blank, deindented lines at the end of the
  // block part of the block
  if (
    /^\s*($|#)/.test(line.text) &&
    context.node.to < to + 100 &&
    !/\S/.test(context.state.sliceDoc(to, context.node.to)) &&
    context.lineIndent(context.pos, -1) <= base
  )
    return null
  // A normally deindenting keyword that appears at a higher
  // indentation than the block should probably be handled by the next
  // level
  if (
    /^\s*(else:|elif |except |finally:)/.test(context.textAfter) &&
    context.lineIndent(context.pos, -1) > base
  )
    return null
  return base + context.unit
} */

/// A language provider based on the [Lezer Python
/// parser](https://github.com/lezer-parser/python), extended with
/// highlighting and indentation information.
export const pythonLanguage = LRLanguage.define({
  //name: 'python',
  parser: parser.configure({
    props: []
  }),
  languageData: {
    closeBrackets: {
      brackets: ['(', '[', '{', "'", '"', "'''", '"""'],
      stringPrefixes: ['f', 'fr', 'rf', 'r', 'u', 'b', 'br', 'rb', 'F', 'FR', 'RF', 'R', 'U', 'B', 'BR', 'RB']
    },
    commentTokens: { line: '#' },
    indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:)$/
  }
})

/// Python language support.
export function pythonEdit() {
  return new LanguageSupport(pythonLanguage, [
    pythonLanguage.data.of({ autocomplete: localCompletionSource }),
    pythonLanguage.data.of({ autocomplete: globalCompletion })
  ])
}
