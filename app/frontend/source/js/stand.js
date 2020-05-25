import './common';
import AnimatedScrollTable from './stand/animate_scroll_table';
import ModalVideoCanvas from './stand/modal-video-canvas';
import HandlerCanvas from './stand/handler_canvas';
import ChangeTabs from './stand/handler_change_tabs';
import GalleryImages from './stand/gallery_images';
import ModalSendCV from './stand/modal_send_cv';
import LoadMap from './stand/load_map';
import ShowAside from './stand/show_aside';
import DatalayerSearch from './stand/datalayer_search';

import './../css/stand.scss';

window.addEventListener('load', () => {
  new AnimatedScrollTable();
  new HandlerCanvas();
  new ModalVideoCanvas();
  new ChangeTabs(new LoadMap());
  new GalleryImages();
  new ModalSendCV();
  new LoadMap();
  new ShowAside();
  new DatalayerSearch();
});
