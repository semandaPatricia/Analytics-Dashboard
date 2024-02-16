
const { NextRequest, NextResponse } = require('next/server');
const { analytics } = require('./utils/analytics');

async function middleware(req) {
  if (req.nextUrl.pathname === '/') {
    try {
      analytics.track('pageview', {
        page: '/',
      });
    } catch (err) {  
      console.error(err);
    }
  }

  return NextResponse.next();
}

middleware.matcher = {
  matcher: ['/'],
};

module.exports = { middleware };


