import './common';
import './../css/education-offer.scss';
import ContactEducation from './education-offer/contact_education';
import FormScrollContact from './education-offer/form_scroll_contact';
import ShareSocialNetworks from './offer/share_social_networks';

window.addEventListener('load', () => {
  new ContactEducation();
  new ShareSocialNetworks();
  new FormScrollContact();
});
