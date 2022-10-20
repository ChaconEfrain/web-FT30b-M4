#1
SELECT * FROM movies WHERE year=1998;

#2
SELECT COUNT(*) AS total FROM movies WHERE year=1982;

#3
SELECT * FROM actors WHERE last_name LIKE '%stack%';

#4
SELECT first_name, last_name, COUNT(*) AS total
FROM actors
GROUP BY LOWER(first_name), LOWER(last_name)
ORDER BY total DESC
LIMIT 10;

#5
SELECT first_name, last_name, COUNT(*) AS total
FROM actors
JOIN roles
ON actors.id = roles.actor_id
GROUP BY actors.id
ORDER BY total DESC
LIMIT 100;

#6
SELECT genre, COUNT(*) AS total
FROM movies_genres
GROUP BY genre
ORDER BY total ASC;

#7
SELECT first_name, last_name
FROM actors
JOIN roles
ON actors.id = roles.actor_id
JOIN movies
ON roles.movie_id = movies.id
WHERE movies.name = 'Braveheart' AND movies.year = 1995
ORDER BY actors.last_name ASC;

#8
SELECT directors.first_name, directors.last_name, movies.name AS movie, movies_genres.genre, movies.year 
FROM directors
JOIN movies_directors
ON directors.id = movies_directors.director_id
JOIN movies
ON movies.id = movies_directors.movie_id
JOIN movies_genres
ON movies.id = movies_genres.movie_id
WHERE movies_genres.genre = 'Film-Noir'
AND movies.year % 4 = 0
ORDER BY movies.name;

#9
SELECT actors.first_name, actors.last_name, movies.name AS movie 
FROM actors
JOIN roles
ON actors.id = roles.actor_id
JOIN movies
ON movies.id = roles.movie_id
JOIN movies_genres
ON movies_genres.movie_id = movies.id
WHERE movies_genres.genre = 'Drama'
AND movies.id IN (
  SELECT roles.movie_id
  FROM roles 
  JOIN actors 
  ON roles.actor_id = actors.id
  WHERE actors.first_name = 'Kevin'
  AND actors.last_name = 'Bacon'
)
AND (actors.first_name || ' ' || actors.last_name != 'Kevin Bacon');

#10
SELECT * 
FROM actors
WHERE id IN (
  SELECT roles.actor_id
  FROM roles
  JOIN movies
  ON roles.movie_id = movies.id
  WHERE movies.year < 1900
)
AND id IN (
  SELECT roles.actor_id
  FROM roles
  JOIN movies
  ON roles.movie_id = movies.id
  WHERE movies.year > 2000
);

#11
SELECT actors.first_name, actors.last_name, COUNT(DISTINCT(role)) as total 
FROM roles
JOIN actors
ON actors.id = roles.actor_id
JOIN movies
ON movies.id = roles.movie_id
WHERE movies.year > 1990
GROUP BY actors.id, movies.id
HAVING total > 4;

#12
SELECT year, count(*) AS total
FROM movies
WHERE id NOT IN (
  SELECT movies.id
  FROM roles 
  JOIN actors 
  ON roles.actor_id = actors.id
  WHERE actors.gender = 'M'
)
GROUP BY year;