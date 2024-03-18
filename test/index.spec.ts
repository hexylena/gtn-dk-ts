import { get_input_tool_name, render_template, to_bool, WorkflowSteps, WorkflowStep } from '../src/lib';

describe('testing rendering templates', () => {
  test('simple template', () => {
    expect(
        render_template('{{ x }} = {{ y }}', {x: 1, y: 'a'})).toBe("1 = a")
  });

  test('missing variable', () => {
    expect(
        render_template('{{ x }} = {{ y }}', {x: 1})).toBe("1 = ")
  });

  test('working exclusions', () => {
    expect(
        render_template('Here in the {{ page.zenodo_link }}', {})).toBe('Here in the {{ page.zenodo_link }}')
  });
});

describe(to_bool, () => {
  test('converts correctly', () => {
    expect(to_bool("true")).toBe(true);
    expect(to_bool("false")).toBe(false);
    expect(to_bool("other")).toBe(false);
  })
})
const wfstep_cut =   {
    annotation: '',
    content_id: 'Cut1',
    errors: null,
    id: 16,
    input_connections: { input: [Object] },
    inputs: [],
    label: null,
    name: 'Cut',
    outputs: [ [Object] ],
    position: { left: 2810, top: 412 },
    post_job_actions: { HideDatasetActionout_file1: [Object] },
    tool_id: 'Cut1',
    tool_state: '{"columnList": "c1,c2", "delimiter": "T", "input": {"__class__": "ConnectedValue"}, "__page__": null, "__rerun_remap_job_id__": null}',
    tool_version: '1.0.2',
    type: 'tool',
    uuid: 'd1110fac-d46d-4bff-a407-47d09bd91626',
    when: null,
    workflow_outputs: []
}

const wfstep_goseq =  {
    annotation: '',
    content_id: 'toolshed.g2.bx.psu.edu/repos/iuc/goseq/goseq/1.50.0+galaxy0',
    errors: null,
    id: 17,
    input_connections: { dge_file: [Object], length_file: [Object] },
    inputs: [ [Object], [Object] ],
    label: null,
    name: 'goseq',
    outputs: [ [Object], [Object], [Object] ],
    position: { left: 3090, top: 294 },
    post_job_actions: {},
    tool_id: 'toolshed.g2.bx.psu.edu/repos/iuc/goseq/goseq/1.50.0+galaxy0',
    tool_shed_repository: {
      changeset_revision: '602de62d995b',
      name: 'goseq',
      owner: 'iuc',
      tool_shed: 'toolshed.g2.bx.psu.edu'
    },
    tool_state: '{"adv": {"p_adj_method": "BH", "use_genes_without_cat": false}, "categorySource": {"catSource": "getgo", "__current_case__": 0, "genome": "hg38", "gene_id": "knownGene", "fetchcats": ["GO:CC", "GO:BP", "GO:MF", "KEGG"]}, "dge_file": {"__class__": "RuntimeValue"}, "length_file": {"__class__": "RuntimeValue"}, "methods": {"wallenius": true, "hypergeometric": false, "repcnt": "0"}, "out": {"topgo_plot": true, "make_plots": false, "cat_genes": true, "rdata_out": false}, "__page__": null, "__rerun_remap_job_id__": null}',
    tool_version: '1.50.0+galaxy0',
    type: 'tool',
    uuid: 'dfe128ab-0b7f-49f0-bb33-eb68559f6ebe',
    when: null,
    workflow_outputs: []
  }

describe(get_input_tool_name, () => {
  test('gets step correctly.', () => {
    let steps: WorkflowSteps = [
      wfstep_cut,
      wfstep_goseq,
    ]
    expect(get_input_tool_name(17, steps)).toBe("goseq")
  })
})
