import { articles } from '@/wiki/utils';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const { default: Post } = await import(`@/wiki/article/${slug}.mdx`);

    return <Post />
}

export function generateStaticParams() {
    const slugs = articles
        .map(name => ({ slug: name.replace(/\.mdx?$/, '') }));
    return slugs;
}

export const dynamicParams = true