import HandlerValidateForms from './common/handler_validate_forms';
import HandlerPlugins from './common/handler_plugins';
import ModalLogin from './common/modal_login';
import ModalRecoveryPassword from './common/modal_recovery_password';
import ModalRegister from './common/modal_register';
import GradeStatesComponent from './common/grade_states_component';
import AutocompleteLocations from './common/autocomplete_locations';
import AutocompleteInstitutions from './common/autocomplete_institutions';
import AutocompleteCareers from './common/autocomplete_careers';
import AutocompletePositions from './common/autocomplete_positions';
import AreaComponent from './common/area_component';
import LevelComponent from './common/level_component';
import ToggleMobileMenu from './common/toggle_mobile_menu';
import StickyHeader from './common/sticky_header';

window.addEventListener('load', () => {
  new ToggleMobileMenu();
  new HandlerValidateForms();
  new HandlerPlugins();
  new ModalLogin();
  new ModalRecoveryPassword();
  if( parseInt(window.logged) == 0 ) {
    new ModalRegister();
  }
  new GradeStatesComponent();
  new AutocompleteLocations();
  new AutocompleteInstitutions();
  new AutocompleteCareers();
  new AutocompletePositions();
  new AreaComponent();
  new LevelComponent();
  new StickyHeader();
});
