import path from "path"
import { CompilerProcessor, Content, getContentText } from "./compiler.result"

import fs from "fs/promises"
export const bunCompiler: CompilerProcessor = {
    pathRegex: /\.([jt]sx?)$/,
    contentTypeRegex: /^text\/(java|type)script$/,
    async process(files, config) {
        return (await Promise.all(files.map(async (f, fi) => {
            const fDir = path.dirname(f.path)
            const fName = path.basename(f.path)
            const tmpFile = path.join(fDir, ".tmp" + fName)
            await fs.writeFile(tmpFile, f.content)
            const res = await Bun.build({
                ...config.bun,
                entrypoints: [
                    tmpFile
                ]
            })

            return (await Promise.all(res.outputs.map(async o => ({
                type: "text",
                content: await fs.readFile( o.path, "utf8"),
                path: config?.bun?.outdir ? path.relative(config.bun.outdir,  o.path): o.path,
            })))) satisfies Content[]


        }))).flatMap(v => v)
    }
}