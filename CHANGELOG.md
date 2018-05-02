# 4.5.x
* Redirected all console logging through debug module. Messages now accesses through `DUBUG=node_sparky` environment variable.

# 4.4.x
* Updated changelog.
* Changed order of preference for env vars. Env vars now take preference over config properties.
* If webhook secret is not defined in env var or config, now a random 32 digit alpha numeric string is generated.

# 4.3.x

* Added experimental 'after' property that can be passed to messagesGet search object per issue #11.
* Fixed spelling error from issue #12
* Locked down package dependencies to minor version. Added moment.js as a dependency.
* Deprecated webhooksSearch(). Added functionality to webhooksGet(). Created alias for webhooksSearch() to webhooksGet() for backwards compatibility. Added test for webhooksGet using a filter.
* Removed placeholders for non-existing API endpoints. Added option to define maxPageItems for paginator
* Updated docs to include example of using sparky in express app. Added donation link.
* Updated jsdoc-to-markdown to avoid bug in dependent "marked" packaged

# 4.2.x

* Extended error object to include code and type properties to address #10
* Updated jsdoc-to-markdown to v3.0.3
* Fixed typo in messages example
* Added support for Spark Events API

# 4.1.x

* Code cleanup
* Code standardization
* Code examples updated
* Webhook logic refined
* New events added
* Messages/Created events now automatically adds message content as part of emitter
* Events now return message body instead of full message request as secondary parameter
* Updated Tests to determine OrgId and TeamId automatically

# 4.0.10

* Regenerated browser modules for fixes in 4.0.9

# 4.0.9

* Fixed bug for `contentCreate()` and `contentGet()`

# 4.0.8

* Fixed vulnerability in #7

# 4.0.7

* Adjusted `npm run build` to use grunt

* Using Babel to convert es6 code to es5 for `browser/node-sparky.js`

* Build now also generates a minified version of `browser/node-sparky.js` at `browser/node-sparky.min.js`

# 4.0.6

* Fixed bug for `messagesGet()`

* Updated Docs to reflect build process for `README.md` and `browser/node-sparky.js`

# 4.0.5

* Updated docs to reflect correct object date type properties as ISO 8601 String
  and not Date object.

* Tweaked webhook handler response logic to send 200/OK for all requests.

* Updated inline docs.

* Added unit test for `spark.webhookAuth()`

* The following functions have been renamed in docs and aliased in code (both work):

  * `spark.messageAdd()` → `spark.messageSend()`

# 4.0.4

* Updated docs/examples

* Tweaked Validator for constructor options

# 4.0.3

* The following functions have been added:

  * `spark.setToken()`

# 4.0.2

* The following functions have been added:

  * `validator.isFile()`
  * `validator.isDir()`
  * `validator.isToken()`

# 4.0.1

* The following functions have been added:

  * `spark.webhookListen()`

# 4.0.0

* Added browser'fied version of node-sparky.

* Removed built in rate limiter in favor of parsing the `retry-after` header
  field to determine when to attempt a retry of the request.

* Due to the rate limiter being removed and certain functions restructured, the
  options object only needs a `token` specified.

* Removed event emitters.

* Removed `debug`, `bottleneck`, and `uuid` package dependencies.

* The start of basic unit tests are now in place. _See **Tests** the project
  README.md for more details._

* The following functions have been added:

  * `spark.contentCreate()`
  * `spark.licensesGet()`, `spark.licenseGet(id)`
  * `spark.membershipUpdate()`
  * `spark.messageAdd()`
  * `spark.organizationsGet()`, `spark.organizationGet(id)`
  * `spark.peopleGet()`, `spark.personAdd()`, `spark.personUpdate()`
  * `spark.rolesGet()`, `spark.roleGet(id)`
  * `spark.roomUpdate()`
  * `spark.teamUpdate()`
  * `spark.teamMembershipUpdate()`


* The following methods have been removed and code should be migrated to the
  corresponding methods:

  * `spark.contentByUrl()` → `spark.contentGet()`
  * `spark.membershipsByRoom()` → `spark.membershipsGet()`
  * `spark.membershipByRoomByEmail()` → `spark.membershipsGet()`
  * `spark.membershipSetModerator()` → `spark.membershipUpdate()`
  * `spark.membershipClearModerator()` → `spark.membershipUpdate()`
  * `spark.messageSendPerson()` → `spark.messageAdd()`
  * `spark.messageSendRoom()` → `spark.messageAdd()`
  * `spark.messageStreamRoom()` → `spark.messageAdd()`
  * `spark.peopleSearch()` → `spark.peopleGet()`
  * `spark.peopleByEmail()` → `spark.peopleGet()`
  * `spark.roomsDirect()` → `spark.roomsGet()`
  * `spark.roomsGroup()` → `spark.roomsGet()`
  * `spark.roomsByTeamId()` → `spark.roomsGet()`
  * `spark.roomRename()` → `spark.roomUpdate()`
  * `spark.teamRename()` → `spark.teamUpdate()`
  * `spark.teamRoomAdd()` → `spark.roomAdd()`
  * `spark.teamMembershipSetModerator()` → `spark.teamMembershipUpdate()`
  * `spark.teamMembershipClearModerator()` → `spark.teamMembershipUpdate()`
  * `spark.upload()` → `spark.messageAdd()`


* The following methods have restructured arguments:

  * `spark.membershipsGet()` : Optional search object can now be passed.
  * `spark.roomsGet()` : Optional search object can now be passed.
  * `spark.roomAdd()` : Optional TeamId string can now be passed.
  * `spark.webhookAdd()` : Uses a Webhook object as the only argument.
  * `spark.webhookAuth()` : Adds secret argument to function (vs using one defined in Options).
