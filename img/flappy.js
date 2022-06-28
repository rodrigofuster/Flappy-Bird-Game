// função para criar elementos
function novoElemento(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

// função para criar  uma das barreiras
function Barreira(reversa = false) {
  this.elemento = novoElemento("div", "barreira");

  const borda = novoElemento("div", "borda");
  const corpo = novoElemento("div", "corpo");
  this.elemento.appendChild(reversa ? corpo : borda);
  this.elemento.appendChild(reversa ? borda : corpo);

  // ajustar a altura da barreira
  this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
}

/*const b = new Barreira(true) 
b.setAltura(200) 
document.querySelector(".flappy").appendChild(b.elemento)*/

function ParDeBarreiras(altura, abertura, x) {
  this.elemento = novoElemento("div", "par-de-barreiras");

  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  // gerar a posição das barreiras
  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  this.getX = () => parseInt(this.elemento.style.left.split("px")[0]);
  this.setX = (x) => (this.elemento.style.left = `${x}px`);
  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}

//const b = new ParDeBarreiras(700, 200, 800)
//document.querySelector('.flappy').appendChild(b.elemento)

// posicionamento das barreiras

function Barreiras(altura, largura, abertura, espaço, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaço),
    new ParDeBarreiras(altura, abertura, largura + espaço * 2),
    new ParDeBarreiras(altura, abertura, largura + espaço * 3),
  ];

  const deslocamento = 3;
  this.animar = () => {
    this.pares.forEach((par) => {
      par.setX(par.getX() - deslocamento);

      // quando o elemento sair da área do jogo
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaço * this.pares.length);
        par.sortearAbertura();
      }

      const meio = largura / 2;
      const cruzouOMeio =
        par.getX() + deslocamento >= meio && par.getX() < meio;
      if (cruzouOMeio) notificarPonto();
    });
  };
}

const barreiras = new Barreiras(700, 1200, 200, 400);
const areaDoJogo = document.querySelector(".flappy");
barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));
