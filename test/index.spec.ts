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
