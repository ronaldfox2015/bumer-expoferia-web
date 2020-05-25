/**
 * Modulo para cargar el mapa de google
 * @class LoadMap
 * @main Stand
 * @author Christiam Mendives
 */

/*global $*/
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

export default class LoadMap {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      contentMap: '.js-content',
      mapLocation: '.js-map-location',
      mapCanvas: '#mapCanvas',
    };
    this.dom = {};
    this.global = {
      latitude: 0,
      longitude: 0,
      sizeWidth: 640
    }
  }

  catchDom() {
    this.dom.contentMap = $(this.st.contentMap);
    this.dom.mapLocation = $(this.st.mapLocation, this.dom.contentMap);
    this.dom.mapCanvas = $(this.st.mapCanvas, this.st.mapLocation);
    this.global.latitude = this.dom.mapCanvas.attr('data-latitude');
    this.global.longitude = this.dom.mapCanvas.attr('data-longitude');
  }

  subscribeEvents() {
    if (this.dom.mapLocation.length) this.fnCreateMap(this.global.latitude, this.global.longitude)
  }

  fnCreateMap(latitude, longitude) {
    mapboxgl.accessToken = "pk.eyJ1IjoidW50LW9yYmlzIiwiYSI6ImNqc2treWlrdTJ5aDc0M29hbDUyNWsyeHcifQ.K98i65dRQlabcd1R5LJTgA";
    const map = new mapboxgl.Map({
      container: "mapCanvas",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [longitude, latitude],
      scrollZoom: false,
      zoom: 17
    })

    const language = new MapboxLanguage({
      defaultLanguage: "es"
    })

    map.addControl(language);
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
    map.addControl(new mapboxgl.FullscreenControl());

    new mapboxgl.Marker({
      color: 'red'
    })
      .setLngLat({ lng: longitude, lat: latitude })
      .addTo(map);
  }
}
