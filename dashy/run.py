import argparse
from flask import (
    Flask,
    make_response,
    render_template,
    request,
    )
import logging
import requests
import sys


app = Flask('dashy')

log = logging.getLogger(__name__)


@app.route('/')
def index():
    return render_template('index.html')


def proxy(url):
    log.info("Requesting {}".format(url))
    graphite_resp = requests.get(url)
    log.info("Got {}".format(graphite_resp))
    response = make_response(graphite_resp.content, graphite_resp.status_code)
    return response


@app.route('/render')
def render():
    url = app.config['GRAPHITE_HOST'] + '/render?' + request.query_string
    return proxy(url)


@app.route('/metrics')
def metrics():
    url = app.config['GRAPHITE_HOST'] + '/metrics/index.json'
    return proxy(url)



def run():
    logging.basicConfig(stream=sys.stderr, level=logging.INFO)
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', action='store_true')
    parser.add_argument('graphite_host', action='store')
    options = parser.parse_args()
    if options.debug:
        app.debug = True
    app.config['GRAPHITE_HOST'] = options.graphite_host
    app.run()


if __name__ == '__main__':
    run()
