"use client";
import React from 'react';

interface IProps {
  content: {
    icon: string;
    title: string;
    details: string;
  }
}

export default function Service(props: Readonly<IProps>){
  return (
    <div className="mi-service">
      <h5>{props.content.title}</h5>
      <p>{props.content.details}</p>
    </div>
  )
};