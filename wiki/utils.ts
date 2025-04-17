import { readdirSync } from "fs";
import { join } from "path";

export const absoluteArticleDir = join(process.cwd(), './wiki/article');
console.log('absoluteArticleDir:', absoluteArticleDir);
export const relativeArticleDir = '@/wiki/article';
console.log('relativeArticleDir:', relativeArticleDir);

console.log('read article start');
console.log('articleDir:', absoluteArticleDir);
export const articles = readdirSync(absoluteArticleDir);
console.log('read article end');