#!/bin/bash

JSDOC="$(pwd)/../node_modules/jsdoc-to-markdown/bin/cli.js"
README="$(pwd)/../README.md"

cat header.md > ${README}

${JSDOC} ../lib/spark.js ../lib/validator.js >> ${README}

cat license.md >> ${README}
