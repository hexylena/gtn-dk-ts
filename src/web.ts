import { process_workflow_web } from "./lib";
export { process_workflow_web } from "./lib";

// export default class GtnDK {
//         public process_wf(url, zenodo) {
//                 return process_workflow_web(url, zenodo)
//         }
// }
document.getElementById('submit').addEventListener('click', function() {
	document.getElementById('output').innerText = "Processing...";
	document.getElementById('submit').setAttribute('disabled', 'true');
        var zenodo = document.getElementById('zenodo')?.value;
        var url = document.getElementById('url')?.value;
        process_workflow_web(url, zenodo).then(function(output) {
		console.log(output)
		document.getElementById('output').innerText = output[1];
		document.getElementById('submit').removeAttribute('disabled');
        });
});
console.log("Ready")
