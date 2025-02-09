# Dev na Gringa

The central hub for the Dev na Gringa community - helping Brazilian developers build international careers in tech.

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

## Getting Started

### Prerequisites

1. Node.js 22+ (check `.nvmrc` for the exact version)
2. A [Convex](https://www.convex.dev/) account (free tier available)
3. npm or pnpm (we use pnpm)

### Setting Up the Development Environment

1. Install dependencies:

```bash
pnpm install
```

2. Set up Convex:

   - Create a free account at [Convex](https://www.convex.dev/)
   - Create a new project in the Convex dashboard
   - Copy your deployment URL from the dashboard
   - Create a `.env.local` file in the root directory with:

   ```env
   NEXT_PUBLIC_CONVEX_URL=your_deployment_url_here
   ```

3. Run both the Next.js development server and Convex development server:

```bash
# In one terminal, start the Convex dev server
pnpm convex dev

# In another terminal, start the Next.js dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## Contributing

We welcome contributions to improve the Dev na Gringa platform. Please feel free to submit issues and pull requests.

## License

This project is licensed under multiple licenses:

- All third-party components are licensed under their original licenses
- All other content is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
