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

for (let i = 2; i < process.argv.length; i += 2) {
	if (
		process.argv[i] === "--help" ||
		process.argv[i] === "-h" ||
		process.argv[i + 1] === "--help" ||
		process.argv[i + 1] === "-h"
	) {
		console.log(
			"Usage: node index.js [--wf-id <workflow_id>|--wf <workflow_file>] --zenodo <zenodo_link>",
		);
		process.exit(0);
	}
	args[process.argv[i].substring(2)] = process.argv[i + 1];
}

async function process(){
if (args["wf-id"] !== undefined) {
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
			let [title, tuto] = await process_workflow(data, args["wf-id"], args["zenodo"])
			console.log(tuto)
		});
} else if (args["wf"] !== undefined) {
	fs.readFile(args["wf"], "utf8", async (err, data) => {
		if (err) throw err;
		let [title, tuto] = await process_workflow(JSON.parse(data), undefined, args["zenodo"]);
		console.log(tuto)
	});
} else {
	console.error("No workflow provided");
}
}

process();

// read the workflow from the JSON file
