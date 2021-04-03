import { query as q } from 'faunadb';
import NextAuth from 'next-auth'

import { fauna } from '../../../services/fauna';

import Providers from 'next-auth/providers'

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user'
        }),
    ],
    callbacks: {
       async signIn(user, account, profile) {
           const { email } = user;

           try {
               await fauna.query(
                   q.If(
                       q.Not(
                           q.Exists(
                               q.Match(
                                   q.Index('user_by_email'),
                                   q.Casefold(email)
                               )   
                           )
                       ),
                       q.Create(
                           q.Collection('users'),
                           {data: {email}}
                       ),
                       q.Get(
                           q.Match(
                               q.Index('user_by_email'),
                               q.Casefold(email)
                           )  
                       )
                   )
               )

               return true
           } catch {
               return false;
           }
       },
    }
})