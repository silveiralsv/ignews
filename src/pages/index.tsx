import { GetStaticProps } from "next";
import Head from "next/head";

import styles from "./home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

// No Next temos três formas de fazer uma chamada:

// Client-side:             Não precisamos de indexação, e podemos performar
//                          pelo client

// Server-side:             Precisamos da indexação do Google porém usam 
//                          informações que sofrem alterações

// Static Site Generation:  Precisamos da indexação do google, 
//                          porém o conteúdo é estático

interface IHomeProps{
  product: { 
    priceId: string;
    amount: number;
  }
}

export default function Home({product} : IHomeProps) {
  return (
    <>
      <Head>
        <title>home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🖐🏼 Hey, welcome!</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications
            <span> for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1IbqIqFXlqUOZeltbunY4Iiz");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),    
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
