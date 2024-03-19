import { process_wf_step, get_input_tool_name, WorkflowSteps, WorkflowStep, ToolInput, flatten_workflow_steps, obtain_tool_descs } from '../src/lib';
const fs = require("fs");

const wf = JSON.parse(fs.readFileSync('ex/Galaxy-Workflow-mRNA-Seq_BY-COVID_Pipeline__Analysis.json', "utf-8"));


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


describe('fuck it we ball', () => {
  test('process_wf_step', async () => {
    let step: WorkflowStep = wf.steps["3"];
    let flat = flatten_workflow_steps(wf.steps).map(x => x[1]);
    let tool_descs = await obtain_tool_descs(flat);

    let out = process_wf_step(step["3"], tool_descs, flat)
    expect(out).toBe("x")
  })
})