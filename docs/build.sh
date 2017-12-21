#!/bin/bash

JSDOC="$(pwd)/../node_modules/jsdoc-to-markdown/bin/cli.js"
README="$(pwd)/../README.md"

cat header.md > ${README}

${JSDOC} ../lib/spark.js \
  ../lib/res/contents.js \
  ../lib/res/events.js \
  ../lib/res/licenses.js \
  ../lib/res/memberships.js \
  ../lib/res/messages.js \
  ../lib/res/organizations.js \
  ../lib/res/people.js \
  ../lib/res/roles.js \
  ../lib/res/rooms.js \
  ../lib/res/teams.js \
  ../lib/res/team-memberships.js \
  ../lib/res/webhooks.js \
  ../lib/validator.js >> ${README}

cat license.md >> ${README}
