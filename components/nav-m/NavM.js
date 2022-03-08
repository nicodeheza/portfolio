import {useEffect, useRef, useState} from "react";
import MenuBars from "../../svg/MenuBars";
import styles from "./navM.module.css";
import {useRouter} from "next/router";
import {PROJECTS, ABOUT, CONTACT} from "../../constant/constant";

export default function NavM({projects, about, contact, selected, pos}) {
	const [open, setOpen] = useState(false);
	const projectRef = useRef(null);
	const aboutRef = useRef(null);
	const contactRef = useRef(null);
	const selectorRef = useRef(null);
	const navRef = useRef(null);
	const router = useRouter();

	//selector transform
	useEffect(() => {
		function setPosition() {
			const rect =
				selected === PROJECTS
					? projectRef.current.getBoundingClientRect()
					: selected === ABOUT
					? aboutRef.current.getBoundingClientRect()
					: contactRef.current.getBoundingClientRect();

			const center = (rect.bottom - rect.top) / 2 + rect.top;
			selectorRef.current.style.clipPath = `circle(55px at center ${center}px)`;
		}
		const nav = navRef.current;
		if (open) {
			setPosition();
			nav.addEventListener("transitionend", setPosition, false);
		}
		addEventListener("resize", setPosition, false);
		return () => {
			removeEventListener("resize", setPosition, false);
			nav.removeEventListener("transitionend", setPosition, false);
		};
	}, [selected, open]);

	function click(id) {
		const h = window.innerHeight;
		const offset = (3 * h) / 100;
		if (selected !== id) {
			//setSelected(id);
			if (id === PROJECTS) {
				window.scrollTo({
					top: pos.projects
					//behavior: "smooth"
				});
			} else if (id === ABOUT) {
				window.scrollTo({
					top: pos.about - offset
					// behavior: "smooth"
				});
			} else if (id === CONTACT) {
				window.scroll({
					top: pos.contact - offset
					//behavior: "smooth"
				});
			}
		}
		setTimeout(() => {
			setOpen(false);
		}, 1000);
	}

	function changeLeng() {
		if (router.locale === "es") {
			router.push("/", "/", {locale: "en"});
			setOpen(false);
		} else {
			router.push("/", "/", {locale: "es"});
			setOpen(false);
		}
	}
	return (
		<div className={styles.mainContainer}>
			<div className={open ? styles.open : styles.close} ref={navRef}>
				<nav className={styles.nav}>
					<div className={styles.selector} ref={selectorRef}>
						<ul>
							<li>
								<a>{projects}</a>
							</li>
							<li>
								<a>{about}</a>
							</li>
							<li>
								<a>{contact}</a>
							</li>
						</ul>
					</div>
					<ul>
						<li ref={projectRef} onClick={() => click(PROJECTS)}>
							<a>{projects}</a>
						</li>
						<li ref={aboutRef} onClick={() => click(ABOUT)}>
							<a>{about}</a>
						</li>
						<li ref={contactRef} onClick={() => click(CONTACT)}>
							<a>{contact}</a>
						</li>
					</ul>
					<div className={styles.language}>
						<button
							className={router.locale === "en" ? styles.selected : ""}
							onClick={() => changeLeng()}
						>
							EN
						</button>
						<button
							className={router.locale === "es" ? styles.selected : ""}
							onClick={() => changeLeng()}
						>
							ES
						</button>
					</div>
				</nav>
			</div>
			<button onClick={() => setOpen((pass) => !pass)}>
				<MenuBars classN={styles.bars} />
			</button>
		</div>
	);
}
