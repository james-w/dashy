import argparse
from flask import (
    Flask,
    make_response,
    render_template,
    request,
    )
import json
import logging
import os
import requests
from requests.cookies import cookiejar_from_dict
import sys
import urlparse


app = Flask('dashy')

log = logging.getLogger(__name__)


def proxy(session, url):
    log.info("Requesting {}".format(url))
    graphite_resp = session.get(url)
    log.info("Got {}".format(graphite_resp))
    print graphite_resp.content
    response = make_response(graphite_resp.content, graphite_resp.status_code)
    return response


@app.route('/render')
def render():
    url = app.config['GRAPHITE_HOST'] + '/render?' + request.query_string
    return proxy(app.config['GRAPHITE_SESSION'], url)


@app.route('/metrics')
def metrics():
    url = app.config['GRAPHITE_HOST'] + '/metrics/index.json'
    return proxy(app.config['GRAPHITE_SESSION'], url)



@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return render_template('index.html')


def get_firefox_sessionstore_path():
    firefox_dir = os.path.expanduser("~/.mozilla/firefox")
    dirs = os.listdir(firefox_dir)
    for name in dirs:
        if name.endswith('.default'):
            return os.path.join(firefox_dir, name, 'sessionstore.js')


def get_cookies(host):
    host = urlparse.urlparse(host)[1]
    sessionstore_path = get_firefox_sessionstore_path()
    cookies = {}
    with open(sessionstore_path) as f:
        store_content = json.load(f)
    for window in store_content['windows']:
        for cookie in window['cookies']:
            if cookie['host'] == host:
                cookies[cookie['name']] = cookie['value']
    print cookies
    return cookies


def run():
    logging.basicConfig(stream=sys.stderr, level=logging.INFO)
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', action='store_true')
    parser.add_argument('--cookie')
    parser.add_argument('graphite_host', action='store')
    options = parser.parse_args()
    if options.debug:
        app.debug = True
    app.config['GRAPHITE_HOST'] = options.graphite_host
    session = requests.Session()
    if options.cookie:
        cookies = {'pysid': options.cookie}
    else:
        cookies = get_cookies(options.graphite_host)
    session.cookies = cookiejar_from_dict(cookies)
    app.config['GRAPHITE_SESSION'] = session
    app.run()


if __name__ == '__main__':
    run()
