import fs from "fs/promises";
import { MuffinBuildConfig } from ".";
import { bunCompiler } from "./compiler.bun";
import { htmlCompiler } from "./compiler.html";
import { CompilerProcessor, Content, getContentBytes } from "./compiler.result";

export const defaultCompilers = [
    bunCompiler,
    htmlCompiler,
] 
 async function processCompilersInner(comps: CompilerProcessor[], files:Content[]): Promise<Content[]>  {

    const matching = files.map(f => ({content: f , matching: comps.find(c => c.pathRegex.exec(f) })
return
 }

 async function processInners(files: Content[], config: MuffinBuildConfig) {
    const outDir = config?.bun?.outdir ?? process.cwd()

    await Promise.all(files.map(async f => {
        await fs.writeFile(f.path,  getContentBytes(f), "")
    }))
 }