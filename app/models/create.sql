# RUN THE FOLLOWING COMMANDS 
# ======================================== #
# 1) cd db/                                #
# 2) dropdb cuetestdb                      #
# 3) psql -U <username> -a -f create.sql   #
# ======================================== #
DROP DATABASE IF EXISTS cuetestdb;

CREATE DATABASE cuetestdb;

\c cuetestdb;

CREATE TABLE events (
  evid SERIAL PRIMARY KEY,
  hostid int not null,
  eventname varchar(100) not null,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cues (
  cueid SERIAL PRIMARY KEY,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  uid SERIAL PRIMARY KEY,
  displayName varchar(100) not null UNIQUE,
  isActive BOOLEAN DEFAULT FALSE,
  u_evid INTEGER DEFAULT -1,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events_cues (
  ec_evid INTEGER REFERENCES events(evid),
  ec_cueid INTEGER REFERENCES cues(cueid),
  CONSTRAINT events_cues_pkey PRIMARY KEY(ec_evid, ec_cueid)
);

CREATE TABLE events_users (
  eu_evid INTEGER REFERENCES events(evid),
  eu_uid INTEGER REFERENCES users(uid),
  CONSTRAINT events_users_pkey PRIMARY KEY(eu_evid, eu_uid)
);
