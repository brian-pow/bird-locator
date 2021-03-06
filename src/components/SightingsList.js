import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getRecentSpeciesSightings } from "../actions";

import { FaDirections } from "react-icons/fa";
import { Redirect } from "react-router";

const SightingsList = ({
  selectedBird,
  recentSightings,
  getRecentSpeciesSightings,
  zip,
}) => {
  useEffect(() => {
    if (!selectedBird || !zip) return null;
    else {
      getRecentSpeciesSightings(selectedBird.speciesCode, zip.zip, zip.stateID);
    }
  }, []);

  const dateToString = (date) => {
    let monthArray = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    let monthNumber = parseInt(date.substring(5, 7));
    let dateNumber = parseInt(date.substring(8, 10));
    let dateString = `${monthArray[monthNumber - 1]} ${dateNumber}`;
    return dateString;
  };

  const buildList = () => {
    if (recentSightings.length === 0) {
      return null;
    } else {
      return recentSightings.map((bird) => {
        return (
          <div key={bird.lat} className="sightingCard">
            <div className="leftSide">
              <div className="">{dateToString(bird.obsDt)}</div>
              <div className="">{bird.locName}</div>
              <div className="distance">
                {Math.round(bird.distanceFromCurrentLocation)} miles away
              </div>
            </div>
            <div className="rightSide">
              <a href={`http://maps.apple.com/?q=${bird.lat},${bird.lng}`}>
                <FaDirections size={32} />
              </a>
            </div>
            <br className="lineBreak" />
          </div>
        );
      });
    }
  };

  if (!selectedBird || !zip) return <Redirect to="/" />;
  return (
    <div>
      <div className="sightingsListHeaderDiv">
        <h1 className="sightingsListHeader">{selectedBird.comName}</h1>
        <div>
          <h3 className="sightingsListSciName">{selectedBird.sciName}</h3>
        </div>
      </div>
      <div className="sightingsListContainer">{buildList()}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedBird: state.selectedBird,
    recentSightings: state.recentSightings,
    zip: state.zip,
  };
};

export default connect(mapStateToProps, { getRecentSpeciesSightings })(
  SightingsList
);
