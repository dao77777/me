export default function MdxLayout({ children }: { children: React.ReactNode }) {
    // Create any shared layout or styles here
    return (
        <div className="
            wrapper 
            w-full 
            h-full 
            overflow-auto
            custom-scroll
        ">
            <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-auto">
                {children}
            </article>
        </div>
    )
}