import React from "react";
import Link from "next/link";
import Image from "next/image";

function Blog(props: any) {
  const { id, featuredImage, title, createDay, createMonth, filesource } =
    props.data;
  const getShortMonth = (month: any) => {
    return month.slice(0, 3);
  };
  const getNospaceTitle = (filesource: any) => {
    let tempArr = filesource.split("/");
    let fileName = tempArr[tempArr.length - 1];
    let getName = fileName.slice(0, -3);
    return getName;
  };
  return (
    <Link href={`${id}/${getNospaceTitle(filesource)}`}>
        <div className="mi-blog">
        <div className="mi-blog-image">
            <Image
            src={featuredImage}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            alt={title}
            />
            <div className="mi-blog-date">
            <span className="date">{createDay}</span>
            <span className="month">{getShortMonth(createMonth)}</span>
            </div>
        </div>
        <div className="mi-blog-content">
            <h5>
            {title}
            </h5>
        </div>
        </div>
    </Link>
  );
}

export default Blog;
