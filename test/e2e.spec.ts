import { process_workflow } from '../src/lib';
const fs = require("fs");

const wf = JSON.parse(fs.readFileSync('ex/Galaxy-Workflow-mRNA-Seq_BY-COVID_Pipeline__Analysis.json', "utf-8"));
const formatted_pz = fs.readFileSync('ex/17352c36a0011c6a-zenodo.md', 'utf-8')
const formatted_nz = fs.readFileSync('ex/17352c36a0011c6a-nozenodo.md', 'utf-8')


describe('e2e', () => {
  test('process_wf', async () => {
    let result = await process_workflow(wf, undefined, undefined)
    if(result){
        let [title, contents] = result;
        expect(title).toBe('tutorial-ptdk-js.md')
        expect(contents).toBe(formatted_nz)
    }
  })

  test('process_wf with zenodo', async () => {
    let result = await process_workflow(wf, undefined, 'https://zenodo.org/record/10405036')
    if(result){
        let [title, contents] = result;
        expect(title).toBe('tutorial-ptdk-js.md')
        expect(contents).toBe(formatted_pz)
    }
  })
})
