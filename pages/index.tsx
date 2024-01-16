import type { NextPage } from "next";
import Head from "next/head";
import { Gameboard } from "../components/Gameboard";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Battleship</title>
      </Head>
      <Gameboard />
    </div>
  );
};

export default Home;
