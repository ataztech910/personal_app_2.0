import React from "react";

function Sectiontitle(props: {title: string}) {
  return (
    <div className="mi-sectiontitle">
      <h2>{props.title}</h2>
      <span>{props.title}</span>
    </div>
  );
}

export default Sectiontitle;
