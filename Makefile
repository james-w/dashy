VIRTUALENV=.env
GRAPHITE_HOST?=http://localhost:8080/

deps: $(VIRTUALENV)
	[ -d static/ulysses ] || bzr branch lp:ulysses static/ulysses
	$(VIRTUALENV)/bin/python setup.py develop

run:
	$(VIRTUALENV)/bin/python dashy/run.py $(GRAPHITE_HOST) $(ARGS)

$(VIRTUALENV):
	virtualenv $(VIRTUALENV)

.PHONY: deps
