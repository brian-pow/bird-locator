import React, { useState } from "react";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import states from "../apis/zipData.json";
import TypedLine from "./TypedLine";
import NonTypedElement from "./NonTypedElement";
import "./Chatbot.css";
import {
  setZipCode,
  getPossibleSightings,
  getRecentSpeciesSightings,
  selectBird,
} from "../actions";

const ChatBot = ({
  zip,
  setZipCode,
  possibleSightings,
  getPossibleSightings,
  recentSightings,
  getRecentSpeciesSightings,
  selectedBird,
  selectBird,
}) => {
  let history = useHistory();
  const [formFields, setFormFields] = useState({ birdSearch: "" });

  //Tracks states and misc. properties of each typed elements / logical interface step
  const [show, setShow] = useState({
    1: { show: 1, activeTyping: 1 },
    2: { show: 0, attachClass: "", value: "", error: 0 },
    3: { show: 0, activeTyping: 1 },
    4: { show: 0, attachClass: "", value: "" },
    5: { show: 0 },
    6: { show: 0, activeTyping: 1 },
    7: { show: 0 },
    8: { show: 0, activeTyping: 1 },
    9: { show: 0, activeTyping: 1 },
    10: { show: 0 },
    11: { show: 0, activeTyping: 1 },
  });

  //Build list of recent bird sightings in area for user to select from
  const buildList = () => {
    if (possibleSightings.length === 0) {
      return (
        <div className="messageContainer">
          <div className="message">Loading...</div>
        </div>
      );
    }

    const listToRender = possibleSightings.map((bird) => {
      if (
        bird.comName.toLowerCase().includes(formFields.birdSearch.toLowerCase())
      ) {
        return (
          <div className="messageContainer chatLine" key={bird.speciesCode}>
            <div
              className="message"
              onClick={() => {
                selectBird(bird);
                setShow({
                  ...show,
                  4: {
                    ...show[4],
                    attachClass: "complete",
                    value: bird.comName,
                  },
                  5: { ...show[5], show: 0 },
                  6: { ...show[6], show: 1 },
                });
              }}
            >
              {bird.comName}
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

    let listToRenderFiltered = listToRender.filter((entry) => entry);

    if (listToRenderFiltered.length > 0 && listToRenderFiltered.length < 6) {
      return listToRenderFiltered;
    } else if (listToRenderFiltered.length >= 6) {
      return listToRenderFiltered.slice(0, 4);
    } else {
      return <div id="message alignRight">no results found</div>;
    }
  };

  return (
    <div className="container">
      {/* #1 */}
      <TypedLine
        text="Hey there. Looking for birds? I'm here to help locate recent sightings in your area. To start, enter your zip code so I know where to look."
        status={show[1].show}
        activeTyping={show[1].activeTyping}
        callback={() =>
          setShow({
            ...show,
            1: { ...show[1], activeTyping: 0 },
            2: { ...show[2], show: 1 },
          })
        }
      />
      {/* #2 */}
      <NonTypedElement
        status={show[2].show}
        attachClass={show[2].attachClass}
        value={show[2].value}
      >
        <div className={`alignRight chatLine ${show[2].attachClass}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (states[e.target.zippy.value.toString()]) {
                setZipCode(e.target.zippy.value.toString());
                setShow({
                  ...show,
                  2: {
                    ...show[2],
                    attachClass: "complete",
                    value: e.target.zippy.value,
                  },
                  3: { ...show[3], show: 1 },
                });
              } else {
                setShow({
                  ...show,
                  2: {
                    ...show[2],
                    error: 1,
                  },
                });
              }
            }}
          >
            <input
              className="width90"
              type="number"
              pattern="\d*"
              name="zippy"
            ></input>
            <input className="message okSubmit" type="submit" value="ok" />
          </form>
          {show[2].error === 1 || zip === "INVALID" ? (
            <div id="message alignRight">zip code invalid</div>
          ) : null}
        </div>
      </NonTypedElement>
      {/* #3 */}
      {zip ? (
        <TypedLine
          text={`Great, we'll look for birds around ${zip.city}. Type the name of the bird you'd like to find and select from the list that appears below.`}
          status={show[3].show}
          activeTyping={show[3].activeTyping}
          callback={() => {
            setShow({
              ...show,
              3: { ...show[3], activeTyping: 0 },
              4: { ...show[4], show: 1 },
            });
            getPossibleSightings(zip.stateID);
          }}
        />
      ) : null}
      {/* #4 */}
      <NonTypedElement
        status={show[4].show}
        attachClass={show[4].attachClass}
        value={show[4].value}
      >
        <div className="alignRight chatLine">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              onChange={(e) => {
                setFormFields({ ...formFields, birdSearch: e.target.value });
                setShow({ ...show, 5: { ...show[5], show: 1 } });
              }}
              value={formFields.birdSearch}
              name="birdSearch"
            ></input>
          </form>
        </div>
      </NonTypedElement>
      {/* #5 */}
      {show[5].show ? buildList() : null}
      {/* #6 */}
      {show[6].show && selectedBird ? (
        <TypedLine
          text={`So you're looking for ${selectedBird.comName}s?`}
          status={1}
          activeTyping={show[6].activeTyping}
          callback={() =>
            setShow({
              ...show,
              6: { ...show[6], activeTyping: 0 },
              7: { ...show[7], show: 1 },
            })
          }
        />
      ) : null}
      {/* #7 */}
      <NonTypedElement status={show[7].show}>
        <div className="messageContainer chatLine">
          {" "}
          <div
            className="message"
            onClick={() => {
              getRecentSpeciesSightings(
                selectedBird.speciesCode,
                zip.zip,
                zip.stateID
              );
              setShow({ ...show, 8: { ...show[8], show: 1 } });
            }}
          >
            Yes
          </div>
        </div>
        <div className="messageContainer chatLine">
          <div
            className="message"
            onClick={() => {
              setFormFields({ ...formFields, birdSearch: "" });
              setShow({
                ...show,
                4: { ...show[4], show: 1, attachClass: "", value: "" },
                5: { ...show[5], show: 0 },
                6: { ...show[6], show: 0, activeTyping: 1 },
                7: { ...show[7], show: 0 },
              });
            }}
          >
            No
          </div>
        </div>
      </NonTypedElement>
      {/* #8 */}
      {show[8].show & (recentSightings.length > 0) ? (
        <TypedLine
          text={`The most recent ${
            selectedBird.comName
          } sighting in your state was ${Math.round(
            recentSightings[0].distanceFromCurrentLocation
          )} miles away on ${recentSightings[0].obsDt.substr(0, 10)}`}
          status={1}
          activeTyping={show[8].activeTyping}
          callback={() =>
            setShow({
              ...show,
              8: { ...show[8], activeTyping: 0 },
              9: { ...show[9], show: 1 },
            })
          }
        ></TypedLine>
      ) : null}
      {/* #9 */}
      <TypedLine
        text="Would you like to see additional sightings?"
        status={show[9].show}
        activeTyping={show[9].activeTyping}
        callback={() =>
          setShow({
            ...show,
            9: { ...show[9], activeTyping: 0 },
            10: { ...show[10], show: 1 },
          })
        }
      ></TypedLine>
      {/* #10 */}
      {selectedBird && zip ? (
        <NonTypedElement status={show[10].show}>
          <div className="messageContainer chatLine">
            <div onClick={() => history.push("/sightings")} className="message">
              Yes
            </div>
          </div>
          <div className="messageContainer chatLine">
            <div
              className="message"
              onClick={() => {
                setShow({
                  ...show,
                  11: { ...show[11], show: 1 },
                });
              }}
            >
              No
            </div>
          </div>
        </NonTypedElement>
      ) : null}
      {/* #11 */}
      <TypedLine
        text="Thanks for stopping by ... now get out there and find some birds!"
        status={show[11].show}
        activeTyping={show[11].activeTyping}
        callback={() =>
          setShow({
            ...show,
            11: { ...show[11], activeTyping: 0 },
          })
        }
      ></TypedLine>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    zip: state.zip,
    possibleSightings: state.possibleSightings,
    recentSightings: state.recentSightings,
    selectedBird: state.selectedBird,
  };
};

export default connect(mapStateToProps, {
  setZipCode,
  getPossibleSightings,
  getRecentSpeciesSightings,
  selectBird,
})(ChatBot);
