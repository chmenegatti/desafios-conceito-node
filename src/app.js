const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repos => repos.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist!' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repos => repos.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist!' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send('');
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repos => repos.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'You can not like an inexistent repository! '})
  }
  
  const { title, url, techs, likes } = repositories[repoIndex];

  let newLike = likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: newLike,
  };

  repositories.push(repository)

  repositories.splice(repoIndex, 1);

  return response.json(repository);

});

module.exports = app;
