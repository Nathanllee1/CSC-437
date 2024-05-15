curl --request POST --header "Content-Type: application/json" --data '{
  "phoneNumber": "+15103937880",
  "dates": [ "2024-07-13T07:00:00.000Z", "2024-08-08T07:00:00.000Z" ],
  "partySize": 1,
  "trailheadId": "44585902",
  "id": "78125064-f919-402a-ab82-34a06c25650d"
}' \
http://localhost:3000/api/trackers