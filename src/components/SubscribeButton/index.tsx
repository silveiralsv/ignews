import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface ISubscribeButtonProps{
  priceId: string
}

export function SubscribeButton({priceId}:ISubscribeButtonProps) {
  const [session] = useSession();
  async function handleSubscribe() {
    if (!session){
      signIn('gihub');
      return;
    }
    try {
      console.log('here');
      const response = await api.post('/subscribe');
      console.log('here2');
      const {sessionId} = response.data;

      const stripe = await getStripeJS();
      await stripe.redirectToCheckout({sessionId});
    
    } catch (error) {
      alert(error.message);
    }
    

  }

  
  return (
    <button 
    type="button"
    className={styles.subscribeButton}
    onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}