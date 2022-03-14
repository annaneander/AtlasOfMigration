import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useWindowDimensions from "./useWindowDimensions.js";
import * as d3 from "d3";
import "./App.css";
import "./TimeLine.css";

/* time runs 1990-2020, in 5 year interval + 2017 and 2019 */
const yearRange = [
  new Date(1990, 6, 1), //6 equals 1 July
  new Date(1995, 6, 1),
  new Date(2000, 6, 1),
  new Date(2005, 6, 1),
  new Date(2010, 6, 1),
  new Date(2015, 6, 1),
  // new Date(2017, 6, 1),
  // new Date(2019, 6, 1),
  new Date(2020, 6, 1),
];

const yData = ["Pandemics", "Nature disaster"];

function TimeLine({ model, setYear }) {
  const svgContainerRef = useRef(null);
  //const [year, setYear] = useState(model.year);
  const [countryID, setCountryID] = useState(model.countryID);
  const [sex, setSex] = useState(0);
  const dx = 20; //for now, set to responsive
  //const [data, setData] = useState(model.getTotalEmigration());
  let data = model.getTotalEmigration()
  const timeFormat = d3.timeFormat("%Y");
  const timeDomain = yearRange.map((x) => timeFormat(x));
  const axisMargin = 50; //for now

  /* get data for one year */
  // let groupYear = d3.group(worldData,
  //     d => d.DestinationID,
  //     d => d.OriginID)
  //     .get(900)
  //     .get(900)
  //   //console.log(groupYear);

  /* update this local or update model? */
  const updateYear = (x) => {
    //format input to right year?
    setYear(x);
    model.setYear(x);
    //console.log("new year", model.year);
  };

  /* set to size of container ? */
  const dimensions = {
    //width = document.getElementById('container').offsetWidth;//includes margin,border,padding
    //height = document.getElementById('container').offsetHeight;//includes margin,border,padding
    // width: svgContainerRef.current.clientWidth,
    // height: svgContainerRef.current.clientHeight,
    //  margin: { top: 600, left:`10vh`, bottom: `10vh`, right: `30vw` }, //set to responsive
    width: useWindowDimensions().width * 0.7,
    height: useWindowDimensions().height * 0.2,
  };

  const margin = { top: 20, left: 40, bottom: 20, right: 50 };

  //  useLayoutEffect(() => {
  useEffect(() => {
    console.log(model.countryID);
    console.log(model.countryName);
    data = model.getTotalEmigration(model.countryID);
    if (data) {
      //console.log(data);
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(yearRange))
        .range([margin.left, dimensions.width - margin.right])
        .nice();

      const shiftXAxis = 100;
      const shiftYAxis = 55;

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.total)])
        .range([dimensions.height - margin.top, margin.bottom])
        .nice();

      // Clear svg content before adding new elements
      const svgEl = d3.select(svgContainerRef.current);
      svgEl.selectAll("*").remove();

      //console.log(data)

      svgEl
        .append("g")
        .attr("transform", `translate(30,${shiftXAxis})`)
        .attr("id", "bottom")
        .style("font-size", "16px")
        .attr("color", "red");

      const xAxis = d3
        .axisBottom(xScale)
        //.ticks(d3.timeYear.every(5))
        .ticks(7);
      //.tickValues(timeFormat)
      //.tickFormat(x => timeFormat(x))
      svgEl.select("#bottom").call(xAxis);

      /*  add barchart with values corresponding to ... */
      const yAxis = d3.axisLeft(yScale).ticks(3).tickFormat(d3.format(".2s"));

      svgEl
        .append("g")
        .attr("transform", `translate(${shiftYAxis} , -15)`)
        .attr("id", "left")
        .style("font-size", "16px")
        .attr("color", "red");
      svgEl.select("#left").call(yAxis);

      //  data.forEach(x => console.log("total: " ,x.total," --> y: " ,yScale(x.total)))
      //data.forEach(x => console.log("date: " ,x.date," --> x: " ,xScale(x.date)))

      //TODO check for NAN show some warning when value does not exist!

      d3.select("#bottom")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => xScale(d.date) - dx)
        .attr("y", (d) => yScale(d.total) - shiftXAxis - 15) //This value is strange!!
        .attr(
          "height",
          (d) =>
            dimensions.height - margin.top - margin.bottom - yScale(d.total)
        )
        //.attr("height", d => yScale(d.total)/2) //base on data
        .attr("width", dx)
        .style("fill", isNaN(d => d.total) ? "blue" : "pink");

      d3.selectAll("rect")
        .on("click", (d, i) => {
          //console.log("click bar " )
          //  console.log(timeFormat(i.date));
          updateYear(timeFormat(i.date));
        })
        .on("mouseover", (d, i) => {
          //  console.log("mouse over bar ",  )
        });
    }
  }, [data]);

  // position is set with css
  return (
    <svg
      id="timeLine"
      width={dimensions.width}
      height={dimensions.height}
      transform="translate(250, 600)"
      style={{ backgroundColor: "#121242" }}
      ref={svgContainerRef}
    ></svg>
  );
}

export default TimeLine;
