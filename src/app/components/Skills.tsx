"use client";
import TrackVisibility from "react-on-screen";
import Progress from "../components/Progress";

export default function Skills(props: any) {
    return (
        <>
        {props.skills.map((skill: any) => (
            <TrackVisibility once className="col-lg-6 mt-30" key={skill.title}>
              <Progress title={skill.title} percentage={skill.value} />
            </TrackVisibility>
          ))}
        </>
    )
}