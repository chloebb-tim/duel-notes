import React from "react";
import Link from "next/link";

import "./css/Header.css";

const Header = async () => {
  return (
    <header className="header">
      <Link className="logo" href="/"><img src="/Images/svg/logo.svg" alt="Logo" /></Link>
      <div className="menu">
        <nav className="navigation">
          <Link href="/voter">Voter</Link>
          <Link href="/duels">Duels</Link>
        </nav>
        {/* <div aria-label="profile"> */}
          <img className="profile" aria-label="profile" src="/Images/svg/icon_profil_noir.svg" alt="Icon du profil" />
          <img className="tige" src="/Images/svg/tige.svg" alt="Tige" />
        {/* </div> */}
      </div>
    </header>
  );
};

export default Header;