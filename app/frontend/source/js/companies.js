import './../css/companies.scss';
import './common';
import HandlerScroll from './common/handler_scroll';
import HandlerPerformance from './companies/handler_performance';
import HandlerZoom from './companies/handler_zoom';
import HandlerImageMap from './common/handler_image_map';

window.addEventListener('load', () => {
  new HandlerPerformance();
  new HandlerScroll();
  new HandlerImageMap();
  new HandlerZoom();
});
