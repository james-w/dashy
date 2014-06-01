from setuptools import setup

setup(
    name = "dashy",
    version = "0.0.1",
    author = "James Westby",
    author_email = "james.westby@canonical.com",
    description = "A crappy graphite dashboard",
    packages=['dashy'],
    long_description="It's very crappy.",
    classifiers=[
        "Development Status :: 3 - Alpha",
    ],
    install_requires=[
        'Flask',
        'requests',
    ],
)
