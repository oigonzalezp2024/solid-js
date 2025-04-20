import * as THREE from 'three';

// =======================
// Interfaces
// =======================
class IEscena {
  agregarObjeto(objetoEscena) { throw new Error("agregarObjeto debe ser implementado"); }
  crearIluminacion() { throw new Error("crearIluminacion debe ser implementado"); }
  obtenerEscena() { throw new Error("obtenerEscena debe ser implementado"); }
}

class ICamara {
  crearCamara() { throw new Error("crearCamara debe ser implementado"); }
}

class IRender {
  crearRenderer() { throw new Error("crearRenderer debe ser implementado"); }
}

class IResizeHandler {
  constructor() {
    if (this.constructor === IResizeHandler) {
      throw new Error("No se puede instanciar la interfaz IResizeHandler directamente.");
    }
    if (typeof this.onResize !== "function") {
      throw new Error("Debe implementar el método onResize()");
    }
  }
  onResize() { throw new Error("Debe implementar el método onResize()"); }
}

// =======================
// Clases base y derivados
// =======================
class ObjetoEscena {
  crearObjeto() { throw new Error("crearObjeto debe ser implementado"); }
}

class ObjetoAnimado extends ObjetoEscena {
  constructor(ubicacionInicial, velocidadMinima, velocidadMaxima) {
    super();
    this.ubicacion = ubicacionInicial || new THREE.Vector3(10, 0, 0);
    this.velocidadMinima = velocidadMinima || 0.01;
    this.velocidadMaxima = velocidadMaxima || 0.1;
    this.velocidadActual = this.velocidadMinima;
  }

  actualizarVelocidad(deltaX) {
    const aceleracion = deltaX * 0.0005;
    this.velocidadActual += aceleracion;
    this.velocidadActual = Math.max(this.velocidadMinima, Math.min(this.velocidadMaxima, this.velocidadActual));
  }

  mover() {
    throw new Error("mover debe ser implementado");
  }
}

class Oficina extends ObjetoEscena {
  crearObjeto() {
    const oficina = new THREE.Group();

    const paredes = new THREE.Mesh(
      new THREE.BoxGeometry(10, 5, 10),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    paredes.position.y = 2.5;

    const techo = new THREE.Mesh(
      new THREE.BoxGeometry(10.2, 0.5, 10.2),
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    techo.position.y = 5.25;

    oficina.add(paredes);
    oficina.add(techo);
    return oficina;
  }
}

class Tren extends ObjetoAnimado {
  constructor(ubicacionInicial = new THREE.Vector3(0, 0.5, 8), velocidadMinima, velocidadMaxima) {
    super(ubicacionInicial, velocidadMinima, velocidadMaxima);
    this.angle = 15;
  }

  crearObjeto() {
    this.tren = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshLambertMaterial({ color: 0x3333ff })
    );
    this.tren.position.copy(this.ubicacion);
    return this.tren;
  }

  mover(speed) {
    this.angle -= speed;
    const radio = 8;
    this.ubicacion.x = Math.cos(this.angle) * radio;
    this.ubicacion.z = Math.sin(this.angle) * radio;
    this.ubicacion.y = 0.5;
    this.tren.position.copy(this.ubicacion);
    this.tren.rotation.y = -this.angle + Math.PI / 2;
  }
}

class Paloma extends ObjetoAnimado {
  crearObjeto() {
    this.paloma = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.5, 1),
      new THREE.MeshLambertMaterial({ color: 0x999999 })
    );
    this.paloma.position.copy(this.ubicacion);
    return this.paloma;
  }

  mover(objetivo) {
    const distanciaVector = objetivo.position.clone().sub(this.ubicacion);
    const distanciaHorizontal = new THREE.Vector3(distanciaVector.x, 0, distanciaVector.z);
    const distancia = distanciaHorizontal.length();

    const posYEncimaTren = 1.5;
    const alturaVuelo = 8;

    if (distancia > 2) {
      const direccion = distanciaHorizontal.normalize();
      this.ubicacion.x += direccion.x * this.velocidadActual;
      this.ubicacion.z += direccion.z * this.velocidadActual;
      this.ubicacion.y = alturaVuelo;
    } else {
      this.ubicacion.x = objetivo.position.x;
      this.ubicacion.z = objetivo.position.z;
      this.ubicacion.y = posYEncimaTren;
    }

    this.paloma.position.copy(this.ubicacion);
  }
}

// =======================
// Implementaciones concretas
// =======================
class Escena extends IEscena {
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaee2ff);
  }

  agregarObjeto(objetoEscena) {
    const objeto = objetoEscena.crearObjeto();
    this.scene.add(objeto);
    return objeto;
  }

  crearIluminacion() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    this.scene.add(light);
  }

  obtenerEscena() {
    return this.scene;
  }
}

class Camara extends ICamara {
  crearCamara() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 20);
    return camera;
  }
}

class MyRender extends IRender {
  crearRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
  }
}

class Controles {
  manejarMouse(baseSpeed, maxSpeed, speedDecay, speedControl) {
    let lastMouseX = null;
    window.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (lastMouseX !== null) {
        const deltaX = e.clientX - lastMouseX;
        const aceleracion = deltaX * 0.0005;
        speedControl.speed += aceleracion;
        speedControl.speed = Math.max(baseSpeed, Math.min(maxSpeed, speedControl.speed));
        speedControl.lastMouseMoveTime = now;
      }
      lastMouseX = e.clientX;
    });
  }
}

class Animador {
  iniciarLoop(scene, camera, renderer, tren, paloma, speedControl, baseSpeed, speedDecay) {
    const animate = () => {
      requestAnimationFrame(animate);

      const now = Date.now();
      const tiempoSinMovimiento = now - (speedControl.lastMouseMoveTime || 0);
      if (tiempoSinMovimiento > 100 && speedControl.speed > baseSpeed) {
        speedControl.speed -= speedDecay;
        if (speedControl.speed < baseSpeed) speedControl.speed = baseSpeed;
      }

      tren.mover(speedControl.speed);
      paloma.mover(tren.tren);

      renderer.render(scene, camera);
    };
    animate();
  }
}

class ResizeHandler extends IResizeHandler {
  constructor(camera, renderer) {
    super();
    this.camera = camera;
    this.renderer = renderer;
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// =======================
// Controlador principal
// =======================

class Controller {
  constructor(escena, camara, renderizador, controles, animador, resizeHandler, oficinaFactory, trenFactory, palomaFactory) {
    this.escena = escena;
    this.camara = camara;
    this.renderizador = renderizador;
    this.controles = controles;
    this.animador = animador;
    this.resizeHandler = resizeHandler;
    this.oficinaFactory = oficinaFactory;
    this.trenFactory = trenFactory;
    this.palomaFactory = palomaFactory;

    this.baseSpeed = 0.01;
    this.maxSpeed = 0.07;
    this.speedDecay = 0.0005;
    this.speedControl = { speed: this.baseSpeed, lastMouseMoveTime: Date.now() };

    this.init();
  }

  init() {
    const scene = this.escena.obtenerEscena();
    const camera = this.camara.crearCamara();
    const renderer = this.renderizador.crearRenderer();

    this.escena.crearIluminacion();
    this.escena.agregarObjeto(this.oficinaFactory.crear());
    this.tren = this.trenFactory.crear(new THREE.Vector3(0, 0, 8), this.baseSpeed, this.maxSpeed);
    this.paloma = this.palomaFactory.crear(new THREE.Vector3(0, 8, 0), 0.1, 0.8);
    this.escena.agregarObjeto(this.tren);
    this.escena.agregarObjeto(this.paloma);

    this.controles.manejarMouse(this.baseSpeed, this.maxSpeed, this.speedDecay, this.speedControl);
    this.animador.iniciarLoop(scene, camera, renderer, this.tren, this.paloma, this.speedControl, this.baseSpeed, this.speedDecay);

    this.resizeHandler.init(camera, renderer); // Inicializar el resize handler con las instancias creadas
  }
}

// =======================
// Factories para la creación de objetos
// =======================
class OficinaFactory {
  crear() {
    return new Oficina();
  }
}

class TrenFactory {
  crear(ubicacionInicial, velocidadMinima, velocidadMaxima) {
    return new Tren(ubicacionInicial, velocidadMinima, velocidadMaxima);
  }
}

class PalomaFactory {
  crear(ubicacionInicial, velocidadMinima, velocidadMaxima) {
    return new Paloma(ubicacionInicial, velocidadMinima, velocidadMaxima);
  }
}

// =======================
// Inicialización
// =======================
const escena = new Escena();
const camara = new Camara();
const renderizador = new MyRender();
const controles = new Controles();
const animador = new Animador();
const resizeHandler = new ResizeHandler();

const oficinaFactory = new OficinaFactory();
const trenFactory = new TrenFactory();
const palomaFactory = new PalomaFactory();

new Controller(
  escena,
  camara,
  renderizador,
  controles,
  animador,
  resizeHandler,
  oficinaFactory,
  trenFactory,
  palomaFactory
);