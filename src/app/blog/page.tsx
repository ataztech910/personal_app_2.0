import { getBlogs } from "@/lib/data-fetching";
import Sectiontitle from "../components/Sectiontitle";
import BlogsView from "../components/blogView";

export default async function Blog() {
    const blogs = await getBlogs();
    return (
        <div className="mi-about mi-section mi-padding-top mi-padding-bottom">
          <div className="container">
            <Sectiontitle title="Recent Blogs" />
            <BlogsView blogs={blogs} />
          </div>
        </div>
    );
}