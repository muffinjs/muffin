import path from "path"
import { parse } from "node-html-parser"
import { CompilerProcessor, Content, getContentText } from "./compiler.result"
import fs from "fs/promises"
export const htmlCompiler: CompilerProcessor = {
    pathRegex: /\.html?$/,
    async process(files, config) {
        return (await Promise.all(files.map(async f => {
            const fDir = path.dirname(f.path)

            const dom = await parse(getContentText(f))

            const scripts = dom.getElementsByTagName("script")
            const retContents: Content[] = await Promise.all(scripts.map(async (scr, i) => {

                const src = scr.attrs?.src
                if (src) {
                    const content = await fs.readFile(path.join(fDir, src), "utf8")
                    return {
                        type: "text",
                        content,
                        path: src,
                    }
                } else {
                    const content = scr.textContent!
                    const ty = scr.attrs.type

                    const ext = ty.toLowerCase() === "text/typescript" ? "ts" : "js"

                    return {
                        type: "text",
                        path: path.join(fDir, `inline-${i}.${ext}`,
                        content,
                    }
                }
            }));
            return retContents
        }))).flatMap(v => v)
    },
}