import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import MDSpinner from 'react-md-spinner';
import 'react-accessible-accordion/dist/fancy-example.css';
import verifiedIcon from '@/assets/images/verifiedIcon.png';
import unverifiedIcon from '@/assets/images/unverifiedIcon.png';
import MenuBar from '@/components/menubar/MenuBar';
import { getLocations, setLocations } from '@/actionCreators/locationActionCreators';
import { REQUEST_LOCATIONS_GET, DATA_LOCATIONS, DATA_STREAM } from '@/constants/reducerTypes';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { handleServerError } from '@/utils/errorHandler';
import { GOOGLE_LOCATION_VERIFICATION_LINK } from '@/constants/links';
import { toast } from 'react-toastify';

/**
 * Class that shows the locations selector
 * for choosing which locations' information
 * will be displayed in the dashboard.
 */
export class Locations extends Component {
  static propTypes = {
    getLocations: PropTypes.func.isRequired,
    setLocations: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    locationsRequest: PropTypes.object.isRequired,
    accountLocations: PropTypes.array.isRequired,
    stream: PropTypes.string.isRequired,
  };

  state = {
    isMenuDropdownOpen: false,
    isError: false,
    isSingleAccount: false,
  };

  /**
   * Lifecycle method that gets the locations
   */
  async componentDidMount() {
    const { getLocations } = this.props;
    toast.dismiss();

    try {
      const accountLocations = await getLocations();
      const isSingleAccount = accountLocations.length === 1;

      let inactiveLength = 0;
      let locationLength = 0;
      accountLocations.forEach(account => {
        account.locations.forEach(location => (!location.isActive ? inactiveLength++ : null));
        locationLength += account.locations.length;
      });

      locationLength === inactiveLength ? this.selectAll() : null;

      this.setState({ isSingleAccount, showAccordion: isSingleAccount, hasLocations: locationLength !== 0 });

      // Handle the Hootsuite refresh event for this page.
      window.hsp.bind('refresh', async () => {
        try {
          await getLocations();
        } catch (error) {
          handleServerError(error);
        }
      });
    } catch (error) {
      handleServerError(error);
    }
  }

  /**
   * Method that unchecks all locations.
   */
  deselectAll = () => {
    const checkboxes = [...document.getElementsByClassName('locations__list__location__checkbox')];
    checkboxes.forEach(checkbox => (checkbox.checked = false));
  };

  /**
   * Method that checks all enabled locations.
   */
  selectAll = () => {
    const checkboxes = [...document.getElementsByClassName('locations__list__location__checkbox')];
    checkboxes.forEach(checkbox => (!checkbox.disabled ? (checkbox.checked = true) : null));
  };

  /**
   * Method that submits the locations
   * to the backend.
   *
   * @param {Object} event
   */
  submit = async event => {
    event.preventDefault();

    const { setLocations, history, stream } = this.props;
    const inputs = [...event.target.elements];
    const selectedIds = inputs.reduce((filtered, input) => {
      if (input.checked) {
        filtered.push(input.value);
      }

      return filtered;
    }, []);

    if (!selectedIds.length) {
      this.setState({ isError: true });
    } else {
      try {
        await setLocations(selectedIds);

        history.push(stream);
      } catch (error) {
        handleServerError(error);
      }
    }
  };

  /**
   * Method that toggles the dropdown state in order to allow menu close on click outside
   * the dropdown.
   */
  toggleMenuDropdown = () => this.setState({ isMenuDropdownOpen: !this.state.isMenuDropdownOpen });

  render() {
    const { isMenuDropdownOpen, isError, isSingleAccount, hasLocations } = this.state;
    const { accountLocations, locationsRequest } = this.props;

    const error = isError ? <p>You must select at least one location.</p> : null;

    return (
      <div className="stream-container">
        <MenuBar isMenuDropdownOpen={isMenuDropdownOpen} toggleMenuDropdown={this.toggleMenuDropdown} />
        <div className="content" onClick={isMenuDropdownOpen ? this.toggleMenuDropdown : undefined}>
          <div className="header">
            <h2>
              Choose <strong>locations/listings</strong>
            </h2>
            <p>that you want to show in this stream</p>
          </div>
          <div className="row">
            <button className="button button--text" onClick={this.selectAll}>
              Select All
            </button>
            <button className="button button--text" onClick={this.deselectAll}>
              Deselect All
            </button>
          </div>
          <form className="locations" onSubmit={this.submit}>
            <div className="locations__list">
              {locationsRequest.isFetching ? (
                <MDSpinner singleColor={LOADING_WHEEL_COLOR} size="40" />
              ) : !hasLocations ? (
                <div className="no-locations">
                  Unable to fetch locations associated to this User. Check with your GMB Account owner to confirm you
                  have permissions to manage your locations
                </div>
              ) : (
                <Accordion accordion={false}>
                  {accountLocations.map(account => (
                    <AccordionItem key={account.accountNameId} expanded={isSingleAccount}>
                      <AccordionItemTitle className="accordion__title">{account.accountName}</AccordionItemTitle>
                      {account.locations.map(location => (
                        <AccordionItemBody key={location.locationNameId}>
                          <div
                            key={location.locationNameId}
                            className={
                              location.isVerified
                                ? 'locations__list__location'
                                : 'locations__list__location locations__list__location--unverified'
                            }
                          >
                            <input
                              className={
                                location.isVerified
                                  ? 'locations__list__location__checkbox'
                                  : 'locations__list__location__checkbox locations__list__location__checkbox--unverified'
                              }
                              name="selected"
                              type="checkbox"
                              value={location.locationNameId}
                              defaultChecked={location.isActive}
                              disabled={!location.isVerified}
                            />
                            <div className="locations__list__location__info">
                              <div className="locations__list__location__info__header">
                                <h4>{location.name}</h4>
                                <div className="locations__list__location__info__header__verification">
                                  {location.isVerified ? (
                                    <Fragment>
                                      <img alt="Verified Icon" src={verifiedIcon} />
                                      <p className="locations__list__location__info__header__verification__verified">
                                        Verified
                                      </p>
                                    </Fragment>
                                  ) : (
                                    <Fragment>
                                      <img alt="Unverified Icon" src={unverifiedIcon} />
                                      <p className="locations__list__location__info__header__verification__unverified">
                                        Unverified
                                      </p>
                                    </Fragment>
                                  )}
                                </div>
                              </div>
                              <div className="locations__list__location__info__details">
                                <p>{location.address}</p>
                                {!location.isVerified && (
                                  <a
                                    className="locations__list__location__info__details__link"
                                    href={GOOGLE_LOCATION_VERIFICATION_LINK}
                                    target="__blank"
                                  >
                                    Learn how to verify
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionItemBody>
                      ))}
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
            <div className="locations__subtitle">
              <p>You can always change the locations/listings in the settings later.</p>
            </div>
            <div className="locations__error">{error}</div>
            <button className="button" type="submit" disabled={locationsRequest.isFetching || !hasLocations}>
              Confirm
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locationsRequest: state[REQUEST_LOCATIONS_GET],
  accountLocations: state[DATA_LOCATIONS].data,
  stream: state[DATA_STREAM].data,
});

const mapDispatchToProps = {
  getLocations,
  setLocations,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Locations);
