import * as ohm from "ohm-js";

/*
  SiAX language definition, based on documentation found @ https://github.com/kdgonz7/SiAX/blob/master/README.txt

  # standard ascii 'A'
  buf = allocate(1); # allocate 15 bytes for a file descriptor
  put(fd, 49);

  stdout = openfd(1);
  writefd(stdout, buf);

  # The above program will print 'A'
*/

export const siaxGrammar = ohm.grammar(String.raw`
  Siax {
    Program = Line*

    Line =
      | comment       -- comment
      | Statement ";" -- statementexpr
      | "\n"          -- blankline

    Statement =
      | AssignmentExpr -- AssignmentExpr
      | FnCall -- FnCall
    AssignmentExpr = identifier "=" Expression
    Expression =
      | FnCall
      | number
      | identifier
    FnCall = identifier "(" ListOf<Expression, ","> ")"

    number = digit+
    comment = "#" (~"\n" any)* "\n"
    identifier = letter (letter | digit)*
    space += comment
  }
`);

export const siaxDefaultImpl = siaxGrammar
  .createSemantics()
  .addOperation("ast", {
    _iter(...children) {
      return children.map((c) => c.ast());
    },

    Program(lines) {
      return lines.ast();
    },

    Line_statementexpr(statement, _) {
      return statement.ast();
    },

    AssignmentExpr(ident, _, expr) {
      return {
        type: "AssignmentExpression",
        identifier: ident.ast(),
        expr: expr.ast(),
      };
    },

    FnCall(funcName, _, list, _2) {
      return {
        type: "FunctionCall",
        functionName: funcName.ast(),
        functionParams: list.asIteration().children.map((child) => child.ast()),
      };
    },

    identifier(first, rest) {
      return {
        type: "Identifier",
        value: this.sourceString,
      };
    },

    number(n) {
      return {
        type: "Number",
        value: parseInt(n.sourceString),
      };
    },
  });

/**
 * Type that defines the SiAX program structure.
 */
export type SiaxAstNode =
  | {
      type: "AssignmentExpression";
      identifier: SiaxAstNode;
      expr: SiaxAstNode;
    }
  | {
      type: "FunctionCall";
      functionName: SiaxAstNode;
      functionParams: SiaxAstNode[];
    }
  | {
      type: "Identifier";
      value: string;
    }
  | {
      type: "Number";
      value: number;
    };
export type SiaxAst = SiaxAstNode[];
