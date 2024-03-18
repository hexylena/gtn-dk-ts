import { render_template } from '../src/lib';

describe('testing index file', () => {
  test('empty string should result in zero', () => {
    expect(
        render_template('{{ x }} = {{ y }}', {x: 1, y: 'a'})).toBe("1 = a")
  });
});
