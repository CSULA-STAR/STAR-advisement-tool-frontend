// OpenNewTab.js
import React from "react";
import { createRoot } from "react-dom/client";
import TableComp from "./TableComp";

const NewTabTable = (tableData) => {
  const newTab = window.open("", "_blank");
  if (newTab) {
    newTab.document.write(
      '<!DOCTYPE html><html><head><title>Table</title></head><body><div id="root"></div></body></html>'
    );
    newTab.document.close();

    const mountNode = newTab.document.getElementById("root");

    const renderApp = () => {
      const root = createRoot(mountNode);
      root.render(<TableComp data={tableData} />);
    };

    if (newTab.document.readyState === "complete") {
      renderApp();
    } else {
      newTab.onload = () => {
        renderApp();
      };
    }
  } else {
    console.error(
      "Unable to open new tab. Please check your browser's pop-up settings."
    );
  }
};

export default NewTabTable;
