//Classe para definir as propriedades dos objetos tarefa
class Tarefa { 
    static contadorId = 1
    concluida = false
    prioridade = "Baixa"

    constructor(descricao) {
        this.id = Tarefa.contadorId++
        this.descricao = descricao
    }
}

//Função factory para instanciar os objetos tarefa passando a descrição no constructor
function criarObjetoTarefa(descricao) { 
    let tarefa = new Tarefa(descricao)
    //POSSÍVEL LUGAR PARA SALVAR COM LOCALSTORAGE
    return tarefa
}

//Verifica se o usuário pressionou a teclaenter, caso sim, a função
function pressionarEnter(event) {
    if (event.key == 'Enter') {
        verificarCampos()
    }

}

//Função para verificar se os campos da descrição e radio button estão vazios
function verificarCampos() {
    let desc = document.querySelector("#descricao")
    let prio = document.querySelector('input[name="escolha"]:checked')

    if (desc.value == "") {
        alert("Descrição inváida")
    } else if (!prio) {
        alert("Adicione o nível de prioridade")
    } else {
        criarTarefa(desc)
    }
}
//Adicionando o evento click no botao para chamar a função VerificarCampos
document.querySelector("#adicionarTarefa").addEventListener("click", verificarCampos)

function criarTarefa(desc) {
    let tarefa = criarObjetoTarefa(desc.value)
    verificarPrioridade(tarefa)
    ordenarTarefas(tarefa)

    desc.value = ""
}

function inserirTarefaDOM(elementoLista, objetoTarefa) { //

    if (arrayTarefas.length <= 0) { //Verifica se é a primeira tarefa para remover o parágrafo
        let sem = document.querySelector('#semTarefasLi')
        sem.remove()
    }

    let check = criarCheckbox(objetoTarefa) //Criar um checkbox para a tarefa
    elementoLista.prepend(check)

    if(objetoTarefa.concluida == true){
        check.checked = true
    }

    let butao = document.createElement('button')
    butao.classList.add('botaoExcluirTarefa')
    //Tirei o texto do botão para colocar a lixeira no lugar
    elementoLista.append(butao)
    butao.addEventListener('click', () => { excluirTarefa(elementoLista, objetoTarefa) })

    check.addEventListener('change', () => { verificarTarefaFeita(check, elementoLista, objetoTarefa) })
}

function criarCheckbox(objetoTarefa) {
    let check = document.createElement('input')
    check.type = 'checkbox'
    check.name = 'marcar'
    check.id = `marcar: ${objetoTarefa.id}`
    check.classList.add("customCheckbox")
    return check
}

let arrayTarefas = []

function ordenarTarefas(tarefa) {
    //OUTRO POSSÍVEL LUGAR PRA SALVER COM LOCALSTORAGE

    arrayTarefas.push(tarefa)
    const ordemPrioridades = { "Alta": 2, "Média": 1, "Baixa": -1 }

    arrayTarefas.sort((t1, t2) => {
        return ordemPrioridades[t2.prioridade] - ordemPrioridades[t1.prioridade]
    })

    reconstruirLista()
}

//Em desnvolvimento
function salvarTarefas(tarefa) {
    for (let c = 0; c < arrayTarefas.length; c++) {
        localStorage.setItem(`Tarefa - ${c}`, arrayTarefas[c])
    }
}

function reconstruirLista(filtro) {

    let ul = document.querySelector("#listaTarefas")

    ul.innerHTML = ''

    for (let c = 0; c < arrayTarefas.length; c++) {
        criarLista(arrayTarefas[c])
    }
    
    if(filtro != false){
        alert("Tarefa criada")
    }
}


function criarLista(tarefa) {

    let ul = document.querySelector("#listaTarefas")
    let li = document.createElement("li")
    let textoLi = document.createElement("span")
    let nivelPrioridadeEl = document.createElement("span")
    textoLi.classList.add("customText")
    li.classList.add("tasks")// 

    
    switch(tarefa.prioridade){
        case "Baixa":
            nivelPrioridadeEl.innerText = "Baixa"
            nivelPrioridadeEl.classList.add("baixaPrioridadeEl")
            li.classList.add("taskLow")
            break
        case "Média":
            nivelPrioridadeEl.innerText = "Média"
            nivelPrioridadeEl.classList.add("mediaPrioridadeEl")
            li.classList.add("taskMedium")
            break
        case "Alta":
            nivelPrioridadeEl.innerText = "Alta"
            nivelPrioridadeEl.classList.add("altaPrioridadeEl")
            li.classList.add("taskHigh")
            break
        default:
            alert("ERRO INSPERADO")
    }

    if(tarefa.concluida == true){
        textoLi.classList.add("riscado")
    }

    textoLi.innerHTML = `${tarefa.descricao} - Nivel de Prioridade: `
    li.appendChild(textoLi)
    li.append(nivelPrioridadeEl)
    ul.appendChild(li)

    inserirTarefaDOM(li, tarefa)

}


function excluirTarefa(elementoLista, tarefa) {
    let ul = document.querySelector("#listaTarefas")

    for (let c = 0; c < arrayTarefas.length; c++) {
        if (arrayTarefas[c] == tarefa) {
            arrayTarefas.splice(c, 1)
        }

        if (arrayTarefas.length <= 0) {
            let semTarefas = document.createElement('li')
            semTarefas.innerHTML = "Sua lista não tem nenhuma tarefa no momento."
            ul.appendChild(semTarefas)
        }
    }
    ul.removeChild(elementoLista)
}

function verificarPrioridade(tarefa) {
    let prio = document.querySelector('input[name="escolha"]:checked')

    switch (prio.value) {
        case "Baixa":
            tarefa.prioridade = "Baixa"
            break
        case "Média":
            tarefa.prioridade = "Média"
            break
        case "Alta":
            tarefa.prioridade = "Alta"
            break
        default:
            alert("ERRO INSPERADO")
    }
}


document.querySelector("#descricao").addEventListener('keyup', pressionarEnter)


function verificarTarefaFeita(input, elementoLista, tarefa) {

    if (input.checked) {
        elementoLista.querySelector(".customText").classList.add('riscado')
        tarefa.concluida = true
    } else {
        elementoLista.querySelector(".customText").classList.remove('riscado')
        tarefa.concluida = false
    }

}


//Em desenvolvimento
function filtrarTarefasTodas(){
    reconstruirLista(false)
}

//Em desenvolvimento
function filtrarTarefasPendentes(){
    let ul = document.querySelector("#listaTarefas")

    ul.innerHTML = ''

    for (let c = 0; c < arrayTarefas.length; c++) {
        if(!arrayTarefas[c].classList.contains("riscado")){
            criarLista(arrayTarefas[c])
        }
       
    }
    
}

