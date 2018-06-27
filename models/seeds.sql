\c cuetestdb;

INSERT INTO users (suid, displayName, displayImage) 
VALUES (
  '123416101',
  'Matt Carpowich',
  'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/32169476_10215922716037991_3090206953469640704_n.jpg?_nc_cat=0&oh=40670caaf299735497d47929a818e7c5&oe=5B81B0BD'
);

UPDATE users 
SET token='i am a token' 
WHERE displayName='Matt Carpowich';