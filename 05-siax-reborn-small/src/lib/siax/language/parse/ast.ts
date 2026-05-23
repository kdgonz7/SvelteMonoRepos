import {
  siaxDefaultImpl,
  siaxGrammar,
  type SiaxAst,
} from "./parseSiaxLanguage";

export function generateSiaxAst(input: string): SiaxAst | null {
  const matchResult = siaxGrammar.match(input);

  if (matchResult.succeeded()) {
    return siaxDefaultImpl(matchResult).ast();
  } else {
    return null;
  }
}
