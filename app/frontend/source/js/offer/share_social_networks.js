/**
 * Clase para compartir aviso en redes sociales
 * @class ShareSocialNetworks
 * @main Stand
 * @author Claudia Valdivieso
 */

/*global $*/

export default class ShareSocialNetworks {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      btnFb       : '.js-fb',
      btnTwitter  : '.js-twitter',
      btnGoogle   : '.js-google-plus',
      btnLinkedIn : '.js-linkedin',
      shareButtons: '.js-social-media-container'
    };
    this.dom = {};
    this.global = {};
  }

  catchDom() {
    this.dom.shareButtons  = $(this.st.shareButtons);
    this.dom.btnFb         = $(this.st.btnFb, this.dom.shareButtons);
    this.dom.btnTwitter    = $(this.st.btnTwitter, this.dom.shareButtons);
    this.dom.btnGoogle     = $(this.st.btnGoogle, this.dom.shareButtons);
    this.dom.btnLinkedIn   = $(this.st.btnLinkedIn, this.dom.shareButtons);
    this.global.shareUrl   = this.dom.shareButtons.data('url');
    this.global.shareTitle = this.dom.shareButtons.data('title');
  }

  afterCatchDom() {
    this.addUrl();
  }

  subscribeEvents() {
    this.dom.btnFb.on('click', () => this.shareFb());
    this.dom.btnTwitter.on('click', this.shareTwitter);
    this.dom.btnGoogle.on('click', this.shareGooglePlus);
    this.dom.btnLinkedIn.on('click', this.shareLinkedIn);
  }

  addUrl() {
    this.dom.btnTwitter.attr('href', `http://twitter.com/intent/tweet?url=${this.global.shareUrl}&amp;text=${encodeURIComponent(this.global.shareTitle)}`);
    this.dom.btnGoogle.attr('href', `https://plus.google.com/share?url=${this.global.shareUrl}`);
    this.dom.btnLinkedIn.attr('href', `https://www.linkedin.com/cws/share?url=${this.global.shareUrl}`);
  }

  shareFb () {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.global.shareUrl)}`, 'facebooksharedialog', 'width=626,height=436');
  }
  shareTwitter () {
    window.open(this.href, this.target, 'width=600,height=400');
    return false;
  }
  shareGooglePlus () {
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }
  shareLinkedIn () {
    window.open(this.href, this.target, 'width=600,height=400');
    return false;
  }
}

