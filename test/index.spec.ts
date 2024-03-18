import { render_template } from '../src/lib';


import * as mocha from 'mocha';


let x = render_template('{{ x }} = {{ y }}', {x: 1, y: 'a'});
let y = "1 = a";
console.log(x == y);
