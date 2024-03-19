import { process_wf_step, get_input_tool_name, WorkflowSteps, WorkflowStep, ToolInput, flatten_workflow_steps, obtain_tool_descs, obtain_paramlist } from '../src/lib';
const fs = require("fs");

const wf = JSON.parse(fs.readFileSync('ex/17352c36a0011c6a.json', "utf-8"));

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
  let flat = flatten_workflow_steps(wf.steps).map(x => x[1]);
  const tool_descs = JSON.parse(fs.readFileSync('test/tool_descs.json', "utf-8"));
  //const tool_descs = obtain_tool_descs(flat)

  test('check tool_descs (cached currently)', async () => {
    // Check that tool descs looks right.
    let goseq = tool_descs["toolshed.g2.bx.psu.edu/repos/iuc/goseq/goseq/1.50.0+galaxy0"];
    expect(goseq['description']).toBe("tests for overrepresented gene categories")
    expect(goseq['tool_shed_repository']['changeset_revision']).toBe(`602de62d995b`)
  })

  test('check one step fully', async () => {
    let step: WorkflowStep = wf.steps["3"];
    let out = process_wf_step(step, tool_descs, flat)
    expect(out).toBe(cj_desc)
  })

  test('check step 3', async () => {
    let out = obtain_paramlist(wf.steps["3"], tool_descs, flat)
    const cj_params = `
>    - {% icon param-collection %} *"Tabular files"*: \`output\` (Input dataset collection)
>    - *"Number of header lines in each input file"*: \`1\``
    expect(out).toBe(cj_params)
  })

  test('check step 4', async () => {
    let out = obtain_paramlist(wf.steps["4"], tool_descs, flat)
    let expectation = `
>    - {% icon param-collection %} *"Input List"*: \`output\` (Input dataset collection)
>    - *"How should a dataset be selected?"*: \`The first dataset\``
    expect(out).toBe(expectation)
  })

  test('check step 5', async () => {
    let out = obtain_paramlist(wf.steps["5"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"Sort Query"*: \`tabular_output\` (output of **Column join** {% icon tool %})
>    - In *"Column selections"*:
>        - {% icon param-repeat %} *"Insert Column selections"*
>            - *"on column"*: \`c1\`
>            - *"in"*: \`Descending order\``
    expect(out).toBe(expectation)
  })

  test('check step 6', async () => {
    let out = obtain_paramlist(wf.steps["6"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"File with IDs"*: \`tabular_output\` (output of **Column join** {% icon tool %})
>    - *"File has header?"*: \`Yes\`
>    - *"ID Type"*: \`Entrez\`
>    - *"Output columns"*: \`ENTREZID, SYMBOL, GENENAME\``
    expect(out).toBe(expectation)
  })

  test('check step 7', async () => {
    let out = obtain_paramlist(wf.steps["7"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"File to process"*: \`outfile\` (output of **Sort** {% icon tool %})
>    - In *"Replacement"*:
>        - {% icon param-repeat %} *"Insert Replacement"*
>            - *"Find pattern"*: \` uncompressed.fastqsanger\``
    expect(out).toBe(expectation)
  })

  test('check step 8', async () => {
    let out = obtain_paramlist(wf.steps["8"], tool_descs, flat)
    let expectation = `
>    - *"Differential Expression Method"*: \`limma-voom\`
>    - *"Count Files or Matrix?"*: \`Single Count Matrix\`
>        - {% icon param-file %} *"Count Matrix"*: \`outfile\` (output of **Replace Text** {% icon tool %})
>        - *"Input factor information from file?"*: \`Yes\`
>            - {% icon param-file %} *"Factor File"*: \`output\` (Input dataset)
>    - *"Use Gene Annotations?"*: \`Yes\`
>        - {% icon param-file %} *"Gene Annotations"*: \`out_tab\` (output of **annotateMyIDs** {% icon tool %})
>    - *"Input Contrast information from file?"*: \`No\`
>        - In *"Contrast"*:
>            - {% icon param-repeat %} *"Insert Contrast"*
>                - *"Contrast of Interest"*: \`COVID-healthy\`
>    - In *"Filter Low Counts"*:
>        - *"Filter lowly expressed genes?"*: \`Yes\`
>            - *"Filter on CPM or Count values?"*: \`CPM\`
>                - *"Minimum CPM"*: \`0.5\`
>                - *"Minimum Samples"*: \`1\`
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 9', async () => {
    let out = obtain_paramlist(wf.steps["9"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"Input List"*: \`outTables\` (output of **limma** {% icon tool %})
>    - *"How should a dataset be selected?"*: \`The first dataset\`
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 10', async () => {
    let out = obtain_paramlist(wf.steps["10"], tool_descs, flat)
    let expectation = `
>    - *"Cut columns"*: \`c2,c4,c7,c8\`
>    - {% icon param-file %} *"From"*: \`output\` (output of **Extract dataset** {% icon tool %})
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 11', async () => {
    let out = obtain_paramlist(wf.steps["11"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"Join"*: \`output\` (output of **Extract dataset** {% icon tool %})
>    - *"using column"*: \`c1\`
>    - {% icon param-file %} *"with"*: \`output\` (output of **Extract dataset** {% icon tool %})
>    - *"and column"*: \`c1\`
>    - *"Fill empty columns"*: \`No\`
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 12', async () => {
    let out = obtain_paramlist(wf.steps["12"], tool_descs, flat)
    let expectation = `
>    - *"Add expression"*: \`c8<0.05\`
>    - {% icon param-file %} *"as a new column to"*: \`out_file1\` (output of **Join two Datasets** {% icon tool %})
>    - *"Skip a header line"*: \`no\`
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 13', async () => {
    let out = obtain_paramlist(wf.steps["13"], tool_descs, flat)
    let expectation = `
>    - *"Cut columns"*: \`c1,c11,c12\`
>    - {% icon param-file %} *"From"*: \`out_file1\` (output of **Compute** {% icon tool %})
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 14', async () => {
    let out = obtain_paramlist(wf.steps["14"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"File to scan for unique values"*: \`out_file1\` (output of **Cut** {% icon tool %})
>    - *"Advanced Options"*: \`Show Advanced Options\`
>        - *"Column start"*: \`c1\`
>        - *"Column end"*: \`c1\`
`.trimEnd()
    expect(out).toBe(expectation)
  })

  test('check step 17', async () => {
    let out = obtain_paramlist(wf.steps["17"], tool_descs, flat)
    let expectation = `
>    - {% icon param-file %} *"Differentially expressed genes file"*: \`out_file1\` (output of **Cut** {% icon tool %})
>    - {% icon param-file %} *"Gene lengths file"*: \`out_file1\` (output of **Cut** {% icon tool %})
>    - *"Gene categories"*: \`Get categories\`
>        - *"Select Gene ID format"*: \`Entrez Gene ID\`
>        - *"Select one or more categories"*: \`GO: Cellular Component, GO: Biological Process, GO: Molecular Function, KEGG\`
>    - In *"Output Options"*:
>        - *"Output Top GO terms plot?"*: \`Yes\`
>        - *"Extract the DE genes for the categories (GO/KEGG terms)?"*: \`Yes\`
`.trimEnd()
    expect(out).toBe(expectation)
  })


})