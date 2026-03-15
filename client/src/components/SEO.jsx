// SEO — Dynamic page titles and meta tags
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | NBL Stores` : "NBL Stores"}</title>
      <meta name="description" content={description || "Premium fashion for men, women & kids. Quality fabrics, modern designs, honest prices — delivered across Pakistan."} />
    </Helmet>
  );
};

export default SEO;