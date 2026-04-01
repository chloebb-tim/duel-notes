import React from "react";
import Link from "next/link";

import "./css/Header.css";
import "./css/Bouton.css";
import Signout from "../signout/page.jsx";

const Header = () => {
  return (
    <header className="header">

      {/* Vague fait à l'aide de Shape Divider App */}
      <div className="custom-shape-divider-top-1774999941">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      <Link className="logo" href="/"><img src="/Images/svg/logo.svg" alt="Logo" /></Link>
      <div className="temps">
        TIMEUR
      </div>
      <div className="menu">
        <nav className="navigation">
          <Link className="navhover" href="/voter">Voter</Link>
          <Link className="navhover" href="/duels">Duels</Link>
        </nav>
        {/* <div aria-label="profile"> */}
        {/* <img className="profile" aria-label="profile" src="/Images/svg/icon_profil_noir.svg" alt="Icon du profil" /> */}
        {/* </div> */}

        <div className="profil">
          <details>
            <summary ><img className="profile" aria-label="profile" src="/Images/svg/icon_profil_noir.svg" alt="Icon du profil" /></summary>

            <div className="menuprofil btnDeconnexion">
              <Signout />
            </div>
          </details>
        </div>
        <img className="tige" src="/Images/svg/tige.svg" alt="Tige" />
      </div>
    </header>
  );
};

export default Header;