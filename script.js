document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const w = 900;
      const h = 520;
      const p = 20;
      const pl = 60;

      const dopeColor = "#f02a26";
      const noDopeColor = "#3c50e3";

      const legendData = [
        { label: "No doping allegations", color: noDopeColor },
        { label: "Doping allegations", color: dopeColor },
      ];

      function dotColor(string) {
        if (string === "") {
          return noDopeColor;
        } else {
          return dopeColor;
        }
      }

      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.Year) - 1,
          d3.max(data, (d) => d.Year) + 1,
        ])
        .range([pl, w - p]);

      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.Seconds * 1000) - 10000,
          d3.max(data, (d) => d.Seconds * 1000) + 10000,
        ])
        .range([h - p, p]);

      const svg = d3
        .select("#graph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".4"));
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - p})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${pl})`)
        .call(yAxis);

      svg
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -200)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Time in Minutes")
        .style("font-size", "1.2rem");

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(d.Seconds * 1000))
        .attr("r", 10)
        .style("fill", (d) => dotColor(d.Doping))
        .attr("class", "dot")
        .attr("id", (d, i) => i)
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => d3.timeSecond(d.Seconds * 1000))
        .on("mouseover", (e) => {
          const i = data[e.target.getAttribute("id")];
          let text = `${i.Name}: ${i.Nationality}<br>Year: ${i.Year}, Time: ${
            i.Time
          }${i.Doping.length > 0 ? `<br><br>${i.Doping}` : ""}`;
          tooltip
            .style("opacity", 0.95)
            .style("left", e.pageX + 20 + "px")
            .style("top", e.pageY - 40 + "px")
            .html(text);
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0).style("left", 0).style("top", 0);
        });

      const legend = svg
        .append("g")
        .attr("transform", "translate(700, 300)")
        .attr("id", "legend");

      const legendItems = legend
        .selectAll("g")
        .data(legendData)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legendItems
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) {
          return d.color;
        });

      legendItems
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
          return d.label;
        });
    });
});
