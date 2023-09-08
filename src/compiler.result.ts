import { MuffinBuildConfig } from "./config"

export type Content = ({
    type: "text"
    content: string
} | {
    type: "buffer"
    content: Buffer
}) & { path: string}
export function getContentText(c: Content): string {
    switch(c.type) {
        case   "text": return c.content;
        case "buffer": return c.content.toString("utf8")
    }
}
export function getContentBytes(c: Content): Buffer {
    switch(c.type) {
        case   "text": return Buffer.from( c.content, "utf8");
        case "buffer": return c.content
    }
}

export interface CompilerProcessor {
    pathRegex: RegExp
    contentTypeRegex?: RegExp
    process(files: Content[], config: MuffinBuildConfig): Promise<Content[]>
} 
