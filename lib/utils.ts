import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The `nullif` function takes a value and a comparison value or function.
 * It returns `null` if the value matches the comparison criteria, otherwise it returns the value.
 * 
 * @template T - The type of the input value.
 * @param {T} value - The value to be checked.
 * @param {any} cmpValOrCmpFunc - A value, array, or function used for comparison.
 * @returns {Exclude<T, null | undefined> | null} - Returns `null` if the value matches the comparison criteria, otherwise the value.
 */
export const nullif = <T>(value: T, cmpValOrCmpFunc: any): Exclude<T, null | undefined> | null => {
  if (
    value === undefined ||
    value === null
  ) return null
  if (typeof cmpValOrCmpFunc === "function") {
    return cmpValOrCmpFunc(value) ? null : value as Exclude<T, null | undefined>;
  } else if (Array.isArray(cmpValOrCmpFunc)) {
    return cmpValOrCmpFunc.includes(value) ? null : value as Exclude<T, null | undefined>;
  } else {
    return value === cmpValOrCmpFunc ? null : value as Exclude<T, null | undefined>;
  }
}

/**
 * 将 Markdown 文本转换为 HTML
 * @param markdown - 要转换的 Markdown 文本
 * @returns 转换后的 HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // 解析 Markdown
    .use(remarkHtml) // 转换为 HTML
    .process(markdown);

  return result.toString();
}