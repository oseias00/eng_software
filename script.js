function obterFuncionarios() {
    return JSON.parse(localStorage.getItem("funcionarios")) || [];
  }

  function salvarFuncionarios(funcionarios) {
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
  }

  function gerarCodigo() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  const form = document.getElementById("form-funcionario");
  const listaTabela = document.getElementById("lista-funcionarios");
  const indiceEdicao = document.getElementById("indice-edicao");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const funcionarios = obterFuncionarios();
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const genero = document.getElementById("genero").value;
    const salario = parseFloat(document.getElementById("salario").value);
    const dataEntrada = document.getElementById("dataEntrada").value;

    const funcionario = {
      codigo: gerarCodigo(),
      nome,
      cargo,
      genero,
      salario,
      dataEntrada,
    };

    if (indiceEdicao.value !== "") {
      funcionarios[indiceEdicao.value] = {
        ...funcionario,
        codigo: funcionarios[indiceEdicao.value].codigo,
      };
      indiceEdicao.value = "";
    } else {
      funcionarios.push(funcionario);
    }

    salvarFuncionarios(funcionarios);
    form.reset();
    atualizarTabela();
  });

  function atualizarTabela() {
    const funcionarios = obterFuncionarios();
    listaTabela.innerHTML = "";

    funcionarios.forEach((f, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${f.nome}</td>
        <td>${f.cargo}</td>
        <td>${f.genero}</td>
        <td>R$ ${f.salario.toFixed(2)}</td>
        <td>${new Date(f.dataEntrada).toLocaleDateString("pt-BR")}</td>
        <td>${f.codigo}</td>
        <td>
          <button onclick="editarFuncionario(${index})">Editar</button>
          <button onclick="excluirFuncionario(${index})">Excluir</button>
        </td>
      `;

      listaTabela.appendChild(tr);
    });
  }

  function editarFuncionario(index) {
    const funcionarios = obterFuncionarios();
    const f = funcionarios[index];

    document.getElementById("nome").value = f.nome;
    document.getElementById("cargo").value = f.cargo;
    document.getElementById("genero").value = f.genero;
    document.getElementById("salario").value = f.salario;
    document.getElementById("dataEntrada").value = f.dataEntrada;
    indiceEdicao.value = index;
  }

  function excluirFuncionario(index) {
    const funcionarios = obterFuncionarios();
    if (confirm("Deseja realmente excluir este funcionário?")) {
      funcionarios.splice(index, 1);
      salvarFuncionarios(funcionarios);
      atualizarTabela();
    }
  }

  window.onload = atualizarTabela;