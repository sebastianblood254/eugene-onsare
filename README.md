# VISION.COM

A trading website prototype for a compliance-first derivatives and options platform. The site includes:

- `index.html` — homepage and site endpoint presentation
- `trade.html` — trading overview with broker integration guidance
- `kyc.html` — KYC verification flow
- `login.html` — login page
- `signup.html` — signup page
- `broker.html` — sample broker API integration page
- `server.js` — example Node backend for auth and broker data stubs

## Local development

1. Install dependencies:

```powershell
npm install
```

2. Run the server locally:

```powershell
npm start
```

3. Open `http://localhost:3000` in your browser.

## Broker integration

This project includes a mock broker integration sample:

- Front-end buttons on `broker.html`
- Backend API routes in `server.js`
- Sample endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
  - `GET /api/broker/account`
  - `GET /api/broker/quote`

For production, replace the sample backend with a real brokerage API provider such as Deriv.com and implement secure server-side credential management.

## Deployment options

### Static site deployment

If you only need the front-end pages, you can deploy to GitHub Pages:

- Push the repository to GitHub.
- Enable GitHub Pages from the repository settings.
- Set the publishing source to the `main` branch.
- Use `https://vision.com` if you own the domain and configure a custom domain.

### Full deployment with Node backend

To deploy the full app with sample API endpoints, use services such as Vercel, Render, or any Node-compatible host.

- Deploy `server.js` as the application entry point.
- Set `PORT` from the hosting provider environment.
- Configure a custom domain such as `vision.com`.

## Domain and endpoint

The final site endpoint is intended as:

`https://vision.com`

When deploying, point your DNS record to your hosting provider and configure the custom domain in the host settings.

## Notes

This prototype does not process real trades or real identity verification. It is a front-end and server sample for a trading site concept.
