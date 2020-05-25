/**
 * Módulo encargado de hacer mover al avion
 * @class AirplaneTranslate
 * @main Home
 * @author Carlos Huamaní
 */

/*global $*/

export default class AirplaneTranslate {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribe();
  }

  setSettings() {
    this.st = {
      object   : ".js-airplane_animation",
      layer    : ".js-extra-layer",
      video    : ".js-video-container",
      animation: {
        sprite   : {},
        landscape: {}
      }
    };
    this.dom = {};
    this.constants = {
      MAX_HEIGHT: 800,
      MIN_HEIGHT: 400,
      TIMING_TRAVEL: 16000
    }
  }

  catchDom() {
    this.dom.object = $(this.st.object);
    this.dom.layer = $(this.st.layer);
  }

  afterCatchDom() {
    if (this.dom.object.length > 0) {
      this.dom.object.show();
      this.fnUpdateAnimation();
      this.fnAnimateObject(this.st.animation.sprite);
    }
  }

  subscribe() {
    $(window).on('resize', () => this.fnReinitialize())
  }

  fnReinitialize() {
    // Actualiza las medidas
    this.fnUpdateAnimation();
    // Realice nuevamente la animacion
    this.fnAnimateObject(this.st.animation.sprite);
  }

  fnGetHeightAirplane(currentHeight) {
    // Brinda el porcentaje de variacion del tamaño del avion y el tiempo de recorrido
    // Height entre 800 y 400 varia en un porcentaje de 1 a 0,5
    let percent;
    if (currentHeight >= this.constants.MAX_HEIGHT) {
      percent = 1;
    } else if (currentHeight <= this.constants.MIN_HEIGHT) {
      percent = 0.5;
    } else {
      percent = currentHeight/this.constants.MAX_HEIGHT
    }
    return percent
  }

  fnUpdateAnimation() {
    if (this.dom.object.length === 0) { return; }
    let percent, spriteScaled;
    // Obtiene el porcentaje de variacion acorde al height del lienzo
    percent = this.fnGetHeightAirplane(this.dom.layer.height());
    // Reduce el tamaño del avion acorde a la altura del lienzo
    this.dom.object.css({'transform': `scale(${percent})`});
    // Obtiene el alto del sprite
    spriteScaled = this.dom.object[0].getBoundingClientRect();
    // Actualiza el sprite
    this.st.animation.sprite = {
      posX   : spriteScaled.width * -2,
      posY   : spriteScaled.height * -2,
      posMinY: spriteScaled.height * -2, // El minimo alto de donde puede aparecer
      posMaxY: spriteScaled.height, // El màximo alto de donde puede aparecer
    };
    // Actualiza el lienzo
    this.st.animation.landscape = {
      width : $(this.st.layer).width(),
      height: $(this.st.layer).height(),
      timing: this.constants.TIMING_TRAVEL / percent // actualiza el tiempo de recorrido
    };
  }

  fnAnimateObject(sprite) {
    // Se fija el punto inicial
    this.dom.object.css({
      'top' : sprite.posY,
      'left': this.st.animation.sprite.posX
    });
    // Se realiza la animacion donde se define el punto destino
    this.dom.object.stop().animate({
      left: this.st.animation.landscape.width,
      top : `+=${this.st.animation.sprite.posY * -1 + this.st.animation.landscape.height}` // HEIGHT AVION + HEIGHT CONTAINER
    }, this.st.animation.landscape.timing, "linear", () => {
      // Se procede a solicitar el proximo punto inicial para el proximo viaje del avion
      let newPosition = this.fnCreateNewPosition();
      this.fnAnimateObject(newPosition)
    })
  }

  fnCreateNewPosition() {
    let newPosition;
    // Se obtiene de manera aleatoria el nuevo punto Y (entre posMinY - posMaxY )
    newPosition = {
      'posY': Math.random() * (this.st.animation.sprite.posMaxY - this.st.animation.sprite.posMinY) + this.st.animation.sprite.posMinY
    };
    return newPosition;
  }
}


