// script.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('Calculadora pronta para uso!');
  // Você pode colocar aqui inicializações adicionais, se necessário.
});

// Função principal que agrega todos os cálculos e exibe os resultados
function calcularTudo() {
  // Dados do Servidor
  const genero = document.getElementById("genero").value;
  const dataNascimento = new Date(document.getElementById("dataNascimento").value);
  const dataIngresso = new Date(document.getElementById("dataIngresso").value);
  const dataAposentadoria = new Date(document.getElementById("dataAposentadoria").value);
  const criterio = document.getElementById("modalidade").value; // critério: especial, regraGeral ou regraPontos

  // Tempos Declarados
  const diasContribuicao = parseInt(document.getElementById("diasContribuicao")?.value || "0");
  const anosMagisterio = parseFloat(document.getElementById("anosMagisterio")?.value || "0");
  const anosServicoPublico = parseFloat(document.getElementById("anosServicoPublico")?.value || "0");
  const anosCargo = parseFloat(document.getElementById("anosCargo")?.value || "0");
  const anosCarreira = parseFloat(document.getElementById("anosCarreira")?.value || "0");

  let resultadoRequisitos = "";
  let ultimoRequisito = "";

  // Cálculo da idade na data de aposentadoria
  let idade = dataAposentadoria.getFullYear() - dataNascimento.getFullYear();
  // Ajusta caso o aniversário ainda não tenha ocorrido neste ano
  let aniversarioEsteAno = new Date(dataAposentadoria.getFullYear(), dataNascimento.getMonth(), dataNascimento.getDate());
  if (dataAposentadoria < aniversarioEsteAno) {
    idade--;
  }

  // Verificação dos requisitos conforme o critério selecionado
  if (criterio === "especial") {
    if (genero === "feminino") {
      if (diasContribuicao >= 9125 && idade >= 50 && anosServicoPublico >= 20 && anosMagisterio >= 10 && anosCargo >= 5) {
        ultimoRequisito = "Todos os requisitos da Aposentadoria Especial foram atendidos.";
      } else {
        ultimoRequisito = "Requisitos da Aposentadoria Especial não foram atendidos.";
      }
    } else { // masculino
      if (diasContribuicao >= 10950 && idade >= 55 && anosServicoPublico >= 20 && anosMagisterio >= 10 && anosCargo >= 5) {
        ultimoRequisito = "Todos os requisitos da Aposentadoria Especial foram atendidos.";
      } else {
        ultimoRequisito = "Requisitos da Aposentadoria Especial não foram atendidos.";
      }
    }
  } else if (criterio === "regraGeral") {
    // Verifica ano de ingresso para diferenciar regras
    const anoIngresso = dataIngresso.getFullYear();
    if (anoIngresso <= 2003) {
      if (genero === "feminino") {
        if (diasContribuicao >= 10950 && idade >= 55 && anosServicoPublico >= 20 && anosMagisterio >= 10 && anosCargo >= 5) {
          ultimoRequisito = "Todos os requisitos da Regra Geral (ingresso até 2003) foram atendidos.";
        } else {
          ultimoRequisito = "Requisitos da Regra Geral (ingresso até 2003) não foram atendidos.";
        }
      } else {
        if (diasContribuicao >= 12715 && idade >= 60 && anosServicoPublico >= 20 && anosMagisterio >= 10 && anosCargo >= 5) {
          ultimoRequisito = "Todos os requisitos da Regra Geral (ingresso até 2003) foram atendidos.";
        } else {
          ultimoRequisito = "Requisitos da Regra Geral (ingresso até 2003) não foram atendidos.";
        }
      }
    } else {
      // Ingresso após 2003: dispensa os 20 anos de serviço público
      if (genero === "feminino") {
        if (diasContribuicao >= 10950 && idade >= 55 && anosMagisterio >= 10 && anosCargo >= 5) {
          ultimoRequisito = "Todos os requisitos da Regra Geral (ingresso após 2003) foram atendidos.";
        } else {
          ultimoRequisito = "Requisitos da Regra Geral (ingresso após 2003) não foram atendidos.";
        }
      } else {
        if (diasContribuicao >= 12715 && idade >= 60 && anosMagisterio >= 10 && anosCargo >= 5) {
          ultimoRequisito = "Todos os requisitos da Regra Geral (ingresso após 2003) foram atendidos.";
        } else {
          ultimoRequisito = "Requisitos da Regra Geral (ingresso após 2003) não foram atendidos.";
        }
      }
    }
  } else if (criterio === "regraPontos") {
    // Regra de Pontos: inclui cálculo da idade mínima ajustada
    const tempoMinimoContrib = (genero === "feminino") ? 25 : 30;
    const idadeBase = (genero === "feminino") ? 50 : 55;
    let anosContribuidos = diasContribuicao / 365;
    let excedente = Math.max(0, Math.floor(anosContribuidos - tempoMinimoContrib));
    let reducao = Math.min(5, excedente);
    let idadeMinimaAjustada = idadeBase - reducao;
    if ((genero === "feminino" && (anosContribuidos >= 25 && idade >= idadeMinimaAjustada && anosServicoPublico >= 25 && anosCarreira >= 15 && anosCargo >= 5)) ||
        (genero === "masculino" && (anosContribuidos >= 30 && idade >= idadeMinimaAjustada && anosServicoPublico >= 25 && anosCarreira >= 15 && anosCargo >= 5))) {
      ultimoRequisito = "Todos os requisitos da Regra de Pontos foram atendidos. (Idade mínima ajustada: " + idadeMinimaAjustada + " anos)";
    } else {
      ultimoRequisito = "Requisitos da Regra de Pontos não foram atendidos.";
    }
  }

  // Exibir o resultado dos requisitos
  document.getElementById("outputRequisitos").innerText = ultimoRequisito;

  // Abono de Permanência:
  // Supomos que o último requisito foi atingido antes da data de aposentadoria.
  // Exemplo de simulação: considere que o requisito final foi cumprido 2 anos antes da aposentadoria.
  let dataRequisito = new Date(dataAposentadoria);
  dataRequisito.setFullYear(dataRequisito.getFullYear() - 2);
  let diffDias = Math.floor((dataAposentadoria - dataRequisito) / (1000 * 60 * 60 * 24));
  let abono = diffDias > 0 ? 
    "Abono de Permanência devido: " + diffDias + " dia(s), do dia " + 
    new Date(dataRequisito.getTime() + 86400000).toLocaleDateString() + " até " + dataAposentadoria.toLocaleDateString() + "." :
    "Não há direito a Abono de Permanência.";
  document.getElementById("outputAbono").innerText = abono;

  // Situação Funcional entre 01/09/2015 e 31/03/2022:
  let inicioPeriodo = new Date("2015-09-01");
  let fimPeriodo = new Date("2022-03-31");
  let situacao = "";
  // Exemplo de simulação:
  if (dataAposentadoria <= new Date("2017-08-27")) {
    situacao = "O servidor esteve na ativa entre " + inicioPeriodo.toLocaleDateString() + " e " + new Date("2017-08-27").toLocaleDateString() +
               " e aposentado a partir de " + dataAposentadoria.toLocaleDateString() + ".";
  } else if (dataAposentadoria > new Date("2017-08-27") && dataAposentadoria < fimPeriodo) {
    situacao = "O servidor esteve na ativa entre " + inicioPeriodo.toLocaleDateString() + " e " + new Date("2017-08-27").toLocaleDateString() +
               " e aposentado entre " + new Date("2017-08-28").toLocaleDateString() + " e " + dataAposentadoria.toLocaleDateString() + ".";
  } else {
    situacao = "Situação funcional não definida para o período especificado.";
  }
  document.getElementById("outputPeriodoAtivo").innerText = situacao;

  // Executa os cálculos para Licença-Prêmio e Adicional por Tempo de Serviço
  calcularLicencaPremio();
  calcularAdicionalTempo();

  // Calcula os totais de dias não considerados nas gratificações
  calcularGratificacoes();

  // Exibe um resumo final
  document.getElementById("resultadoFinal").innerText = "Cálculos realizados com sucesso.";
}

// Função para calcular a Licença-Prêmio
function calcularLicencaPremio() {
  const mesesLicenca = parseInt(document.getElementById("mesesLicenca").value) || 0;
  const valorParcela = parseFloat(document.getElementById("valorParcela").value) || 0;
  const dataParcelaInicial = new Date(document.getElementById("dataParcelaInicial").value);
  
  // Simulação: o número de parcelas é o mesmo que os meses, limitado a 36
  let parcelas = Math.min(36, mesesLicenca);
  let dataFinal = new Date(dataParcelaInicial);
  dataFinal.setMonth(dataFinal.getMonth() + parcelas);
  
  let total = (mesesLicenca * valorParcela).toFixed(2);
  let resultado = "Licença-Prêmio: Valor total R$ " + total + " em " + parcelas + " parcela(s). " +
                  "Pagamento até " + dataFinal.toLocaleDateString() + ".";
  
  // Verifica se o primeiro pagamento ocorreu no mês subsequente à aposentadoria (simulação)
  const dataAposentadoria = new Date(document.getElementById("dataAposentadoria").value);
  if (dataParcelaInicial.getMonth() !== ((dataAposentadoria.getMonth() + 1) % 12)) {
    resultado += " Atenção: Necessidade de correção monetária.";
  }
  document.getElementById("outputLicenca").innerText = resultado;
}

// Função para calcular o Adicional por Tempo de Serviço
function calcularAdicionalTempo() {
  const anosServicoTotal = parseFloat(document.getElementById("anosServicoTotal").value) || 0;
  const faltas = parseInt(document.getElementById("faltas").value) || 0;
  const licencaFamiliar = parseInt(document.getElementById("licencaFamiliar").value) || 0;
  const licencaPropria = parseInt(document.getElementById("licencaPropria").value) || 0;
  const lc173 = parseInt(document.getElementById("lc173").value) || 0;

  // Desconto: para cada 365 dias somados de faltas/licenças, desconta 1 ano do tempo de serviço
  let descontoAnos = (faltas + licencaFamiliar + Math.max(0, licencaPropria - 730) + lc173) / 365;
  let adicional = Math.max(0, anosServicoTotal - Math.floor(descontoAnos));
  document.getElementById("outputAdicional").innerText = "Adicional por Tempo de Serviço: " + adicional + "%";
}

// Função para adicionar um novo bloco de Gratificação
function adicionarGratificacao() {
  const container = document.getElementById("gratificacoesContainer") || document.getElementById("gratificacoes").querySelector("div");
  let gratsContainer = document.getElementById("gratificacoesContainer");
  if (!gratsContainer) {
    gratsContainer = document.createElement("div");
    gratsContainer.id = "gratificacoesContainer";
    document.getElementById("gratificacoes").insertBefore(gratsContainer, document.getElementById("outputGratificacoes"));
  }

  // Cria um novo bloco para gratificação
  let bloco = document.createElement("div");
  bloco.className = "gratificacao-bloco";
  bloco.innerHTML = `
    <h3>Gratificação</h3>
    <label>Período considerado (ex.: 23/01/1988 a 24/01/1990):</label>
    <input type="text" class="grat-considerado" placeholder="DD/MM/AAAA a DD/MM/AAAA">
    <label>Período exercido (ex.: 17/12/1987 a 24/01/1990):</label>
    <input type="text" class="grat-exercido" placeholder="DD/MM/AAAA a DD/MM/AAAA">
    <button type="button" onclick="calcularGratificacao(this)">Calcular Diferença</button>
    <div class="resultado-gratificacao"></div>
  `;
  gratsContainer.appendChild(bloco);
}

// Função para calcular a diferença de dias de uma gratificação individual
function calcularGratificacao(botao) {
  let bloco = botao.parentElement;
  let considerado = bloco.querySelector(".grat-considerado").value;
  let exercido = bloco.querySelector(".grat-exercido").value;
  let resultado = bloco.querySelector(".resultado-gratificacao");

  if (!considerado || !exercido) {
    resultado.innerText = "Preencha ambos os períodos.";
    return;
  }

  try {
    // Converter datas do formato DD/MM/AAAA para Date
    let [cInicioStr, cFimStr] = considerado.split(" a ");
    let [eInicioStr, eFimStr] = exercido.split(" a ");
    let cInicio = new Date(cInicioStr.split("/").reverse().join("-"));
    let cFim = new Date(cFimStr.split("/").reverse().join("-"));
    let eInicio = new Date(eInicioStr.split("/").reverse().join("-"));
    let eFim = new Date(eFimStr.split("/").reverse().join("-"));

    if (isNaN(cInicio) || isNaN(cFim) || isNaN(eInicio) || isNaN(eFim)) {
      resultado.innerText = "Datas inválidas.";
      return;
    }

    let diasConsiderado = (cFim - cInicio) / (1000 * 60 * 60 * 24);
    let diasExercido = (eFim - eInicio) / (1000 * 60 * 60 * 24);
    let diferenca = Math.abs(Math.round(diasConsiderado - diasExercido));
    resultado.innerText = "Diferença: " + diferenca + " dia(s) não considerados.";
  } catch (error) {
    resultado.innerText = "Erro no cálculo.";
  }
}

// Função para percorrer todos os blocos de gratificações e somar a diferença total
function calcularGratificacoes() {
  let blocos = document.querySelectorAll(".gratificacao-bloco");
  let total = 0;
  blocos.forEach(bloco => {
    let resText = bloco.querySelector(".resultado-gratificacao").innerText;
    let match = resText.match(/(\\d+)/);
    if (match) {
      total += parseInt(match[1], 10);
    }
  });
  document.getElementById("outputGratificacoes").innerText = "Total de dias não considerados nas gratificações: " + total + " dia(s).";
}