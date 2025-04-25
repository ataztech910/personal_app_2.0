"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LightModeToggle from "@/app/components/LightModeToggle";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
library.add(faBars, faClose);

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";

function Header({ lightMode }: any) {
  const [information, setInformation] = useState<{ brandImage: string }>({
    brandImage: "",
  });
  const [navigationToggle, setNavigationToggle] = useState(false);
  const pathname = usePathname();

  const handleNavigationToggler = () => {
    setNavigationToggle(!navigationToggle);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/information`)
      .then((response) => response.json())
      .then((data) => setInformation(data));
  }, []);

  useEffect(() => {
    console.log("router change");
    setNavigationToggle(false);
  }, [pathname]);

  return (
    <nav className={navigationToggle ? "mi-header is-visible" : "mi-header"}>
      <button onClick={handleNavigationToggler} className="mi-header-toggler">
        {!navigationToggle ? (
          <FontAwesomeIcon icon="bars" />
        ) : (
          <FontAwesomeIcon icon="close" />
        )}
      </button>
      <div className="mi-header-inner">
        <div className="mi-header-image">
          {information.brandImage.length > 0 && (
            <Link href="/">
              <Image
                src={information.brandImage}
                alt="brandimage"
                width={300}
                height={300}
              />
            </Link>
          )}
        </div>

        <ul className="mi-header-menu">
          <li>
            <Link href="/" passHref>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/resume" passHref>
              <span>Resume</span>
            </Link>
          </li>
          {/* <li>
            <Link href="/projects" passHref>
              <span>Projects</span>
            </Link>
          </li> */}
          <li>
            <Link href="/blog" passHref>
              <span>Blog</span>
            </Link>
          </li>
          <li>
            <Link href="/contacts" passHref>
              <span>Contacts</span>
            </Link>
          </li>
        </ul>
        <LightModeToggle defaultMode={lightMode} />

        <p className="mi-header-copyright">
          &copy; {new Date().getFullYear()}{" "}
          <b>
            <a rel="noopener noreferrer" target="_blank" href="/">
              Andrei Tazetdinov
            </a>
          </b>
        </p>
      </div>
    </nav>
  );
}

export default Header;
