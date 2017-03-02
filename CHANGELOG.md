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
