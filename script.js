const form = document.getElementById('form-funcionario');
const lista = document.getElementById('lista-funcionarios');
const indice = document.getElementById('indice-edicao');
const cargoSelect = document.getElementById('cargo');

const filtro = document.createElement('div');
filtro.innerHTML = `
  <label for="filtro-cargo"><strong>Filtrar por cargo:</strong></label>
  <select id="filtro-cargo">
    <option value="">Todos</option>
    <option value="Desenvolvedor">Desenvolvedor</option>
    <option value="Designer">Designer</option>
    <option value="Gerente">Gerente</option>
    <option value="Analista">Analista</option>
  </select>
`;
document.body.insertBefore(filtro, lista.parentElement);

document.getElementById('filtro-cargo').addEventListener('change', mostrar);

form.addEventListener('submit', function (e){
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const cargo = document.getElementById('cargo').value;
  const genero = document.getElementById('genero').value;
  const salario = parseFloat(document.getElementById('salario').value);
  const entrada = document.getElementById('dataEntrada').value;

  const dados = pegar();

  if (indice.value){
    const i = parseInt(indice.value);
    dados[i] = { ...dados[i], nome, cargo, genero, salario, entrada };
    indice.value = '';
  } else {
    const codigo = `func-${Date.now()}`;
    dados.push({ nome, cargo, genero, salario, entrada, codigo });
  }

  salvar(dados);
  form.reset();
  mostrar();
});

function pegar(){
  return JSON.parse(localStorage.getItem('funcionarios')) || [];
}

function salvar(dados){
  localStorage.setItem('funcionarios', JSON.stringify(dados));
}

function remover(i){
  const dados = pegar();
  dados.splice(i, 1);
  salvar(dados);
  mostrar();
}

function editar(i){
  const dados = pegar();
  const item = dados[i];

  document.getElementById('nome').value = item.nome;
  document.getElementById('cargo').value = item.cargo;
  document.getElementById('genero').value = item.genero;
  document.getElementById('salario').value = item.salario;
  document.getElementById('dataEntrada').value = item.entrada;
  indice.value = i;
}

function mostrar(){
  const dados = pegar();
  const filtro = document.getElementById('filtro-cargo').value;

  lista.innerHTML = '';
  const porCargo = {};

  for (const [i, f] of dados.entries()){
    if (filtro && f.cargo !== filtro) continue;
    if (!porCargo[f.cargo]) porCargo[f.cargo] = [];
    porCargo[f.cargo].push({ f, i });
  }

  for (const c in porCargo){
    const cab = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 7;
    th.textContent = `Cargo: ${c}`;
    cab.appendChild(th);
    lista.appendChild(cab);

    for (const { f, i } of porCargo[c]){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${f.nome}</td>
        <td>${f.cargo}</td>
        <td>${f.genero}</td>
        <td>R$ ${f.salario.toFixed(2)}</td>
        <td>${f.entrada}</td>
        <td>${f.codigo}</td>
        <td>
          <button onclick="editar(${i})">editar</button>
          <button onclick="remover(${i})">remover</button>
        </td>
      `;
      lista.appendChild(tr);
    }
  }
}

mostrar();