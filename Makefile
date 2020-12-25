install:
	npm install

lint:
	npx stylelint ./public/css/*.css
	npx htmlhint ./public/*.html

deploy:
	npx surge ./src/
