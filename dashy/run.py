import argparse
from flask import (
    Flask,
    make_response,
    redirect,
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


def proxy(session, url, method='GET', data=None):
    log.info("Requesting ({}) {}".format(method, url))
    graphite_resp = session.request(method, url, data)
    log.info("Got {}".format(graphite_resp))
    print graphite_resp.content
    headers = {}
    content_type = graphite_resp.headers.get('Content-Type')
    if content_type:
        headers['Content-Type'] = content_type
    response = make_response(graphite_resp.content, graphite_resp.status_code,
                             headers)
    return response


@app.route('/render')
def render():
    url = app.config['GRAPHITE_HOST'] + '/render?' + request.query_string
    return proxy(app.config['GRAPHITE_SESSION'], url)


@app.route('/metrics')
def metrics():
    url = app.config['GRAPHITE_HOST'] + '/metrics/index.json'
    resp = proxy(app.config['GRAPHITE_SESSION'], url)
    print resp.headers
    print resp.status_code
    return resp


@app.route('/login')
def login():
    cookies = get_cookies(app.config['GRAPHITE_HOST'])
    session = requests.Session()
    session.cookies = cookiejar_from_dict(cookies)
    app.config['GRAPHITE_SESSION'] = session
    return redirect(request.args.get('return_to', '/'))


@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return render_template('index.html',
        graphite_host=app.config['GRAPHITE_HOST'])


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
        for cookie in window.get('cookies', []):
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
