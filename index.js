let users;
async function getUsers() {
  const response = await fetch("https://cartola2026-deploy.onrender.com/users");

  users = await response.json();
}

const form = document.getElementById("user-form");
const table = document.querySelector("#users-table tbody");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const nameInput = document.getElementById("nome");
    const teamInput = document.getElementById("time");

    const name = nameInput.value;
    const team = teamInput.value;

    if (name === "" || team === "") {
      event.preventDefault();
      alert("Preenche tudo, porra!");
      return;
    }

    await fetch("https://cartola2026-deploy.onrender.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, team }),
    });

    alert("Criou o time, seu merda");
    location.reload();
  } catch {
    alert("Deu erro pra criar essa merda");
  }
});

async function updateScorePoints(id, newScore, oldScore) {
  if (newScore === null || newScore === "") {
    alert("Preencha a pontuação, seu merda!");
    return;
  }

  try {
    await fetch(`https://cartola2026-deploy.onrender.com/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: parseFloat(oldScore) + parseFloat(newScore),
      }),
    });

    alert("Pontuação atualizada com sucesso!");
    location.reload();
  } catch (error) {
    alert("Erro ao atualizar a pontuação");
  }
}

// Função que atualiza a tabela com os dados dos usuários do banco de dados
async function createTable() {
  // Faz uma requisição HTTP GET para o endpoint /users do servidor
  try {
    // Limpa a tabela atual
    table.innerHTML = "";
    await getUsers();

    // Ordena os usuários pelo score (em ordem decrescente), mas também pela posição em caso de empate
    users.sort((a, b) => {
      if (a.score === b.score) {
        return a.position - b.position;
      }
      return b.score - a.score;
    });

    // Adiciona os dados dos usuários na tabela
    let position = 1;
    users.forEach((user) => {
      const tr = document.createElement("tr");

      const tdPosicao = document.createElement("td");
      tdPosicao.textContent = position;
      tr.appendChild(tdPosicao);

      const tdNome = document.createElement("td");
      tdNome.textContent = user.name;
      tr.appendChild(tdNome);

      const tdTime = document.createElement("td");
      tdTime.textContent = user.team;
      tr.appendChild(tdTime);

      const tdPontuacao = document.createElement("td");
      tdPontuacao.textContent = user.score;
      tr.appendChild(tdPontuacao);

      const tdAcao = document.createElement("td");

      const form = document.createElement("form");
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "jogador";
      hiddenInput.value = user.nome;
      form.appendChild(hiddenInput);

      const label = document.createElement("label");
      label.for = "novaPontuacao" + user.nome;
      label.textContent = "Nova pontuação:";
      form.appendChild(label);

      const input = document.createElement("input");
      input.type = "number";
      input.id = "novaPontuacao";
      input.name = "novaPontuacao";
      input.step = "0.01";
      form.appendChild(input);

      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "Atualizar";
      form.appendChild(submitButton);
      form.setAttribute("id", "update-score");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateScorePoints(user._id, input.value, user.score);
      });

      tdAcao.appendChild(form);
      tr.appendChild(tdAcao);

      table.appendChild(tr);
      position++;
    });
  } catch {}
}

createTable();
