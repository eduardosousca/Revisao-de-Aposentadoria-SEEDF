document.addEventListener('DOMContentLoaded', () => {
  const criterioSelect = document.getElementById('criterio');
  const campoCarreira = document.getElementById('campoCarreira');

  criterioSelect.addEventListener('change', () => {
    campoCarreira.style.display = criterioSelect.value === 'pontos' ? 'block' : 'none';
  });

  criarCamposGratificacoes();
});

function criarCamposGratificacoes() {
  const gratificacoes = ['GAPED', 'GAA', 'GAEE', 'GAZR', 'GADEED', 'GADERL'];
  const container = document.getElementById('gratifSection');

  gratificacoes.forEach(grat => {
    const bloco = document.createElement('div');
    bloco.className = 'gratif-container';
    bloco.innerHTML = `
      <label>${grat}:</label>
      <select onchange="toggleGratificacaoCampos(this, '${grat}')">
        <option value="sim">Faz jus</option>
        <option value="nao">Não faz jus</option>
      </select>
      <div id="${grat}-dados">
        <label>Período considerado:</label>
        <div class="flex-row">
          <div><input type="text" placeholder="Início" class="data" id="${grat}-considerado-inicio"></div>
          <div><input type="text" placeholder="Fim" class="data" id="${grat}-considerado-fim"></div>
        </div>
        <div id="${grat}-exercidos">
          <label>Período exercido:</label>
          <div class="flex-row">
            <div><input type="text" placeholder="Início" class="data"></div>
            <div><input type="text" placeholder="Fim" class="data"></div>
          </div>
        </div>
        <button type="button" class="btn-add" onclick="adicionarPeriodoExercido('${grat}')">Adicionar Período</button>
        <div id="${grat}-resultados" class="message"></div>
      </div>
    `;
    container.appendChild(bloco);
  });

  aplicarFormatacaoDatas();
}

function toggleGratificacaoCampos(select, grat) {
  const dados = document.getElementById(`${grat}-dados`);
  dados.style.display = select.value === 'sim' ? 'block' : 'none';
}

function adicionarPeriodoExercido(grat) {
  const container = document.getElementById(`${grat}-exercidos`);
  const grupo = document.createElement('div');
  grupo.className = 'flex-row';
  grupo.innerHTML = `
    <div><input type="text" placeholder="Início" class="data"></div>
    <div><input type="text" placeholder="Fim" class="data"></div>
  `;
  container.appendChild(grupo);
  aplicarFormatacaoDatas();
}

function aplicarFormatacaoDatas() {
  const inputs = document.querySelectorAll('input.data');
  inputs.forEach(input => {
    input.addEventListener('input', e => {
      let v = input.value.replace(/\D/g, '').slice(0, 8);
      if (v.length >= 5) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
      else if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
      input.value = v;
    });
  });
}

function calcularRevisao() {
  const output = document.getElementById('output');
  output.innerHTML = '';

  calcularGratificacoes(output);
  verificarPrescricao(output);
}

function calcularGratificacoes(output) {
  const gratificacoes = ['GAPED', 'GAA', 'GAEE', 'GAZR', 'GADEED', 'GADERL'];
  gratificacoes.forEach(grat => {
    const fazJus = document.querySelector(`select[onchange*="${grat}"]`).value;
    if (fazJus !== 'sim') return;

    const consIni = document.getElementById(`${grat}-considerado-inicio`).value;
    const consFim = document.getElementById(`${grat}-considerado-fim`).value;
    const consDias = calcularDias(consIni, consFim);

    let diasExercidos = 0;
    const exercidos = document.querySelectorAll(`#${grat}-exercidos .flex-row`);
    const mensagens = [];

    exercidos.forEach(div => {
      const inputs = div.querySelectorAll('input');
      if (inputs.length < 2) return;
      const ini = inputs[0].value;
      const fim = inputs[1].value;
      const dias = calcularDias(ini, fim);
      diasExercidos += dias;

      const faltaIni = compararData(ini, consIni);
      const faltaFim = compararData(consFim, fim);

      if (faltaIni < 0) {
        const falta = calcularDias(ini, consIni, true) - 1;
        mensagens.push(`Período entre ${ini} a ${dataAnterior(consIni)} não considerado. (${falta} dia(s))`);
      } else if (faltaFim < 0) {
        const falta = calcularDias(consFim, fim, true) - 1;
        mensagens.push(`Período entre ${dataPosterior(consFim)} a ${fim} não considerado. (${falta} dia(s))`);
      } else {
        mensagens.push('Período completo considerado.');
      }
    });

    const fator = grat === 'GAPED' ? 1.2 : 0.6;
    const percentCons = Math.min(30, (consDias / 365.25) * fator).toFixed(2);
    const percentExec = Math.min(30, (diasExercidos / 365.25) * fator).toFixed(2);

    document.getElementById(`${grat}-resultados`).innerHTML = `
      <div><strong>Percentual considerado:</strong> ${percentCons}%</div>
      <div><strong>Percentual exercido:</strong> ${percentExec}%</div>
      <div>${mensagens.map(m => `<div>• ${m}</div>`).join('')}</div>
    `;
  });
}

function calcularDias(inicio, fim, abs = false) {
  const dt1 = parseData(inicio);
  const dt2 = parseData(fim);
  if (!dt1 || !dt2) return 0;
  const diff = (dt2 - dt1) / (1000 * 60 * 60 * 24);
  return abs ? Math.abs(diff) : Math.max(0, diff + 1);
}

function parseData(data) {
  if (!data) return null;
  const [d, m, a] = data.split('/');
  return new Date(`${a}-${m}-${d}`);
}

function compararData(d1, d2) {
  const dt1 = parseData(d1);
  const dt2 = parseData(d2);
  if (!dt1 || !dt2) return 0;
  return dt1 - dt2;
}

function dataAnterior(data) {
  const dt = parseData(data);
  dt.setDate(dt.getDate() - 1);
  return formatarData(dt);
}

function dataPosterior(data) {
  const dt = parseData(data);
  dt.setDate(dt.getDate() + 1);
  return formatarData(dt);
}

function formatarData(dt) {
  const d = String(dt.getDate()).padStart(2, '0');
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const a = dt.getFullYear();
  return `${d}/${m}/${a}`;
}

function verificarPrescricao(output) {
  const aposentadoria = parseData(document.getElementById('aposentadoria').value);
  const hoje = new Date();
  const diffAnos = (hoje - aposentadoria) / (1000 * 60 * 60 * 24 * 365.25);
  if (diffAnos > 5) {
    output.innerHTML += `<div class="message">Atenção: Já se passaram mais de 5 anos da aposentadoria. Licença-prêmio e abono podem estar prescritos.</div>`;
  }

  const dataLPA = parseData(document.getElementById('dataInicioLPA').value);
  if (dataLPA) {
    const diffLPA = (hoje - dataLPA) / (1000 * 60 * 60 * 24 * 365.25);
    if (diffLPA > 5) {
      output.innerHTML += `<div class="message">Atenção: Já se passaram mais de 5 anos do recebimento da Licença-Prêmio. Pode estar prescrita.</div>`;
    }
  }
}
