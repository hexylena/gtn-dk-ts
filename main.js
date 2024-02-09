const fs = require('fs');

const HANDS_ON_TOOL_BOX_TEMPLATE = `
## Sub-step with **{{tool_name}}**

> <hands-on-title> Task description </hands-on-title>
>
> 1. {% tool [{{tool_name}}]({{tool_id}}) %} with the following parameters:{{paramlist}}
>
>    ***TODO***: *Check parameter descriptions*
>
>    ***TODO***: *Consider adding a comment or tip box*
>
>    > <comment-title> short description </comment-title>
>    >
>    > A comment about the tool or something else. This box can also be in the main text
>    {: .comment}
>
{: .hands_on}

***TODO***: *Consider adding a question to test the learners understanding of the previous exercise*

> <question-title></question-title>
>
> 1. Question1?
> 2. Question2?
>
> > <solution-title></solution-title>
> >
> > 1. Answer for question1
> > 2. Answer for question2
> >
> {: .solution}
>
{: .question}
`

const TUTO_HAND_ON_BODY_TEMPLATE = `
# Introduction

<!-- This is a comment. -->

General introduction about the topic and then an introduction of the
tutorial (the questions and the objectives). It is nice also to have a
scheme to sum up the pipeline used during the tutorial. The idea is to
give to trainees insight into the content of the tutorial and the (theoretical
and technical) key concepts they will learn.

You may want to cite some publications; this can be done by adding citations to the
bibliography file (\`tutorial.bib\` file next to your \`tutorial.md\` file). These citations
must be in bibtex format. If you have the DOI for the paper you wish to cite, you can
get the corresponding bibtex entry using [doi2bib.org](https://doi2bib.org).

With the example you will find in the \`tutorial.bib\` file, you can add a citation to
this article here in your tutorial like this:
{% raw %} \`{% cite Batut2018 %}\`{% endraw %}.
This will be rendered like this: {% cite Batut2018 %}, and links to a
[bibliography section](#bibliography) which will automatically be created at the end of the
tutorial.


**Please follow our
[tutorial to learn how to fill the Markdown]({{ site.baseurl }}/topics/contributing/tutorials/\
create-new-tutorial-content/tutorial.html)**

> <agenda-title></agenda-title>
>
> In this tutorial, we will cover:
>
> 1. TOC
> {:toc}
>
{: .agenda}

# Title for your first section

Give some background about what the trainees will be doing in the section.
Remember that many people reading your materials will likely be novices,
so make sure to explain all the relevant concepts.

## Title for a subsection
Section and subsection titles will be displayed in the tutorial index on the left side of
the page, so try to make them informative and concise!

# Hands-on Sections
Below are a series of hand-on boxes, one for each tool in your workflow file.
Often you may wish to combine several boxes into one or make other adjustments such
as breaking the tutorial into sections, we encourage you to make such changes as you
see fit, this is just a starting point :)

Anywhere you find the word "***TODO***", there is something that needs to be changed
depending on the specifics of your tutorial.

have fun!

## Get data

> <hands-on-title> Data Upload </hands-on-title>
>
> 1. Create a new history for this tutorial
> 2. Import the files from [Zenodo]({{ page.zenodo_link }}) or from
>    the shared data library (\`GTN - Material\` -> \`{{ page.topic_name }}\`
>     -> \`{{ page.title }}\`):
>
>    \`\`\`
>    {{ z_file_links }}
>    \`\`\`
>    ***TODO***: *Add the files by the ones on Zenodo here (if not added)*
>
>    ***TODO***: *Remove the useless files (if added)*
>
>    {% snippet faqs/galaxy/datasets_import_via_link.md %}
>
>    {% snippet faqs/galaxy/datasets_import_from_data_library.md %}
>
> 3. Rename the datasets
> 4. Check that the datatype
>
>    {% snippet faqs/galaxy/datasets_change_datatype.md datatype="datatypes" %}
>
> 5. Add to each database a tag corresponding to ...
>
>    {% snippet faqs/galaxy/datasets_add_tag.md %}
>
{: .hands_on}

# Title of the section usually corresponding to a big step in the analysis

It comes first a description of the step: some background and some theory.
Some image can be added there to support the theory explanation:

![Alternative text](../../images/image_name "Legend of the image")

The idea is to keep the theory description before quite simple to focus more on the practical part.

***TODO***: *Consider adding a detail box to expand the theory*

> <details-title> More details about the theory </details-title>
>
> But to describe more details, it is possible to use the detail boxes which are expandable
>
{: .details}

A big step can have several subsections or sub steps:

{{ body }}

## Re-arrange

To create the template, each step of the workflow had its own subsection.

***TODO***: *Re-arrange the generated subsections into sections or other subsections.
Consider merging some hands-on boxes to have a meaningful flow of the analyses*

# Conclusion

Sum up the tutorial and the key takeaways here. We encourage adding an overview image of the
pipeline used.`


const TUTO_HAND_ON_TEMPLATE = `---
layout: tutorial_hands_on

title: {{ title }}
zenodo_link: '{{ zenodo_link }}'
questions:
- Which biological questions are addressed by the tutorial?
- Which bioinformatics techniques are important to know for this type of data?
objectives:
- The learning objectives are the goals of the tutorial
- They will be informed by your audience and will communicate to them and to yourself
  what you should focus on during the course
- They are single sentences describing what a learner should be able to do once they
  have completed the tutorial
- You can use Bloom's Taxonomy to write effective learning objectives
time_estimation: 3H
key_points:
- The take-home messages
- They will appear at the end of the tutorial
contributions:
  authorship:
  - contributor1
  editing:
  - contributor2
  testing:
  - contributor3
  funding:
  - project-name
---

{{ body }}
`

INPUT_PARAM = `
>{{space}}- *"{{param_label}}"*: \`{{param_value}}\``

INPUT_FILE_TEMPLATE = `
>{{space}}- {% icon {{icon}} %} *"{{input_name}}"*: {{input_value}}`

INPUT_SECTION = `
>{{space}}- In *"{{section_label}}"*:`

INPUT_ADD_REPEAT = `
>{{space}}- {% icon param-repeat %} *"Insert {{repeat_label}}"*`

SPACE = "    "


function render_template(template, data) {
	return template.replace(/{{([^}]*)}}/g, function (a, b) {
		b = b.trim();
		if(b == "page.zenodo_link" || b == "page.topic_name" || b == "page.title" || b == "site.baseurl"){
			return `{{ ${b} }}`
		}

		if(data[b] === undefined){
			console.log(`Warning: ${b} is not defined in the data`)
			return "";
		}

		return data[b];
	});
}

function to_bool(string_value){
	if (typeof string_value === "boolean"){
		return string_value
	}
	return string_value.toLowerCase() === "true"
}


function get_empty_input() {
	return render_template(INPUT_FILE_TEMPLATE, {
		space: SPACE,
		icon: "param-file",
		input_name: "Input file",
		input_value: "File (empty input)"
	})

}

function get_input_tool_name(step_id, steps){
	let inp_provenance = ""
	let inp_prov_id = step_id.toString()
	if (inp_prov_id in steps){
		let name = steps[inp_prov_id].name
		if (name.includes("Input dataset")){
			inp_provenance = `(${name})`
		} else {
			inp_provenance = `(output of **${name}** {% icon tool %})`
		}
	}
	return inp_provenance
}

class ToolInput {
	constructor(tool_inp_desc, wf_param_values, wf_steps, level, should_be_there, force_default, source, optional_tool_id) {
		if(optional_tool_id.indexOf('multiqc') > -1){
			console.log(`${optional_tool_id} ToolInput ${tool_inp_desc.model_class} "${tool_inp_desc.title || tool_inp_desc.label}"`,
				// 'wf_param_values', wf_param_values,
				level, should_be_there, force_default, source)
			this.enable_log = true;
		}
		this.optional_tool_id = optional_tool_id

		this.name = tool_inp_desc.name
		if (tool_inp_desc.type === undefined){
			throw new Error(`No type for the parameter ${tool_inp_desc.name}`)
		}
		this.type = tool_inp_desc.type
		this.tool_inp_desc = tool_inp_desc
		this.level = level
		this.wf_param_values = wf_param_values
		this.wf_steps = wf_steps
		this.formatted_desc = ""
		this.should_be_there = should_be_there || false
		this.force_default = force_default || false

		this.log('output_cols', this.name, this.tool_inp_desc)
		this.log('output_cols', this.name, this.tool_inp_desc.value, this.wf_param_values[this.name])
		if(this.wf_param_values[this.name] === undefined) {
			if (this.should_be_there, should_be_there) {
				throw new Error(`Parameter ${this.name} not in wf_param_values (${optional_tool_id}, ${JSON.stringify(wf_param_values)})`)
			} else {
				this.log(`Parameter ${this.name} not in workflow`)
				// DIFF from planemo, here we forcibly throw to
				// prevent any spurious output.
				throw new Error(`Parameter ${this.name} not in wf_param_values`)
			}
		} else {
			this.wf_param_values = this.wf_param_values[this.name]
		}
	}

	log(){
		if(this.enable_log !== undefined){
			console.log(" ".repeat(this.level), ...arguments)
		}
	}

	get_formatted_inputs() {
		this.log('gfi');
		let inputlist = ""
		let inps = []
		let icon;
		this.log('this.wf_param_values', this.wf_param_values)
		if (Array.isArray(this.wf_param_values)) {
			icon = "param-files"
			for (let i in this.wf_param_values){
				inps.push(`\`${i['output_name']}\` ${get_input_tool_name(i['id'], this.wf_steps)}`)
			}
		} else {
			let inp = this.wf_param_values

			if (inp.id !== undefined){
				// Single input or collection
				let inp_type = this.wf_steps[inp.id].type
				if (inp_type.indexOf('collection') > -1){
					icon = "param-collection"
				} else {
					icon = 'param-file'
				}
				inps.push(`\`${inp.output_name}\` ${get_input_tool_name(inp.id, this.wf_steps)}`)
			}
		}

		if (inps.length > 0){
			inputlist += render_template(INPUT_FILE_TEMPLATE, {
				icon: icon,
				input_name: this.tool_inp_desc.label,
				input_value: inps.join(', '),
				space: SPACE.repeat(this.level)
			})
		}
		return inputlist
	}

	get_formatted_other_param_desc(){
		this.log('gfopd');
		let param_value;
		if (this.tool_inp_desc.value == this.wf_param_values && !this.force_default){
			return "";
			// nothing
		} else if (this.type == "boolean") {
			if(to_bool(this.tool_inp_desc.value) === this.wf_param_values){
				//nothing
			} else {
				param_value = this.wf_param_values ? "Yes" : "No"
			}
		} else if (this.type == "select") {
			let param_values = []
			for (let option_idx in this.tool_inp_desc.options){
				let option = this.tool_inp_desc.options[option_idx]
				this.log('option', option, this.wf_param_values)
				// BEGIN DIFF vs original
				if(Array.isArray(this.wf_param_values)){
					if(this.wf_param_values.indexOf(option[1]) > -1){
						param_values.push(option[0])
					}
				} else {
					if (option[1] == this.wf_param_values){
						param_values.push(option[0])
						break;
					}
				}
				// END DIFF
			}
			param_value = param_values.join(', ')
		} else if (this.type == "data_column") {
			param_value = `c${this.wf_param_values}`
		} else {
			param_value = this.wf_param_values
		}

		let param_desc = "";
		if(param_value){
			param_desc = render_template(INPUT_PARAM, {
				param_label: this.tool_inp_desc.label,
				param_value: param_value,
				space: SPACE.repeat(this.level),
			})
		}
		return param_desc
	}

	get_formatted_conditional_desc(){
		this.log('gfcd');
		let conditional_paramlist = ""
		let inpp = new ToolInput(
			this.tool_inp_desc.test_param,
			this.wf_param_values,
			this.wf_steps,
			this.level,
			true,
			true,
			'z',
			this.optional_tool_id,
		)
		conditional_paramlist += inpp.get_formatted_desc()
		let cond_param = inpp.wf_param_values

		// Get parameters in the when and their values
		let tmp_tool_inp_desc = this.tool_inp_desc
		for (let caseC_idx in tmp_tool_inp_desc.cases) {
			let caseC = tmp_tool_inp_desc.cases[caseC_idx]
			if(caseC.value === cond_param && caseC.inputs.length > 0){
				this.tool_inp_desc = caseC
				conditional_paramlist += this.get_lower_param_desc()
			}
		}
		this.tool_inp_desc = tmp_tool_inp_desc
		return conditional_paramlist
	}

	get_lower_param_desc(){
		this.log('glpd');
		let sub_param_desc = "";
		for (let inp_idx in this.tool_inp_desc.inputs){
			let inp = this.tool_inp_desc.inputs[inp_idx]
			// might throw
			// this.log('inp2', JSON.stringify(inp))
			try {
				let tool_inp = new ToolInput(
					inp,
					this.wf_param_values,
					this.wf_steps,
					this.level + 1,
					false, false, 'x',
					this.optional_tool_id,
				)
				sub_param_desc += tool_inp.get_formatted_desc()
			} catch (e) {
				// This is a difference from planemo, there the error somehow just results in an empty parameter?
				this.log('error', e)
			}
		}
		return sub_param_desc
	}

	get_formatted_repeat_desc(){
		this.log('gfrd');
		let repeat_paramlist = "";
		if (this.wf_param_values != "[]"){
			// let tool_inp = {}
			// for (let inp_idx in this.tool_inp_desc.inputs){
			// 	let inp = this.tool_inp_desc.inputs[inp_idx]
			// 	// TODO: setdefault
			// 	tool_inp[inp.name] = inp
			// }
			let tmp_wf_param_values = structuredClone(this.wf_param_values)
			let cur_level = this.level
			for (let param_idx in tmp_wf_param_values) {
				let param = tmp_wf_param_values[param_idx]
				this.wf_param_values = param
				this.level = cur_level + 1
				let paramlist_in_repeat = this.get_lower_param_desc()
				this.log('param_idx', param_idx, param)
				this.log('paramlist_in_repeat', '.', paramlist_in_repeat, '.')

				if(paramlist_in_repeat !== ""){
					repeat_paramlist += render_template(INPUT_ADD_REPEAT, {
						space: SPACE.repeat(this.level),
						repeat_label: this.tool_inp_desc.title,
					})
					repeat_paramlist += paramlist_in_repeat
				}
				this.level = cur_level
			}
			this.wf_param_values = tmp_wf_param_values
		}

		let repeat_desc = "";
		if (repeat_paramlist !== ""){
			repeat_desc = render_template(INPUT_SECTION, {
				space: SPACE.repeat(this.level),
				section_label: this.tool_inp_desc.title,
			}) + repeat_paramlist
		}
		return repeat_desc
	}

	get_formatted_section_desc(){
		this.log('gfsd');
		let section_paramlist = "";
		let sub_param_desc = this.get_lower_param_desc();
		if(sub_param_desc != ""){
			return render_template(INPUT_SECTION, {
				space: SPACE.repeat(this.level),
				section_label: this.tool_inp_desc.title,
			}) + sub_param_desc
		}
		return "";
	}

	get_formatted_desc() {
		this.log('gfd')
		if(this.wf_param_values){
			if(this.type === "data" || this.type === "data_collection"){
				this.formatted_desc += this.get_formatted_inputs()
			} else if(this.type == "section"){
				this.formatted_desc += this.get_formatted_section_desc()
			} else if(this.type == "conditional"){
				this.formatted_desc += this.get_formatted_conditional_desc()
			} else if(this.type == "repeat"){
				this.formatted_desc += this.get_formatted_repeat_desc()
			} else {
				this.formatted_desc += this.get_formatted_other_param_desc()
			}
		}
		return this.formatted_desc
	}

}












function get_wf_param_values(init_params, inp_connection, depth) {
	// console.log(`${"	".repeat(depth)}get_wf_param_values(${init_params}, ${JSON.stringify(inp_connection)})`);
	// console.log(`${"	".repeat(depth)}received init_params: ${typeof init_params} ${JSON.stringify(init_params)}`);

	let form_params = undefined;
	// check if it's  a str/jsonlike
	if (typeof init_params !== 'string' || !init_params.includes('": ')) {
		form_params = init_params;
	} else {
		form_params = JSON.parse(init_params);
	}

	// if it's a dict
	if (Array.isArray(form_params)) {
		// console.log(`${"	".repeat(depth)}a${JSON.stringify(form_params)} ${Object.prototype.toString.call(form_params)}`);

		// DIFF FROM PLANEMO
		return form_params.map((p, i) => {
			// inp = inp_connections[str(i)] if str(i) in inp_connections else {}
			// form_params.append(get_wf_param_values(p, inp))
			// XREF: HMM?!
			// this was accessing it via `input_1` which is technically wrong, the key is supposed to be `input` : {"1": ...}` 
			// so instad wel'l just make sure that key exists :upside down smiley:
			let inp = inp_connection[i.toString()] ||  {};
			// console.log(`${"	".repeat(depth)}iii${JSON.stringify(i)} → ${JSON.stringify(p)} ${JSON.stringify(inp_connection)}`);
			return get_wf_param_values(p, inp, depth + 1);
		})

	} else if (typeof form_params === 'string' && form_params.includes('"')) {
		// console.log(`${"	".repeat(depth)}s${JSON.stringify(form_params)} ${Object.prototype.toString.call(form_params)}`);
		return form_params.replace(/"/g, '');
	} else if (Object.prototype.toString.call(form_params) === '[object Object]') {
		// console.log(`${"	".repeat(depth)}o${JSON.stringify(form_params)} ${Object.prototype.toString.call(form_params)}`);
		if (form_params.__class__ === 'RuntimeValue' || form_params.__class__ === 'ConnectedValue') {
			// console.log(`${"	".repeat(depth)}RuntimeValue ${JSON.stringify(form_params)} ${JSON.stringify(inp_connection)}`);
			return inp_connection;
		} else {
			// console.log(`${"	".repeat(depth)}hexyform_params ${JSON.stringify(form_params)} ${JSON.stringify(inp_connection)}`);

			let UGH = {};
			Object.keys(form_params).map((p) => {
			// for (let p in form_params) {
				let inp = inp_connection[p.toString()] || {};
				// console.log(`${"	".repeat(depth)}p${p} ${JSON.stringify(inp_connection[p])} => ${JSON.stringify(inp)}`);
				// copy the object
				// form_params[p] = get_wf_param_values(structuredClone(form_params[p]), inp, depth + 1);
				UGH[p] = get_wf_param_values(structuredClone(form_params[p]), inp, depth + 1);
			});
			return UGH
		}
	}
	// console.log(`${"	".repeat(depth)} return`, form_params);
	return form_params;
}

// expected input
// "input_connections": {
//   "results_0|software_cond|output_0|input": {
//     "id": 11,
//     "output_name": "text_file"
//   },
//   "results_0|software_cond|output_1|input": {
//     "id": 5,
//     "output_name": "text_file"
//   },
//   "results_1|software_cond|input": {
//     "id": 3,
//     "output_name": "report"
//   },
//   "results_2|software_cond|input": {
//     "id": 6,
//     "output_name": "summary_file"
//   },
//   "results_3|software_cond|output_0|type|input": {
//     "id": 9,
//     "output_name": "output"
//   },
//   "results_3|software_cond|output_1|type|input": {
//     "id": 10,
//     "output_name": "outputtxt"
//   },
//   "results_4|software_cond|input": {
//     "id": 8,
//     "output_name": "output_summary"
//   }
// },


// expected output
// {
//   results: {
//     '0': {
//       software_cond: {
//         output: { '0': { input: { id: 11, output_name: 'text_file' } } }
//         output: { '1': { input: { id: 5, output_name: 'text_file' } } }
//       }
//     },
//     '1': { software_cond: { input: { id: 3, output_name: 'report' } } },
//     '2': { software_cond: { input: { id: 6, output_name: 'summary_file' } } },
//     '3': { software_cond: {
//         output: {
//           '0': { type: { input: { id: 9, output_name: 'outputtxt' } } }
//           '1': { type: { input: { id: 10, output_name: 'outputtxt' } } }
//         }
//       }
//     },
//     '4': { software_cond: { input: { id: 8, output_name: 'output_summary' } } }
//   }
// }
const repeat_regex = /^(?<prefix>[^\|]*)_(?<nb>\d+)$/;

// BEGIN DIFF TO PLANEMO
function path2obj(path, obj){
	// console.log(`path: ${path}, obj: ${JSON.stringify(obj)}`);
	if (path.length === 0) {
		return obj;
	} else {
		let top_level = path.split('|')[0];
		let rest = path.split('|').slice(1).join('|');
		let repeat_search = top_level.match(repeat_regex);
		if (repeat_search) {
			return {
				[repeat_search.groups.prefix]: {[repeat_search.groups.nb.toString()]: path2obj(rest, obj)},
				// HMM?!
				[repeat_search.groups.prefix + "_" + repeat_search.groups.nb.toString()]: path2obj(rest, obj)
			};
		} else {
			return {[top_level]: path2obj(rest, obj)};
		}
	}
};

// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge/61395050#61395050
function deepAssign(target, ...sources) {
	for (source of sources) {
		for (let k in source) {
			let vs = source[k], vt = target[k]
			if (Object(vs) == vs && Object(vt) === vt) {
				target[k] = deepAssign(vt, vs)
				continue
			}
			target[k] = source[k]
		}
	}
	return target
}

function get_wf_inputs(step_inp, depth) {
	let inputs = {};
	for (let inp_n in step_inp) {
		let inp = step_inp[inp_n];
		let to_merge = path2obj(inp_n, inp);
		deepAssign(inputs, to_merge);
	}
	return inputs;
}
// END DIFF TO PLANEMO

function process_wf_step(wf_step, tool_descs, steps) {
	// console.log(`process_wf_step(${JSON.stringify(wf_step)}, ${tool_descs})`);
	let wf_param_values = {};

	if (wf_step.tool_state && wf_step.input_connections) {
		wf_param_values = get_wf_param_values(wf_step.tool_state, get_wf_inputs(wf_step.input_connections), 0);
	}

	// if(wf_step.tool_id.indexOf("cutadapt") > -1) {
	// 	const util = require('util')
	// 	console.log(util.inspect(get_wf_inputs(wf_step.input_connections, 0), false, null, true /* enable colors */))
	// 	// sysexit()
	// }

	// console.log(`wf_param_values:`, wf_param_values);
	if (!wf_param_values) {
		return;
	}

	tool_desc = tool_descs[wf_step.tool_id] || {"inputs": []};
	let paramlist = "";
	console.log(`# Tool ${wf_step.tool_id}`);
	for (let inp of tool_desc.inputs) {
		if (! inp.name.startsWith("__")) {
			let tool_inp = new ToolInput(inp, wf_param_values, steps, 1, true, false, 'y', wf_step.tool_id);
			paramlist += tool_inp.get_formatted_desc();
		}
	}
	return render_template(
		HANDS_ON_TOOL_BOX_TEMPLATE,
		{
			tool_name: wf_step.name,
			tool_id: wf_step.tool_id,
			paramlist: paramlist
		}
	);
}

function process_workflow_with_zenodo(bodies, wf_id, zenodo_file_links, zenodo_link) {
	final_body = render_template(TUTO_HAND_ON_BODY_TEMPLATE, {
		body: bodies,
		z_file_links: zenodo_file_links.map(e => e.url).sort().join("\n>    "),
	});

	const final_tuto = render_template(TUTO_HAND_ON_TEMPLATE, {
		body: final_body,
		title: "My Tutorial Title",
		zenodo_link: zenodo_link,
	});

	let tutorial_name;
	if(wf_id === undefined){
		tutorial_name = "tutorial-ptdk-js.md";
	} else {
		tutorial_name = `tutorial-ptdk-js-${wf_id}.md`;
	}

	fs.writeFile(tutorial_name, final_tuto, (err) => {
		if (err) throw err;
		console.log(`The file has been saved! ${tutorial_name}`);
	})
}

function process_workflow(data, wf_id, zenodo_link) {
	// fs.writeFileSync(`${wf_id}.json`, JSON.stringify(data, null, 2));
	let steps = Object.keys(data.steps)
		.map(step_id => {
			return [step_id, data.steps[step_id]];
		});

	// Collect tool information
	let tool_desc_query = steps
		.map((step) => {
			return step[1];
		})
		.filter(value => { return value.tool_id !== undefined; })
		.map(tool => {
			// Difference from PTDK/planemo: we supply the tool version *additionally* in the URL parameter
			// This is a workaround *specifically* for tools like Grep1 which changed top level default params between 1.0.1 and 1.0.4
			//
			const toolURL = new URL(`https://usegalaxy.eu/api/tools/${tool.tool_id}`);
			toolURL.searchParams.append('io_details', 'True');
			toolURL.searchParams.append('link_details', 'False');
			toolURL.searchParams.append('tool_version', tool.tool_version);

			return fetch(toolURL)
				.then(response => response.json())
		});

	Promise.all(tool_desc_query).then(tdq => {
		let tool_descs = {}
		tdq.forEach(td => {
			tool_descs[td.id] = td;
		});
		console.log(`Obtained tool descriptions: ${Object.keys(tool_descs).length}`);

		let pre_steps = steps
			.map((step) => {
				return step[1]
			})

		let bodies = pre_steps
			.filter((step) => {
				return step.type != 'data_input' && step.type != 'data_collection_input';
			})
			.map((wf_step) => process_wf_step(wf_step, tool_descs, pre_steps)).join("");

		// write to file
		let z_record;
		if(zenodo_link !== undefined){
			if (zenodo_link.indexOf("doi") > -1) {
				z_record = zenodo_link.split(".").pop();
			} else {
				z_record = zenodo_link.split("/").pop();
			}
			zenodo_link_api = `https://zenodo.org/api/records/${z_record}`;

			fetch(zenodo_link_api)
				.then(response => response.json())
				.then(data => {
					let zenodo_file_links = data.files.map(file => {
						return {
							url: file.links.self,
							src: "url",
							ext: file.key.split(".").pop() // TODO: map to galaxy
						}
					})

					process_workflow_with_zenodo(bodies, wf_id, zenodo_file_links, zenodo_link);
				});
		} else {
			process_workflow_with_zenodo(bodies, wf_id, [], "");
		}


	}).catch(err => {
		console.error(err);
	});
}

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
args = {}
for (let i = 2; i < process.argv.length; i += 2) {
	if (process.argv[i] === "--help" || process.argv[i] === "-h" || process.argv[i + 1] === "--help" || process.argv[i + 1] === "-h") {
		console.log("Usage: node index.js [--wf-id <workflow_id>|--wf <workflow_file>] --zenodo <zenodo_link>");
		process.exit(0);
	}
	args[process.argv[i].substring(2)] = process.argv[i + 1];
}

if(args["wf-id"] !== undefined){
	fetch(`https://usegalaxy.eu/api/workflows/${wf_id}/download?format=json-download`)
		.then(response => response.json())
		.then(data => {
			// {
			// 	err_msg: 'Workflow is not owned by or shared with current user',
			// 	err_code: 403002
			// }
			if (data.err_code) {
				console.error(data.err_msg);
				return;
			}
			return data
		})
		.then(data => process_workflow(data, args["wf-id"], args["zenodo"]));
} else if(args["wf"] !== undefined){
	fs.readFile(args["wf"], 'utf8', (err, data) => {
		if (err) throw err;
		process_workflow(JSON.parse(data), undefined, args["zenodo"]);
	});
} else {
	console.error("No workflow provided");
}

// read the workflow from the JSON file
