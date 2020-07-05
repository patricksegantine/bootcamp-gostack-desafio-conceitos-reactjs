import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("/repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const resp = await api.post("/repositories", {
      title: `Novo Repositório ${Date.now()}`,
      url: "http://github.com/",
      techs: ["Node.js", "Laravel", "Arquitetura", "DevOps"],
    });

    const repo = resp.data;

    setRepositories([...repositories, repo]);
  }

  async function handleRemoveRepository(id) {
    const repoIndex = repositories.findIndex((repo) => repo.id === id);

    if (repoIndex < 0) {
      console.log("Repository not found!");
      return;
    }

    const resp = await api.delete(`/repositories/${id}`);

    if (resp.status === 204) {
      setRepositories(repositories.filter((r) => r.id !== id));
    }
  }

  return (
    <div>
      <h1>Repositórios</h1>

      <ul data-testid="repository-list">
        {repositories.map((repo) => (
          <li key={repo.id}>
            {repo.title}

            <button onClick={() => handleRemoveRepository(repo.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
