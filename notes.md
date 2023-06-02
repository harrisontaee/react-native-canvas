## Architecture

1. Create new dynamoDB table called Diffs
	- userId: ID @primaryKey(sortKeyFields: ["sheetId", "layerId"])
	- sheetId: ID
	- layerId: ID
	- created: AWSJSON
	- updated: AWSJSON
	- deleted: AWSJSON
	- createdAt: AWSDateTime
	- updatedAt: AWSDateTime

2. Create a lambda function that listens to the Diff table
	- When a new diff is created, merge them into the json file located in S3

3. On the client side
	- When a sheet is loaded for the first time, download the json file from S3
	- Replicate the store in local storage
	- When a diff is created by the canvas, store in pending transactions
	- When another diff is created, merge the diffs into pending transactions
	- When the user receives a diff event from NOT their client, apply the diff to the store


If something was only deleted, it should stay in the diff