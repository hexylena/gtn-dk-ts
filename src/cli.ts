import { process_workflow } from "./lib";
const fs = require("fs");

// const wfs = [
// 	'17352c36a0011c6a',
// 	'8ca9a936aa3d06af',
// 	'4ddbffe4b3fef275',
// 	'e1119904debfd22c',
// ]

// argv
// wf_id = process.argv[2];

// parse arguments
// --wf-id <workflow_id>
// --wf <workflow_file>
// --zenodo <zenodo_link>

// wf_path = process.argv[2];
// parse process.argv:
let args = {
	"wf-id": undefined,
	wf: undefined,
	zenodo: undefined,
};
let exit_flag: boolean = false;

const argv = typeof process === "undefined" ? [] : process.argv;

if (argv) {
	for (let i = 2; i < argv.length; i += 2) {
		if (
			argv[i] === "--help" ||
			argv[i] === "-h" ||
			argv[i + 1] === "--help" ||
			argv[i + 1] === "-h"
		) {
			exit_flag = true;
		}
		args[argv[i].substring(2)] = argv[i + 1];
	}
}

async function process() {
	if (exit_flag == false && args["wf-id"] !== undefined) {
		fetch(
			`https://usegalaxy.eu/api/workflows/${args["wf-id"]}/download?format=json-download`,
		)
			.then((response) => response.json())
			.then((data) => {
				// {
				// 	err_msg: 'Workflow is not owned by or shared with current user',
				// 	err_code: 403002
				// }
				if (data.err_code) {
					console.error(data.err_msg);
					return;
				}
				return data;
			})
			.then(async (data) => {
				let resp = await process_workflow(data, args["wf-id"], args["zenodo"]);
				if (resp) {
					let [_title, tuto] = resp;
					console.log(tuto);
				}
			});
	} else if (exit_flag == false && args["wf"] !== undefined) {
		fs.readFile(args["wf"], "utf8", async (err, data) => {
			if (err) throw err;
			let resp = await process_workflow(
				JSON.parse(data),
				undefined,
				args["zenodo"],
			);
			if (resp) {
				let [_title, tuto] = resp;
				console.log(tuto);
			}
		});
	} else {
		console.log(
			"Usage: node index.js [--wf-id <workflow_id>|--wf <workflow_file>] --zenodo <zenodo_link>",
		);
	}
}

process();

// read the workflow from the JSON file
