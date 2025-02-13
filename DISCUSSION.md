# Summary

- I will admit that I spent a bit more than two hours on this assignment, but in my defense, I was having a lot of fun with it. I don't get to do a ton of react work outside of my personal projects these days so this was a nice change!

# Planned Enhancements

- Add trigram indexes on the most commonly searched fields of the advocates table to support more efficient read operations on `ilike` text searches as the table size increases. The tradeoff of slower inserts/updates is acceptable since inserts will be done by internal systems rather than customer facing ones.
- Add support for searching against specialties.
- Improve styling on mobile view.
- Unit testing using jest on frontend and backend functionality.
