VIRTUALENV=.env
GRAPHITE_HOST?=http://localhost:8080/
NODE_MODULES=./node_modules/
GRUNT=$(NODE_MODULES)/.bin/grunt

ULYSSES=static/lib/ulysses

build: deps
	$(GRUNT) build

py-deps:
	$(VIRTUALENV)/bin/python setup.py develop

html-deps:
	[ -d $(ULYSSES) ] || bzr branch lp:ulysses $(ULYSSES)
	npm install

deps: py-deps html-deps


run: build
	$(VIRTUALENV)/bin/python dashy/run.py $(GRAPHITE_HOST) $(ARGS)

$(VIRTUALENV):
	virtualenv $(VIRTUALENV)

clean:
	$(GRUNT) clean

watch:
	$(GRUNT) watch

full-clean: clean
	rm -r $(NODE_MODULES)
	rm -r static/lib/*
	rm -r dashy.egg-info

.PHONY: deps clean watch build py-deps html-deps
