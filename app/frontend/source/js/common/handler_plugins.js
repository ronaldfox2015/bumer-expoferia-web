/*global $*/

export default class HandlerPlugins{
  constructor() {
    this.catchDom();
    this.startPlugins()
  }

  catchDom(){
    this.tagSelect = $(".g-select-pretty");
    this.images = $("img.lazy")
  }

  startPlugins(){
    this.tagSelect.prettySelect();
    this.images.lazyload({
      effect : "fadeIn"
    });
  }
}

