prod.CS.events
prod.CS.events.rankings
prod.CS.events.rewards
prod.CS.events.outcomes
POST /event                                        - creates a leaderboard
POST /event/eventId/:eventId/archive               - archives an event. if it's active, stops it.
POST /event/outcomes                               - saves an outcome to the DB
PUT /event/eventId/:eventId                        - edits an event
GET /active-events                                 - gets info about all active events
GET /event/eventId/:eventId                        - gets a specific event by eventId
GET /event/event-name/:eventName                   - gets a specific event by event name
GET /event/eventId/:eventId/ranking?limit=100      - top X ranking for a specific event
GET /player/events/rankings                        - return the player's position in all active events
GET /player/events/:eventId/ranking                - return the player's position in an specific event

EventsLambda
  - Saves an outcome to DB.
  	- Checks if this new outcome triggers a milestone reward
  		- if so, add a new reward entry to SQS
  - CRUD operations for Events
  - Runs upon a schedule event end.
  	- Checks event rankings and gives out rewards.
	  - Then performs lottery rewards if necessary.
	  - Ends the event
	  - Archives the data into s3
EventsRankingLambda
  - Runs every 15-30 minutes.
  - Checks for active events and calculate rankings.
EventsPayoutLambda
  - Runs upon a schedule event end.
	  - Checks event rankings and gives out rewards.
	  - Then performs lottery rewards if necessary.
	  - Ends the event
  - Runs upon a user insertting a new outcome. Checks for achieved milestones, then gives out reward.