install:
	npm install

lint:
	npx stylelint ./src/styles/*.scss
	npx htmlhint ./src/views/**/*.njk

deploy:
	npx surge ./src/
