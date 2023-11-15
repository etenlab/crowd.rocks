# Database Schema Concepts

## Principles

### Overview

The current driving principle of the database schema is to normalize language data in system of record tables to reduce duplication of user effort when translating and increase opportunities to capitalize on relationships between languages and dialects in app features. Derived data tables/views should be created for user facing operations when necessary for performance.

### Crowdsourcing

There are many theories of what crowdsourcing means. The principles crowd.rocks is built on are that crowdsourcing means giving users the ability to create and edit publicly accessible content in such a way that edits are always visible and votes determine the default version of content shown to users.

To manifest these principles, any table that contains user generated content must have a voting table and a discussion table that references it. The content table must also be architected so that no data is ever deleted, not even via tombstoning. The app feature that is built with the content table should give users the ability to modify, via edits and votes, any data that is supposed to be 'crowdsourced'.


### Translation

Translations are connections between the language data of two different language tuples. A language tuple is a unique tuple that includes a language, but may optionally include a dialect, geographical reference, and script (orthography) reference. This implies a translation may be between two different languages, but also two different dialects within the same language.

All language data must reference a language tuple for the data to be relevant because users need to have the ability to express complex information about their languages. An example may be that a word in a language may mean one thing, but in a dialect of that language it may mean something different than in the wider population. Users need to be able to give information to the site such that these complex relationships are visible to all users and can be voted on and discussed. Not all of these concepts are currently manifested on the site, but the current schema is on the path to get there.

Translation tables hold references to language data tables and the means to vote and discuss translation options.
