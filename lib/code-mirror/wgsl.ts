import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { parseMixed } from "@lezer/common";
import { tags } from "@lezer/highlight";

const KEYWORDS = new Set([
  "alias",
  "break",
  "case",
  "const",
  "const_assert",
  "continue",
  "continuing",
  "default",
  "diagnostic",
  "discard",
  "else",
  "enable",
  "fn",
  "for",
  "if",
  "let",
  "loop",
  "override",
  "requires",
  "return",
  "struct",
  "switch",
  "var",
  "while",
]);

const TYPES =
  /^(?:bool|f16|f32|i32|u32|vec[234][fhiu]?|mat[234]x[234][fh]?|array|atomic|ptr|sampler(?:_comparison)?|texture_\w+|uniform|storage|function|private|workgroup|read|write|read_write)$/;

const BUILTINS = new Set([
  "abs",
  "acos",
  "acosh",
  "all",
  "any",
  "arrayLength",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "bitcast",
  "ceil",
  "clamp",
  "cos",
  "cosh",
  "countOneBits",
  "cross",
  "degrees",
  "determinant",
  "distance",
  "dot",
  "dpdx",
  "dpdy",
  "exp",
  "exp2",
  "faceForward",
  "floor",
  "fma",
  "fract",
  "frexp",
  "fwidth",
  "inverseSqrt",
  "ldexp",
  "length",
  "log",
  "log2",
  "max",
  "min",
  "mix",
  "modf",
  "normalize",
  "pow",
  "radians",
  "reflect",
  "refract",
  "reverseBits",
  "round",
  "saturate",
  "select",
  "sign",
  "sin",
  "sinh",
  "smoothstep",
  "sqrt",
  "step",
  "tan",
  "tanh",
  "textureDimensions",
  "textureGather",
  "textureLoad",
  "textureSample",
  "textureSampleLevel",
  "textureStore",
  "transpose",
  "trunc",
  "workgroupBarrier",
]);

// Template literals that look like shaders, e.g. vgpu `effect(gpu, `...`)`.
const SHADER = /@(?:fragment|vertex|compute|group|binding)\b|\bfn\s+\w+\s*\(/;

const wgslLanguage = StreamLanguage.define<{ commentDepth: number }>({
  name: "wgsl",
  startState: () => ({ commentDepth: 0 }),
  token(stream, state) {
    if (state.commentDepth > 0) {
      while (!stream.eol()) {
        if (stream.match("/*")) state.commentDepth++;
        else if (stream.match("*/")) {
          state.commentDepth--;
          if (state.commentDepth === 0) break;
        } else stream.next();
      }
      return "comment";
    }
    if (stream.eatSpace()) return null;
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }
    if (stream.match("/*")) {
      state.commentDepth = 1;
      return "comment";
    }
    if (stream.match(/^@\w+/)) return "wgslAttribute";
    if (
      stream.match(/^0[xX][0-9a-fA-F]+[iu]?/) ||
      stream.match(/^(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?[fhiu]?/)
    ) {
      return "number";
    }
    if (stream.match(/^[A-Za-z_]\w*/)) {
      const word = stream.current();
      if (KEYWORDS.has(word)) return "keyword";
      if (word === "true" || word === "false") return "wgslBool";
      if (TYPES.test(word)) return "wgslType";
      if (stream.match(/^\s*\(/, false)) {
        return BUILTINS.has(word) ? "wgslBuiltin" : "wgslFunction";
      }
      return "wgslVariable";
    }
    if (stream.match(/^(?:->|[-+*/%=!<>&|^~]+)/)) return "operator";
    stream.next();
    return "wgslPunctuation";
  },
  tokenTable: {
    wgslAttribute: tags.annotation,
    wgslBuiltin: tags.function(tags.standard(tags.variableName)),
    wgslFunction: tags.function(tags.variableName),
    wgslType: tags.typeName,
    wgslBool: tags.bool,
    wgslVariable: tags.variableName,
    wgslPunctuation: tags.punctuation,
  },
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
  },
});

const javascriptWithWgslLanguage = javascriptLanguage.configure({
  wrap: parseMixed((ref, input) => {
    if (ref.name !== "TemplateString") return null;
    if (!SHADER.test(input.read(ref.from, ref.to))) return null;
    const overlay: { from: number; to: number }[] = [];
    let from = ref.from + 1;
    for (let child = ref.node.firstChild; child; child = child.nextSibling) {
      if (child.name !== "Interpolation") continue;
      if (child.from > from) overlay.push({ from, to: child.from });
      from = child.to;
    }
    if (ref.to - 1 > from) overlay.push({ from, to: ref.to - 1 });
    return overlay.length ? { parser: wgslLanguage.parser, overlay } : null;
  }),
});

export function javascriptWithWgsl() {
  return new LanguageSupport(javascriptWithWgslLanguage, javascript().support);
}
