import path from "path";

export interface VirtualFileOptions {
    extname?: string;
    path?: string;
    content?: string;
}


export class VirtualFile {
    name: string;
    private originalName: string;
    private extname: string | null = null;

    path: string | null = null;
    content: string = "";
    constructor(name: string, options?: VirtualFileOptions) {
        this.name = name;
        this.originalName = name;
        
        if (options) {
            this.extname = options.extname || this.extname;
            this.path = options.path || this.path;
            this.content = options.content || this.content;
        }
    }
    /**
     * when file name already exists, rename it by adding "(1)" at the end or adding number in parentheses like "(2)""
     * @returns {VirtualFile} the same virtual file
     */
    renameWhenExists(): VirtualFile {
        if (this.name === this.originalName) {
            this.name = `${this.originalName} (1)`;
            return this;
        }

        const digitalInparenthesesRegex = /\((\d+)\)/g;
        let matches: RegExpExecArray | null;
        let lastMatch: RegExpExecArray | null = null;

        let extra = this.name.slice(this.originalName.length); 
        while ((matches = digitalInparenthesesRegex.exec(extra)) !== null) {
            lastMatch = matches;
        }
        if (lastMatch) {
            this.name = `${this.originalName} (${parseInt(lastMatch[1]) + 1})`;
        } else {
            this.name = `${this.originalName} (1)`;
        }
        return this;
    }
    /**
     * Get file name with extension name 
     * @returns {string} ex: "file.js"
     */
    fullName(): string {
        return this.extname === null ? this.name : `${this.name}.${this.extname}`;
    }
    /**
     * get full path in file system
     * @throws an error is thrown if path not set
     * @returns {string}
     */
    fullPath(): string {
        if (!this.path) {
            throw new Error(`path not set for ${this.fullName()}`);           
        }
        return path.join(this.path, this.fullName());
    }
}