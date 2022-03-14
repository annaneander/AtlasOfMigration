import React, { useEffect, useState, useLayoutEffect } from "react";
import Slider from '@mui/material/Slider';
import "./styles/sideBar.min.css";
import { ImmigrationButton, EmigrationButton, MigrationButton } from './styles/components/Button.js'
import { CountryNameID } from "./const/CountryNameID";

/* immigration = 0, emigration = 1, net migration = 2 */
const information = [
  "Immigration is the international movement of people to a destination country of which they are not natives or where they do not possess citizenship in order to settle as permanent residents or naturalized citizens.",
  "Emigration is the act of leaving a resident country or place of residence with the intent to settle elsewhere (to permanently leave a country).",
  "Net migration is the difference between immigration into and emigration from the area during the year. Net migration is therefore negative when the number of emigrants exceeds the number of immigrants.",
  "Have you ever thought about why people migrate? Has time influenced our perception of migration? <br/> <br/>With the Atlas of Migration we created a visual tool that allows you to navigate through the increasingly complex landscape of international migration patterns."
];
const headLine = ["Immigration", "Emigration", "Net Migration", "Welcome"];

function SideBar({ model, year, setCountryID, setView, view }) {
  const [input, setInput] = useState("");
  const [nbrChoices, setNbrChoices] = useState(0);
  const [selCountries, setSelCountries] = useState([]);
  const [detailView, setDetailView] = useState(false); /* false world , true detail*/

  useEffect(() => {}, [view, year]);

  //const [view, setView] = React.useState(model.view);
  const [value, setValue] = React.useState([0, 100]);

  const searchCountry = (e) => {
     if (e.key === "Enter") {
       if (nbrChoices === 1) {
         setInput(selCountries[0].name);
         setDetailView(true);
         console.log("country matched");
         console.log(selCountries[0].id);
         setCountryID(selCountries[0].id);
         model.setCountryID(selCountries[0].id);
       }
     }
   };

   const onInput = (e) => {
     setInput(e.target.value);

     const filteredInput = CountryNameID.filter(
       (x) => x.name.toLowerCase().indexOf(input.toLowerCase()) > -1
     );

     setNbrChoices(filteredInput.length);
     setSelCountries(filteredInput);
  };

  const changeView = (e) => {
    setView(e.target.value)
  };

  function valuetext(value) {
    return `${value}`;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="sideBar">
      { detailView ? (
        <div>
          <button id="world" onClick={() => setDetailView(false)}>{" "}Back</button>
          <h3> Country: {model.countryName} </h3>
        </div>
      ) : (
      <>
      <h1>{headLine[view]}</h1>
      <p>{information[view]}</p>

    <div className="filter">
    <h2>What do you want to know more about?</h2>
      <ImmigrationButton name={view} value="0" onClick={changeView}>Show Immigration</ImmigrationButton>
      <MigrationButton name={view} value="2" onClick={changeView}>Show Net Migration</MigrationButton>
      <EmigrationButton name={view} value="1" onClick={changeView}>Show Emigration</EmigrationButton>
    </div>

      <Slider
        getAriaLabel = {() => ''}
        value = {value}
        onChange = {handleChange}
        valueLabelDisplay = "auto"
        getAriaValueText = {valuetext}
      />

    <div id="searchBox">
      <h2>What country are you looking for?</h2>
      <input type="text" id="inputField" onChange={onInput} onKeyDown={searchCountry} value={input} placeholder="Search..." / >
      <select name="countries" style={{ minWidth: 180 }}>
        {selCountries.map((x) => (
          <option key={x.id} value={x.name}>
            {" "}
            {x.name}{" "}
          </option>
        ))}
      </select>
    </div>
    </>
      )}
  </div>
  );
}

export default SideBar;
