export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="site-title">The Entertainment Guild</a>
    <ul>
        <li className="active">
            <a href="/genre">Genre</a>
        </li>
        <li className="active">
            <a href="/new-releases">New Releases</a>
        </li>
        <li className="active">
            <a href="/best-sellers">Best Sellers</a>
        </li>
        <li className="active">
            <a href="/author">Author</a>
        </li>
        <li className="active">
            <a href="/products">Products</a>
        </li>
    </ul>
</nav>
}
        
