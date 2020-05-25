import './../css/offer.scss';
import './common';
import HandlerValidateForms from './common/handler_validate_forms';
import ModalShareByEmail from './offer/modal_share_by_email';
import ModalSaveQuestions from './offer/modal_questions';
import ShareSocialNetworks from './offer/share_social_networks';
import HandlerHashOffer from './offer/handler_hash_offer';
import ModalUpdateData from './offer/modal_update_data';
import ViewMoreInformation from './offer/view_more_information';
import ContainerFloat from './offer/container_float';
import AccordeonTitle from './offer/accordeon_title';

window.addEventListener('load', () => {
  new HandlerValidateForms();
  new ShareSocialNetworks();
  new ModalSaveQuestions();
  new ModalShareByEmail();
  new HandlerHashOffer();
  new ContainerFloat();
  new ViewMoreInformation();
  new AccordeonTitle();
  if( parseInt(window.logged) == 1 ) { new ModalUpdateData() }
});
