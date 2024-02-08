all:
	find *.js | entr -r node main.js

diff:
	diff 17352c36a0011c6a.md ptdk-js-17352c36a0011c6a.html | wc -l
	diff 8ca9a936aa3d06af.md ptdk-js-8ca9a936aa3d06af.html | wc -l
	diff e1119904debfd22c.md ptdk-js-e1119904debfd22c.html | wc -l
	
