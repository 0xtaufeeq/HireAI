This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Enabling PostHog Analytics

To enable PostHog analytics in this project, you’ll need to configure your environment variables. Follow these steps:

1. **Get Your PostHog Project API Key**

    - Log in to your PostHog account (or your self-hosted instance).

    - Go to Project Settings > API Keys.

    - Copy your Project API Key (sometimes called "Project Key" or "Public Key").

2. **Set Up Environment Variables**

    - Create or update your .env.local file in the root of your project with the following variables:

    ```bash
    NEXT_PUBLIC_POSTHOG_KEY=phc_abc123def456gh789ijklmno
    NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
    ```

3. **Restart Your Development Server**

    - After updating the .env.local file, restart your Next.js development server to apply the changes:

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

4. **Verify Analytics**

    - Open your app and interact with it.

    - Go to your PostHog dashboard and check the "Activity" section to see if events are being received.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
