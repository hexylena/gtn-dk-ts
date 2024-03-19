import { process_wf_step, get_input_tool_name, WorkflowSteps, WorkflowStep, ToolInput, flatten_workflow_steps, obtain_tool_descs, obtain_paramlist } from '../src/lib';
const fs = require("fs");

const wf = JSON.parse(fs.readFileSync('ex/Galaxy-Workflow-mRNA-Seq_BY-COVID_Pipeline__Analysis.json', "utf-8"));
const tool_descs = JSON.parse(fs.readFileSync('test/tool_descs.json', "utf-8"));

describe(get_input_tool_name, () => {
  test('gets step correctly.', () => {
    let steps: WorkflowSteps = wf.steps;

    expect(get_input_tool_name(1, steps)).toBe(`(Input dataset)`)
    expect(get_input_tool_name(2, steps)).toBe(`(Input dataset collection)`)

    // yea these look right
    for(let i = 3; i < 18; i++) {
      expect(get_input_tool_name(i, steps)).toBe(`(output of **${steps[i]['name']}** {% icon tool %})`)
    }
  })
})

const cj_desc = `
## Sub-step with **Column join**

> <hands-on-title> Task description </hands-on-title>
>
> 1. {% tool [Column join](toolshed.g2.bx.psu.edu/repos/iuc/collection_column_join/collection_column_join/0.0.3) %} with the following parameters:
>    - {% icon param-collection %} *"Tabular files"*: \`output\` (Input dataset collection)
>    - *"Number of header lines in each input file"*: \`1\`
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


describe('fuck it we ball', () => {
  test('process_wf_step', async () => {
    let step: WorkflowStep = wf.steps["3"];
    let flat = flatten_workflow_steps(wf.steps).map(x => x[1]);

    // Check that tool descs looks right.
    let goseq = tool_descs["toolshed.g2.bx.psu.edu/repos/iuc/goseq/goseq/1.50.0+galaxy0"];
    expect(goseq['description']).toBe("tests for overrepresented gene categories")
    expect(goseq['tool_shed_repository']['changeset_revision']).toBe(`602de62d995b`)

    let out = process_wf_step(step, tool_descs, flat)
    expect(out).toBe(cj_desc)

    out = obtain_paramlist(step, tool_descs, flat)
    const cj_params = `
>    - {% icon param-collection %} *"Tabular files"*: \`output\` (Input dataset collection)
>    - *"Number of header lines in each input file"*: \`1\``
    expect(out).toBe(cj_params)

    out = obtain_paramlist(wf.steps["4"], tool_descs, flat)
    let expectation = `
>    - {% icon param-collection %} *"Tabular files"*: \`output\` (Input dataset collection)
>    - *"Number of header lines in each input file"*: \`1\``
    expect(out).toBe(expectation)


  })
})