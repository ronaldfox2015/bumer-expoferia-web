import './../css/home.scss';
import './common';
import HandlerScroll from './common/handler_scroll';
import HandlerImagePerformance from './common/handler_image_performance';
import HandlerImageMap from './common/handler_image_map';
import HandlerTooltipNavigation from './common/handler_tooltip_navigation';
import AirplaneTranslate from './home/airplane_translate';

window.addEventListener('load', () => {
  new HandlerScroll();
  new HandlerImagePerformance();
  new HandlerImageMap();
  new HandlerTooltipNavigation();
  new AirplaneTranslate();
});
