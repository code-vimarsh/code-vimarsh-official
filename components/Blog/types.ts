export interface BlogSection {
    type: 'paragraph' | 'heading' | 'code';
    text?: string;
    language?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: BlogSection[];
    /** Optional: raw markdown string from managed blogs — rendered in place of `content` when present */
    rawMarkdown?: string;
    author: string;
    date: string;
    readTime: string;
    tag: string;
    tagColor: string;
    thumbnail: string;
    rotation: number;
    ix: number;   // initial x
    iy: number;   // initial y
}
