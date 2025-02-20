import Link from "next/link";
import Image from "next/image";
import NavigationToggle from "./NavigationToggle";

interface Information {
  brandImage: string;
}

async function fetchInformation(): Promise<Information> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/information`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch information");
  }
  return res.json();
}

export default async function Header() {
  const information = await fetchInformation();

  return (
    // <nav className={navigationToggler ? "mi-header Is-visible" : "mi-header"}>
    <nav className="mi-header Is-visible">
      <NavigationToggle />
      <div className="mi-header-inner">
        <div className="mi-header-image">
          <Link href="/">
            <Image src={information.brandImage} alt="brandimage" width={100} height={100} />
          </Link>
        </div>

        <ul className="mi-header-menu">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/resume">Resume</Link>
          </li>
          <li>
            <Link href="/portfolios">Portfolios</Link>
          </li>
          <li>
            <Link href="/blogs">Blogs</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <p className="mi-header-copyright">
          &copy; {new Date().getFullYear()}{" "}
          <b>
            <a rel="noopener noreferrer" target="_blank" href="https://nuclearthemes.com">
              NuclearThemes
            </a>
          </b>
        </p>
      </div>
    </nav>
  );
}
