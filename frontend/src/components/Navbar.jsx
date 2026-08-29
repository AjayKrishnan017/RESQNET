import "../css/navbar.css";

function Navbar() {

    return (

        <nav className="navbar">

            <div className="navbar-brand">
                🚨 RESQNET
            </div>

            <div className="navbar-user">

                <span className="navbar-notification">
                    🔔
                </span>

                <span className="navbar-admin">
                    Admin
                </span>

            </div>

        </nav>

    );
}

export default Navbar;