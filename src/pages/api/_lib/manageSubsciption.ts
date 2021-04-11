import {query as q} from 'faunadb';

import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string
) {
    console.log('here1');
    const userRef = await fauna.query(
        q.Select(
            'ref',
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )
    console.log('here2');
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log('here3');
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    console.log('saving this shit')

    await fauna.query(
        q.Create(
            'subscriptions',
            { data: subscriptionData }
        )
    )


}