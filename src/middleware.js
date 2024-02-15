const { NextRequest, NextResponse } = require('next/server');
const { analytics } = require('./utils/analytics');

async function middleware(req) {
  if (req.nextUrl.pathname === '/') {
    try {
      analytics.track('pageview', {
        page: '/',
        country: req.geo?.country,
      });
    } catch (err) {
      // fail silently to not affect request
      console.error(err);
    }
  }

  return NextResponse.next();
}

module.exports = middleware;

module.exports.matcher = {
  matcher: ['/'],
};
