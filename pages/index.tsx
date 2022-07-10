import Head from "next/head";
import { memo, useState, useEffect, Dispatch, SetStateAction } from "react";
import styles from "../styles/Home.module.css";
import type { NextPage } from "next";

const download = async (setUrl: Dispatch<SetStateAction<string | null>>) => {
  const response = await fetch("/api/image");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  setUrl(url);
  download(setUrl);
};

const Image = memo(() => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    download(setUrl);
  }, []);

  return url && <img src={url} width="100%" height="100%" />;
});
Image.displayName = "Image";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Garden</title>
        <meta name="description" content="My Garden" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Image />
      </main>
    </div>
  );
};

export default Home;
