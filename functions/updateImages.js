import fs from "fs";
import {STRAPI_URL} from "../constant/constant";

export default async function updateImages(projectsData, imgPath) {
	const projectImageNames = projectsData.map((p) => p.thumbnail.hash + p.thumbnail.ext);
	fs.readdir(imgPath, (err, files) => {
		if (err) {
			console.log(err);
		} else {
			if (files.length > 0) {
				files.forEach((file) => {
					const index = projectImageNames.findIndex((e) => e === file);
					if (index < 0) {
						fs.unlink(imgPath + "/" + file, (err) => {
							if (err) {
								console.log(err);
							} else {
								console.log(`${file} deleted`);
							}
						});
					} else {
						projectImageNames.splice(index, 1);
					}
				});
			}
			//save images
			if (projectImageNames.length > 0) {
				projectImageNames.forEach((ele) => {
					const url = STRAPI_URL + "/uploads/" + ele;
					const path = imgPath + "/" + ele;
					download(url, path, () => console.log(`${ele} download`));
				});
			}
		}
	});
}

async function download(url, path, callback) {
	const response = await fetch(url);
	const buffer = await response.buffer();
	fs.writeFile(path, buffer, callback);
}
