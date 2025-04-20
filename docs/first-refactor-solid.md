# 🚂🌟 **Refactorizando con POO y Principios SOLID** 🌟🚂

¡Hola, futuros arquitectos del software! En esta emocionante etapa, no solo vamos a construir un Tren Mágico en 3D, sino que también aprenderemos los secretos para escribir código robusto y fácil de mantener utilizando la Programación Orientada a Objetos (POO) y los **principios SOLID**. ¡Prepárense para una transformación mágica de nuestro código!

**Recordatorio:**
* Una **clase** es como una receta para crear objetos con características (atributos) y comportamientos (métodos) específicos.
* Los **principios SOLID** son cinco reglas fundamentales para diseñar sistemas orientados a objetos que sean flexibles, mantenibles y comprensibles.

---

## **Etapa 1: Sentando las Bases con Clases e Interfaces**

Al igual que un constructor necesita planos antes de levantar un edificio, en POO definimos **clases** e **interfaces** para estructurar nuestro software.

### **Interfaces: Definiendo Habilidades**

Las **interfaces** son como contratos. Definen qué acciones (métodos) un objeto debe ser capaz de realizar, pero no cómo las realiza. Esto nos ayuda a seguir el **Principio de Inversión de Dependencias (DIP)**, donde dependemos de abstracciones (las interfaces) en lugar de implementaciones concretas.

```javascript
class IEscena {
  agregarObjeto(objetoEscena) { throw new Error("agregarObjeto debe ser implementado"); }
  crearIluminacion() { throw new Error("crearIluminacion debe ser implementado"); }
  obtenerEscena() { throw new Error("obtenerEscena debe ser implementado"); }
}

// ... (ICamara, IRender, IResizeHandler - definidos anteriormente)
```

### **Clases Base: Compartiendo Características**

Las **clases base** nos permiten compartir funcionalidades comunes entre diferentes tipos de objetos, adhiriéndonos al **Principio de Abierto/Cerrado (OCP)** al permitir la extensión a través de la herencia y al **Principio de Sustitución de Liskov (LSP)** al asegurar que las subclases puedan usarse en lugar de sus superclases.

```javascript
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

  actualizarVelocidad(deltaX) { /* ... */ }
  mover() { throw new Error("mover debe ser implementado"); }
}
```

---

## **Etapa 2: Creando los Componentes (Clases Concretas y SRP)**

Ahora, implementamos las clases concretas que dan vida a nuestro mundo 3D. Aquí aplicamos el **Principio de Responsabilidad Única (SRP)**, donde cada clase tiene una única tarea.

```javascript
// La clase Escena se encarga solo de la gestión de la escena.
class Escena extends IEscena { /* ... */ }

// La clase Camara solo se encarga de la creación de la cámara.
class Camara extends ICamara { /* ... */ }

// La clase MyRender solo se encarga de la creación del renderizador.
class MyRender extends IRender { /* ... */ }

// Las clases Tren y Paloma se encargan de su propia creación y movimiento.
class Tren extends ObjetoAnimado { /* ... */ }
class Paloma extends ObjetoAnimado { /* ... */ }

// La clase Controles maneja la entrada del ratón.
class Controles { /* ... */ }

// La clase Animador gestiona el bucle de animación.
class Animador { /* ... */ }

// La clase ResizeHandler ajusta la vista al redimensionar la ventana.
class ResizeHandler extends IResizeHandler { /* ... */ }
```

Cada una de estas clases tiene un propósito específico, lo que hace que el código sea más fácil de entender y modificar si solo necesitamos cambiar una parte del sistema.

---

## **Etapa 3: Orquestando la Magia con el Controlador (DIP)**

El `Controller` actúa como el director de nuestra obra mágica. Su responsabilidad es crear y coordinar todos los demás objetos. Al recibir las dependencias (las instancias de las otras clases) en su constructor, aplicamos el **Principio de Inversión de Dependencias (DIP)**. El `Controller` depende de las abstracciones (las interfaces implícitas de las clases que se le pasan) y no de las implementaciones concretas directamente.

```javascript
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

    this.resizeHandler.init(camera, renderer);
  }
}
```

---

## **Etapa 4: Simplificando la Creación de Objetos con Factories (SRP)**

Las **Factories** son clases especiales cuya única responsabilidad es crear instancias de otras clases. Esto sigue el **Principio de Responsabilidad Única (SRP)** al separar la lógica de creación de objetos de la lógica de su uso.

```javascript
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
```

---

## **Etapa 5: ¡Dando Vida al Mundo Mágico!**

Finalmente, creamos las instancias de nuestras clases y las conectamos para que la magia suceda.

```javascript
const escena = new Escena();
const camara = new Camara();
const renderizador = new MyRender();
const controles = new Controles();
const animador = new Animador();
const resizeHandler = new ResizeHandler(camara, renderizador);

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
```

A lo largo de esta refactorización, hemos aplicado los principios SOLID para crear un código más organizado, flexible y fácil de mantener. Cada clase tiene una responsabilidad clara (SRP), podemos extender el sistema sin modificar el código existente (OCP), los objetos de las subclases pueden sustituir a los de sus superclases (LSP), nuestras interfaces son cohesivas (ISP, aunque aquí es implícito), y dependemos de abstracciones en lugar de implementaciones concretas (DIP).

¡Hemos transformado nuestro Tren Mágico en un ejemplo brillante de POO y principios SOLID! ¡Sigan explorando y construyendo mundos de código increíbles! 🚀✨