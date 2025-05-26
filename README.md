# Dev na Gringa

The central hub for the Dev na Gringa community - helping Brazilian developers build international careers in tech.

## Getting Started

### Prerequisites

1. Node.js 22+ (check `.nvmrc` for the exact version)
2. A [Convex](https://www.convex.dev/) account (free tier available) - only needed if working with convex-related features like auth and others
3. npm or pnpm (we use pnpm)

### Setting Up the Development Environment

1. Install dependencies:

```bash
pnpm install
```

2. [Optional] Set up Convex (if you plan on working in features that use it):

   - Create a free account at [Convex](https://www.convex.dev/)
   - Create a new project in the Convex dashboard
   - Copy your deployment URL from the dashboard
   - Duplicate the example `.env` into a `.env.local` file in the root directory
   - Add the CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL to the `.env.local` file

3. [Optional] Set up PostHog (if you plan on working in features that use it):

   - Create a free account at [PostHog](https://posthog.com/)
   - Create a new project in the PostHog dashboard
   - Copy your project ID from the dashboard
   - Duplicate the example `.env` into a `.env.local` file in the root directory
   - Add the NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST to the `.env.local` file

4. Run both the Next.js development server and Convex development server:

```bash
# In one terminal, start the Convex dev server if you set it up
pnpm convex dev

# In another terminal, start the Next.js dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note that, if you don't set up PostHog/Convex, expect some errors to pop up on the console.

But if you are mainly gonna be working on the tools, there's no need fror that.

## About the Project

Dev na Gringa is a platform dedicated to empowering Brazilian developers to build successful international careers. Our community provides mentorship, exclusive content, and tools to help developers navigate the global tech market.

### Main Goals

- Serve as the central hub for the Dev na Gringa community
- Connect Brazilian developers interested in international opportunities
- Provide practical tools and resources for career development
- Offer mentorship and guidance from experienced professionals
- Share real experiences and insights about working for international companies

### Key Features

- [Newsletter](http://newsletter.nagringa.dev/) - Exclusive content about international tech careers
- [Community Hub](http://nagringa.dev/) - Central platform for community interaction
- **Practical Tools:**
  - [CLT vs PJ Calculator](https://www.nagringa.dev/calculadora-clt-vs-pj) - Compare different employment models
  - [Invoice Builder](https://www.nagringa.dev/gerador-de-invoice) - Generate professional invoices
  - AI Resume Reviewer (Coming Soon) - Get instant feedback on your resume

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Framer Motion](https://www.framer.com/motion/) - Animation library

### Backend

- [Convex](https://www.convex.dev/) - Backend platform with real-time capabilities
- [Resend](https://resend.com/) - Email service provider

### Testing

- [Vitest](https://vitest.dev/) - Unit testing framework

### Deployment

- [Vercel](https://vercel.com/) - Deployment platform. It's deployed by [this GitHub Action](./.github/workflows/test.yml) after building and successfully running the tests.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## Contributing

We welcome contributions to improve the Dev na Gringa platform. Please feel free to submit issues and pull requests.
