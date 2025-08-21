export default function Navbar() {
    const path = window.location.pathname
    return <nav className="nav">
        <a href="/" className="site-title">The Entertainment Guild</a>
    <ul>
        <CustomLink href="/genre">Genre</CustomLink>
        <CustomLink href="/newReleases">New Releases</CustomLink>
        <CustomLink href="/bestSellers">Best Sellers</CustomLink>
        <CustomLink href="/author">Author</CustomLink>
        <CustomLink href="/products">Products</CustomLink>
    </ul>
</nav>
}
        
function CustomLink({ href, children,...props}) {
    const path = window.location.pathname
    if 
    return (
        <li className={path === href ? "active" : ""}>
            <a href={href} {...props}>
                {children}
            </a>
        </li>
    )
}
