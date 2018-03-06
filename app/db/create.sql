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
  cueid SERIAL,
  eventname varchar(100) not null,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
