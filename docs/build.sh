#!/bin/bash

JSDOC='../node_modules/jsdoc-to-markdown/bin/cli.js'
README='../README.md'

cat header.md > ${README}

${JSDOC} ../lib/spark.js >> ${README}

cat license.md >> ${README}
