all:
	find *.js | entr -r node main.js
