const Header = () => {
    let dateObj = new Date();
    return (
        <>
            <h1>The Entertainment Guild</h1>
            <p>Welcome today {dateObj.toLocaleString() + ""} </p>
        </>
    );
}

export default Header;
