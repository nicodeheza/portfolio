import Head from "next/head";
import styles from "../styles/Home.module.css";
import ThreeBk from "../components/three/ThreeBk";
import Header from "../components/header/Header";
import NavD from "../components/nav-d/NavD";
import NavM from "../components/nav-m/NavM";
import Projects from "../components/projects/Projects";
import OthersProjects from "../components/othersProjects/OthersProjects";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import {useState, useEffect} from "react";
import Loading from "../components/loading/Loading";
import {useTranslations} from "next-intl";
import {PROJECTS, ABOUT, CONTACT, STRAPI_URL} from "../constant/constant";
import updateImages from "../functions/updateImages";

export async function getStaticProps({locale}) {
	const messages = await import(`../messages/${locale}.json`);

	const ResProjects = await fetch(`${STRAPI_URL}/projects?_locale=${locale}`);
	let projectsData = await ResProjects.json();
	projectsData = projectsData.sort((p1, p2) => p1.order - p2.order);

	const resAbout = await fetch(`${STRAPI_URL}/about?_locale=${locale}`);
	const aboutObj = await resAbout.json();
	const aboutText = aboutObj.text;

	updateImages(projectsData, "/public/strapiImg");
	//console.log(projectsData);
	return {
		props: {
			messages: messages.default,
			projectsData,
			aboutText
		}
	};
}

export default function Home({projectsData, aboutText}) {
	const t = useTranslations("Home");
	const [loading, setLoading] = useState(true);
	const [showLoading, setShowLoading] = useState(true);
	const [selected, setSelected] = useState(PROJECTS);
	const [sectionsPos, setSectionPos] = useState({
		projects: 0,
		about: 0,
		contact: 0
	});
	const [showTip, setShowTip] = useState(true);

	//get section pos
	useEffect(() => {
		function getPosition(ele) {
			const pos = ele.getBoundingClientRect().top;
			const scrollTop = window.scrollY;
			return pos + scrollTop;
		}
		function onResize() {
			setSectionPos({
				projects: getPosition(document.getElementById(PROJECTS)),
				about: getPosition(document.getElementById(ABOUT)),
				contact: getPosition(document.getElementById(CONTACT))
			});
		}

		onResize();

		window.addEventListener("resize", onResize, false);

		return () => window.removeEventListener("resize", onResize, false);
	}, []);

	//set nav selections
	useEffect(() => {
		let pos = window.scrollY;
		const offset = window.innerHeight;

		function onScroll() {
			pos = window.scrollY;
			if (pos < sectionsPos.about - offset && selected !== PROJECTS) {
				setSelected(PROJECTS);
			} else if (
				pos >= sectionsPos.about - offset &&
				pos < sectionsPos.contact - offset &&
				selected !== ABOUT
			) {
				setSelected(ABOUT);
			} else if (pos >= sectionsPos.contact - offset && selected !== CONTACT) {
				setSelected(CONTACT);
			}

			//show Tip
			if (pos > 20) {
				setShowTip(false);
			} else {
				setShowTip(true);
			}
		}
		window.addEventListener("scroll", onScroll, false);

		return () => {
			window.removeEventListener("scroll", onScroll, false);
		};
	}, [selected, sectionsPos]);

	return (
		<div className={styles.container} id="mainContainer">
			<Head>
				<title>Nicolas Deheza</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ThreeBk setLoading={setLoading} setSectionPos={setSectionPos} />
			<Header subtitle={t("subtitle")} tip={t("tip")} showTip={showTip} />
			<div className={styles.transition} id="t1" />
			<Projects
				id={"projects"}
				projectData={projectsData[0]}
				text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
			/>
			<div className={styles.transition} id="t2" />
			<Projects
				projectData={projectsData[1]}
				text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
			/>
			<div className={styles.transition} id="t3" />
			<Projects
				projectData={projectsData[2]}
				text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
			/>
			<div className={styles.transition} id="t4" />

			{/*add project data. dont work without it! */}
			<OthersProjects
				title={t("OthersProjects.title")}
				text={[t("Article.technologys"), t("Article.code"), t("Article.demo")]}
				projectsData={projectsData.slice(3)}
			/>
			<div className={styles.transition} id="t5" />

			<About id={"about"} title={t("About.title")} text={aboutText} />
			<div className={styles.transition} id="t6" />

			<Contact
				id={"contact"}
				text={[
					t("Contact.name"),
					t("Contact.email"),
					t("Contact.phone"),
					t("Contact.message"),
					t("Contact.send"),
					t("Contact.required"),
					t("Contact.title")
				]}
			/>

			<NavM
				projects={t("Nav.projects")}
				about={t("Nav.about")}
				contact={t("Nav.contact")}
				selected={selected}
				pos={sectionsPos}
			/>
			<NavD
				projects={t("Nav.projects")}
				about={t("Nav.about")}
				contact={t("Nav.contact")}
				selected={selected}
				pos={sectionsPos}
			/>
			{showLoading ? <Loading loading={loading} setShowLoading={setShowLoading} /> : null}
		</div>
	);
}
