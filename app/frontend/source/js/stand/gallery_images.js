/**
 * Implementa la galería de imagenes responsive
 * @class GalleryImages
 * @main Stand
 * @author Victor Sandoval
 */
import 'slick-carousel';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

/*global $*/
export default class GalleryImages {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      sliderFor    : '.js-image-gallery_slider-for',
      sliderNav    : '.js-image-gallery_slider-nav',
      btnSliderPrev: '.js-image-gallery_slider-btn-prev',
      btnSliderNext: '.js-image-gallery_slider-btn-next',
      tab          : '.js-tab-link'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.sliderFor     = $(this.st.sliderFor);
    this.dom.sliderNav     = $(this.st.sliderNav);
    this.dom.btnSliderPrev = $(this.st.btnSliderPrev);
    this.dom.btnSliderNext = $(this.st.btnSliderNext);
    this.dom.tab           = $(this.st.tab);
  }

  afterCatchDom() {
    this.fnInitGallery();
  }

  subscribeEvents() {
    this.dom.tab.on('click', (event) => this.onClickTab(event))
  }

  onClickTab(event) {
    if($(event.target).data('key') === 'galeria' && $(event.target).attr('data-show') === 'false') {
      $(event.target).attr('data-show', 'true');
      this.dom.sliderFor.slick('unslick').slick(this.getOptionsFor());
      this.dom.sliderNav.slick('unslick').slick(this.getOptionsNav());
    }
  }

  fnInitGallery () {
    if(this.dom.sliderFor.length !== 0) {
      this.dom.sliderFor.slick(this.getOptionsFor());
    }
    if(this.dom.sliderNav.length !== 0) {
      this.dom.sliderNav.slick(this.getOptionsNav());
    }
  }

  getOptionsFor() {
    return {
      slidesToShow  : 1,
      slidesToScroll: 1,
      arrows        : true,
      fade          : true,
      prevArrow     : this.dom.btnSliderPrev[0].outerHTML,
      nextArrow     : this.dom.btnSliderNext[0].outerHTML,
      asNavFor      : this.st.sliderNav
    }
  }

  getOptionsNav() {
    return {
      slidesToShow  : 5,
      slidesToScroll: 1,
      asNavFor      : this.st.sliderFor,
      dots          : false,
      arrows        : false,
      focusOnSelect : true
    }
  }
}

