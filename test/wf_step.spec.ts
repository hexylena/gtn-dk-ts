import { get_input_tool_name, WorkflowSteps, WorkflowStep } from '../src/lib';
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

