import React from "react";
import ReactDOM from "react-dom";
import "./content_script.css";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

const convertToNumber = (str: string): number => {
  return str.length ? Number(str.replace(/[,|%]/g, "")) : 0;
};

const tableHightlight = () => {
  const tables = document.getElementById("quarters")?.querySelector("table");
  if (tables) {
    console.log("table found");
    const thCells = tables.querySelectorAll("th");
    const allYears = Array.from(thCells).map((th) => th.textContent);
    const trs = tables.querySelectorAll("tr");
    const tableData = Array.from(trs).map((tr) => {
      const tds = tr.querySelectorAll("td");
      return Array.from(tds).map((td, index) => {
        if (index === 0) {
          return td.textContent?.trim().replace(/\s+/g, " ") || "";
        }
        return convertToNumber(td.textContent || "");
      });
    });

    console.log({ tableData, allYears });
    trs.forEach((tr, trIndex) => {
      if (trIndex !== 1) return;
      const tds = tr.querySelectorAll("td");
      tds.forEach((td, tdIndex) => {
        if (tdIndex === 0) {
          return;
        } else {
          const currentValue = tableData[trIndex][tdIndex] as number;
          const previousValue = tableData[trIndex][tdIndex - 1] as number;
          const color = currentValue > previousValue ? "green-bg" : "red-bg";
          td.classList.add("SA");
          td.classList.add(color);
        }
      });
    });
  }
};

const Button = () => {
  return (
    <span
      style={{
        cursor: "pointer",
        fontSize: "14px",
        paddingLeft: "14px",
      }}
      onClick={tableHightlight}
    >
      Activate
    </span>
  );
};

// Find the heading with the text "Quarterly Results"
const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
let targetHeading: HTMLElement | null = null;

headings.forEach((heading) => {
  if (
    heading instanceof HTMLElement &&
    heading.innerText.trim() === "Quarterly Results"
  ) {
    targetHeading = heading;
  }
});

if (targetHeading) {
  const container = document.createElement("span");
  ReactDOM.render(<Button />, container);
  (targetHeading as HTMLElement).appendChild(container);

  console.log("Added 'Show Graph' text after 'Quarterly Results' heading.");
} else {
  console.log("'Quarterly Results' heading not found.");
}
